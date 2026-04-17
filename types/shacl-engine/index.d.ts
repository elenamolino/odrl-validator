declare module "shacl-engine" {
  import type { DatasetCore, Term, DataFactory } from "@rdfjs/types";

  export interface ValidatorOptions {
    /**
     * RDF/JS DataFactory used to generate the report (required by the library).
     */
    factory: DataFactory;

    /** Enable collecting covered quads (enables debug/details/trace too). */
    coverage?: boolean;

    /** Generate debug results for successful validations. */
    debug?: boolean;

    /** Generate nested result details. */
    details?: boolean;

    /** Generate results for path traversing. */
    trace?: boolean;
  }

  export interface ValidationData {
    /** Dataset that contains the data quads (required). */
    dataset: DatasetCore;

    /** Initial focus nodes (optional). */
    terms?: Iterable<Term>;
  }

  export interface ShapesSelector {
    /** Initial set of shapes (optional). */
    terms?: Iterable<Term>;
  }

  /**
   * Minimal report shape (extend as you discover more fields you need).
   */
  export interface ValidationReport {
    conforms: boolean;
    // If you need more report fields later, add them here.
    // e.g. results?: unknown[];
    // dataset?: DatasetCore;
  }

  export class Validator {
    constructor(shapes: DatasetCore, options: ValidatorOptions);

    validate(data: ValidationData, shapes?: ShapesSelector): Promise<ValidationReport>;
  }
}

declare module "shacl-engine/Validator.js" {
  import type { DatasetCore, Term, DataFactory } from "@rdfjs/types";

  export interface ValidatorOptions {
    factory: DataFactory;
    coverage?: boolean;
    debug?: boolean;
    details?: boolean;
    trace?: boolean;
  }

  export interface ValidationData {
    dataset: DatasetCore;
    terms?: Iterable<Term>;
  }

  export interface ShapesSelector {
    terms?: Iterable<Term>;
  }

  export interface ValidationReport {
    conforms: boolean;
  }

  export default class Validator {
    constructor(shapes: DatasetCore, options: ValidatorOptions);
    validate(data: ValidationData, shapes?: ShapesSelector): Promise<ValidationReport>;
  }
}