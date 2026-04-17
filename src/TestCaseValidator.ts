import { IODRLTestCaseValidator, IODRLValidator, ODRLTestCase, TestCaseResult } from "./Types";
import { isDeepStrictEqual } from "node:util";

export class TestCaseValidator implements IODRLTestCaseValidator {
    private odrlValidator: IODRLValidator

    public constructor(config: { odrlValidator: IODRLValidator }) {
        this.odrlValidator = config.odrlValidator;
    }

    public async validateTestCase(testCase: ODRLTestCase): Promise<TestCaseResult> {
        const validation = await this.odrlValidator.validate(testCase.representation);

        return {
            result: isDeepStrictEqual(validation, testCase.expected),
            expectedResult: testCase.expected,
            calculatedResult: validation
        }


    }

}