import { Parser } from "n3";
import { loadODRLTestCases, ODRLValidator, TestCaseValidator } from "./src"


async function main() {
  // DEMO: loading in the test cases
  const cases = await loadODRLTestCases('./config.json');
  console.log(`Loaded ${cases.length} test cases`);

  // DEMO: testing out the validator
  const validator = new ODRLValidator();
  for (const [i, testCase] of cases.slice(0, 82).entries()) {
    console.log(`Test ${i} (ID: ${testCase.id}):`);

    const result = await validator.validate(testCase.representation);

    console.log('Expected:', testCase.expected.valid);
    if (!testCase.expected.valid) {
      console.log('Reason:', testCase.expected.validationResults);
    }
    console.log('Valid:', result.valid);

    if (result.validationResults.length > 0) {
      console.log('Errors:', result.validationResults);
    }
    console.log('···············································');
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
        odrl:action   odrl:use .
        
    ex:alice a odrl:Party .
    ex:resource a odrl:Asset .
  `
  
  console.log(await validator.validate(new Parser().parse(conflictPolicy)))

}

main();