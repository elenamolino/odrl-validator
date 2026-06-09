import { Quad } from "@rdfjs/types";
import { Parser, Store, Writer } from 'n3';
import { IODRLValidator, ValidatorResult } from "./Types";
import { DataFactory } from 'rdf-data-factory';
import { Validator } from "shacl-engine"
import { EyelingReasoner } from 'n3-utility'
import { Atomizer, RDF } from "odrl-atomization";
import { RULES } from "./rules/Rules";
import { SHAPES } from "./shapes/Shapes";

export class ODRLValidator implements IODRLValidator {
    private atomizer: Atomizer;

    protected shaclStore: Store;
    private shaclValidator: Validator;

    private n3Rules: string;

    public constructor(config?: { shape?: Quad[], n3Rules?: string }) {
        let shape: Quad[] = new Parser().parse(SHAPES);
        let n3Rules: string = RULES;

        if (config){
            shape = config.shape ?? shape;
            n3Rules = config.n3Rules ?? n3Rules;
        }
        this.atomizer = new Atomizer();
        this.shaclStore = new Store(shape);

        this.shaclValidator = new Validator(this.shaclStore, { factory: new DataFactory() });
        this.n3Rules = n3Rules;
    }

    public async validate(policies: Quad[]): Promise<ValidatorResult> {
        const output: ValidatorResult = {
            valid: false,
            validationResults: [],
            conflicts: []
        }

        let atomizedPolicies: Quad[];
        try {
            atomizedPolicies = await this.atomizer.atomize(policies);
        } catch (error) {
            console.error("Error atomizing policies:", error);
            atomizedPolicies = policies;
        }

        const report = await this.shaclValidator.validate({ dataset: new Store(atomizedPolicies) })
        if (report.conforms === false) {

            const getResults = (result: any): any[] => {
                if (result.results && result.results.length > 0) {
                    return result.results.flatMap((r: any) => getResults(r))
                }

                const messages =
                    result.message?.map((m: any) => m.value)
                    ?? result._message?.()?.map((m: any) => m.value)
                    ?? []

                return messages.map((message: string) => ({
                    message,
                    focusNode: result.focusNode?.value,
                    valueNode: result.value?.value,
                    resultSeverity: result.severity?.value
                }))
            }

            output.validationResults = report.results.flatMap((result: any) =>
                getResults(result)
            )

            const duplicatedErrorResults = new Set<string>()

            output.validationResults = output.validationResults.filter((result: any) => {
                const key = JSON.stringify(result)
                return duplicatedErrorResults.has(key) ? false : duplicatedErrorResults.add(key)
            })

            const hasViolation = output.validationResults.some((result: any) =>
                result.resultSeverity === "http://www.w3.org/ns/shacl#Violation"
            )

            output.valid = !hasViolation

            return output
        }


        output.valid = report.conforms;

        // Notation3 Conflict Detection
        const conflictReasoningResult = await new EyelingReasoner().reason(new Store(atomizedPolicies), this.n3Rules);

        const conflicts = conflictReasoningResult.getQuads(null, RDF.type, "http://example.org/conflict#Conflict", null);

        for (const conflict of conflicts) {
            // TODO: parse the conflicts properly
            // 1. TODO: rewrite the rules to all have conflict type, the reason and the two rules
            // 2. TODO: change the rules config (makeRules.ts script)
            // 3. TODO: create a proper error message
            const message = new Writer().quadsToString(conflictReasoningResult.getQuads(null, null, null, null));
            output.conflicts.push({
                message: message,
                type: "DeonticConflict",
                severity: "error",
                ruleA: "",
                ruleB: ""
        })
        }
        return output
    }
}