import { Quad } from "@rdfjs/types";
import { Parser, Store, Writer } from 'n3';
import { IODRLValidator, ValidatorResult } from "./Types";
import { DataFactory } from 'rdf-data-factory';
import { Validator } from "shacl-engine"
import { EyelingReasoner } from 'n3-utility'
import { Atomizer, RDF } from "odrl-atomization";
import { RULES } from "./rules/Rules";
import { SHAPES } from "./shapes/Shapes";
import { DETECTION } from "./util/Vocabulary";

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

        // No valid RDF 
        if (!policies || policies.length === 0) {
            output.valid = false;
            output.validationResults.push({
                message: "No valid policy provided"
            })
            return output;
        }

        // Normalization of the policies
        let atomizedPolicies: Quad[];
        try {
            atomizedPolicies = await this.atomizer.atomize(policies);
        } catch (error) {
            console.error("Error atomizing policies:", error);
            atomizedPolicies = policies;
        }

        // SHACL Validation
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
                    severity: result.severity?.value
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
                result.severity === "http://www.w3.org/ns/shacl#Violation"
            )

            output.valid = !hasViolation

            // If there are any violations, conflict detection does not make sense
            if (hasViolation) {
                return output
            }
        } else {
            output.valid = true;
        }

        // Notation3 Conflict Detection
        const conflictReasoningResult = await new EyelingReasoner().reason(new Store(atomizedPolicies), this.n3Rules);

        const conflicts = conflictReasoningResult.getQuads(null, RDF.type, DETECTION.Conflict, null);
        for (const conflict of conflicts) {
            
            // NOTE: we expect that the inconsistency detection rules are well formed. 
            // That is they produce an output with two rules and a reason.
            const reason = conflictReasoningResult.getObjects(conflict.subject, DETECTION.reason, null)[0].value;
            const rules: string[] = conflictReasoningResult.getObjects(conflict.subject, DETECTION.rules, null).map(object => object.value);
            output.conflicts.push({
                message: reason,
                type: "DeonticConflict",
                severity: "error",
                ruleA: rules[0],
                ruleB: rules[1]
        })
        }
        return output
    }
}