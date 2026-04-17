import {loadODRLTestCases, ODRLValidator, TestCaseValidator} from "./src"


async function main() {
  // DEMO: loading in the test cases
  const cases = await loadODRLTestCases('./config.json');
  console.log(`Loaded ${cases.length} test cases`);

  // DEMO: testing out the validator
  const validator = new ODRLValidator();
  const result = await validator.validate(cases[0].representation) // should have been false, but its empty so technically valid
  console.log(result);
 
  console.log(await validator.validate(cases[2].representation)) // false case, there are no rules

  // DEMO: testing out the test case comparison thingy

  const testcaseValidator = new TestCaseValidator({odrlValidator: validator})
  const testCaseResult = await testcaseValidator.validateTestCase(cases[2]);
  console.log(testCaseResult);
  
}

main();

