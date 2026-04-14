import {loadODRLTestCases} from "./src"


async function main() {
  const cases = await loadODRLTestCases('./config.json');
  console.log(`Loaded ${cases.length} test cases`);
}

main();
