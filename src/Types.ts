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
 * The output of ODRL Validation and detection
 */
export interface ValidatorResult {
  valid: boolean;

  // if empty, then it is valid
  validationResults: ValidationResult[];
  // if empty, then there are no conflicts
  conflicts: ConflictResult[];
}

/**
 * TestCaseResult
 */
export interface TestCaseResult {
  result: boolean;
  expectedResult: ValidatorResult;
  calculatedResult: ValidatorResult;
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
  validateTestCase(testCase: ODRLTestCase): Promise<TestCaseResult>;
}
