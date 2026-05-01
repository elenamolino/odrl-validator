import { Parser } from "n3";
import { loadODRLTestCases, ODRLValidator, TestCaseValidator } from "./src"
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "node:process";


async function main() {
  // DEMO: loading in the test cases
  const cases = await loadODRLTestCases('./config.json');
  console.log(`Loaded ${cases.length} test cases`);


  const rawShape = readFileSync(join(__dirname, "src", "shapes", "policy-core.ttl"), "utf-8");
  const shape = new Parser().parse(rawShape)
  const notation3Rules = readFileSync(join(__dirname, "src", "rules", "rule1.n3"), "utf-8")

  // DEMO: testing out the validator
  const validator = new ODRLValidator(
    {
      shape: shape,
      n3Rules: notation3Rules
    }
  );
  for (const [i, testCase] of cases.slice(1, 80).entries()) {
    console.log(`Test ${i} (ID: ${testCase.id}):`);

    const result = await validator.validate(testCase.representation);

    console.log('Valid:', result.valid);
    // const testcaseValidator = new TestCaseValidator({odrlValidator: validator})
    // const testCaseResult = await testcaseValidator.validateTestCase(cases[2]);
    // console.log('Expected:', testCaseResult.expectedResult.valid);

    if (result.validationResults.length > 0) {
      console.log('Errors:', result.validationResults);
    }
  }


  // DEMO: testing out the reasoning
  const conflictPolicy = `
  @prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix ex:   <http://example.org/> .

ex:policy
    a odrl:Policy ;
    odrl:prohibition ex:prohibitionRule ;
    odrl:duty        ex:dutyRule .

ex:prohibitionRule
    a odrl:Prohibition ;
    odrl:target   ex:resource ;
    odrl:assignee ex:alice ;
    odrl:action   odrl:use .

ex:dutyRule
    a odrl:Duty ;
    odrl:target   ex:resource ;
    odrl:assignee ex:alice ;
    odrl:action   odrl:use .`
  console.log(await validator.validate(new Parser().parse(conflictPolicy)))

}

main();