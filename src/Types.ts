import type { Quad } from '@rdfjs/types';


/**
 * Severity levels for any validation issue or conflict.
 */
export type Severity = 'error' | 'warning' | 'info'


/**
 * Generic validation issue (syntacic + semantics)
 */
export interface ValidationResult{
  message: string;
}

/**
 * Description of a conflict between two rules
 */
export interface ConflictResult {
  type:
    | 'DeonticConflict'
    | 'ConstraintOperatorMismatchConflict'
    | 'LexSpecialisConflict'
    | 'RefinementConflict';
  message: string;
  severity: Severity;
  ruleA: string;
  ruleB: string;
}


/**
 * What the validator *expects* for this test case.
 */
export interface ValidatorResult {
  valid: boolean;

  /**
   * High-level expectation about conflicts.
   * TODO: maybe remove?
   */
  conflictExpectation: 'yes' | 'no' | 'maybe';
  // if empty, then it is valid
  validationResults: ValidationResult[];
  // if empty, then there are no conflicts
  conflicts: ConflictResult[];
}


/**
 * A complete ODRL validator test case.
 */
export interface ODRLTestCase {
  /** Identifier for the test */
  id: string;

  /** Path to TTL/N3 policy file */
  file: string;

  /** Parsed RDF representation loaded into an RDF/JS dataset */
  representation: Quad[];

  /** Expected validation output */
  expected: ValidatorResult;
}


export interface IODRLValidator {

  /**
   * Validate an ODRL policy represented as RDF quads.
   * NOTE: does both semantic validation and consistency checking?
   */
  validate(testCase: Quad[]): Promise<ValidatorResult>;
}


export interface IODRLTestCaseValidator {
  /**
   * Runs validation and compares actual vs expected.
   * Fails or reports mismatch according to test runner logic.
   */
  validateTestCase(testCase: ODRLTestCase): Promise<ValidatorResult>;
}
