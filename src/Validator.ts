import { Quad } from "@rdfjs/types";
import { Parser, Store, Writer } from 'n3';
import { IODRLValidator, ValidatorResult } from "./Types";
import { DataFactory } from 'rdf-data-factory';
import { readFileSync } from 'fs';
import { join } from "path";
import { Validator } from "shacl-engine"
import { reason } from "eyeling";
import { Atomizer} from "odrl-atomization";
export class ODRLValidator implements IODRLValidator {
    private atomizer: Atomizer;
    
    protected shaclStore: Store;
    private shaclValidator: Validator;

    private n3Rules: string;

    public constructor() {
        this.atomizer = new Atomizer();
        // ugly way to load in shacl file, should be more generic. 
        // Also, this approach makes it so the component will not work in the browser
        const parser = new Parser()
        const rawShape = readFileSync(join(__dirname, "shapes", "policy-core.ttl"), "utf-8")
        this.shaclStore = new Store(parser.parse(rawShape))

        this.shaclValidator = new Validator(this.shaclStore, { factory: new DataFactory() });
        this.n3Rules = readFileSync(join(__dirname, "rules", "rule1.n3"), "utf-8")
    }

    public async validate(policies: Quad[]): Promise<ValidatorResult> {
        // SHACL validation bit (note: RDF-Validate-SHACL is ESM, so we use the shacl-engine) https://github.com/woutslabbinck/ODRL-shape/blob/main/index.ts
        // Also, shacl-engine is made for speed
        const atomizedPolicies = await this.atomizer.atomize(policies);

        const output = {
            valid: false,
            validationResults: [],
            conflicts: []
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