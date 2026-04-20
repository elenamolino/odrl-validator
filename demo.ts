import { Parser } from "n3";
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

