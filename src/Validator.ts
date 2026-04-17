import { Quad } from "@rdfjs/types";
import { Parser, Store } from 'n3';
import { IODRLValidator, ValidatorResult } from "./Types";
import { DataFactory } from 'rdf-data-factory';
import { readFileSync } from 'fs';
import { join } from "path";
import { Validator } from "shacl-engine"

export class ODRLValidator implements IODRLValidator {
    protected shaclStore: Store;
    private shaclValidator: Validator;

    public constructor(){
        // ugly way to load in shacl file, should be more generic. 
        // Also, this approach makes it so the component will not work in the browser
        const parser = new Parser()
        const rawShape = readFileSync(join(__dirname, "shapes", "dummy-odrl-shape.ttl"), "utf-8") 
        this.shaclStore = new Store(parser.parse(rawShape)) 

        this.shaclValidator = new Validator(this.shaclStore, {factory: new DataFactory()});
    }

    public async validate(policies: Quad[]): Promise<ValidatorResult> {
        // SHACL validation bit (note: RDF-Validate-SHACL is ESM, so we use the shacl-engine) https://github.com/woutslabbinck/ODRL-shape/blob/main/index.ts
        // Also, shacl-engine is made for speed
        
        const report = await this.shaclValidator.validate({dataset: new Store(policies)})

        return {
            valid: report.conforms,
            validationResults: [],
            conflicts: []
        }
    }
}