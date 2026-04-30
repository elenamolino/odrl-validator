import { Quad } from "@rdfjs/types";
import { Store, Writer } from 'n3';
import { IODRLValidator, ValidatorResult } from "./Types";
import { DataFactory } from 'rdf-data-factory';
import { Validator } from "shacl-engine"
import { reason } from "eyeling";
import { Atomizer } from "odrl-atomization";

export class ODRLValidator implements IODRLValidator {
    private atomizer: Atomizer;

    protected shaclStore: Store;
    private shaclValidator: Validator;

    private n3Rules: string;

    public constructor(config: { shape: Quad[], n3Rules: string }) {
        const { shape, n3Rules } = config;

        this.atomizer = new Atomizer();
        this.shaclStore = new Store(shape);

        this.shaclValidator = new Validator(this.shaclStore, { factory: new DataFactory() });
        this.n3Rules = n3Rules;
    }

    public async validate(policies: Quad[]): Promise<ValidatorResult> {
        const output = {
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
            output.validationResults = (report.results).map((result: any) => ({
                message: result.message[0].value,
                focusNode: result.focusNode?.value,
                resultSeverity: result.severity?.value
            }));
            return output
        }

        output.valid = report.conforms;

        // Notation3 Conflict Detection
        const conflicts = reason({ proofComments: false }, new Writer().quadsToString(atomizedPolicies) + "\n" + this.n3Rules)

        // unfortunately, @RdfJsReasonInput from the eyeling types cannot be used, so the policies have to be transformed to string
        // the rules are also kept as string

        // TODO: parse the conflicts properly
        output.conflicts.push(conflicts)

        return output
    }
}