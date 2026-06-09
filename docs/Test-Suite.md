The repository additionally contains a test suite that is used to validate the correctness and robustness of the ODRL Validator.
The test suite consists of:

- A set of ODRL policies expressed as RDF files.
- A [configuration file](./config.json) that defines the expected validation outcome for each policy, including:
    - Whether the policy is expected to be valid or invalid.
    - For valid policies, whether they are contain logical inconsistencies; and if so which ones

Together, the policies and the configuration file are combined into test cases, which are executed against the ODRL Validator.
The actual validator output is then compared with the expected results defined in the configuration in order to determine whether the validator behaves correctly.

Data origin
- `data/policies`: [ODRL Test Suite](https://github.com/SolidLabResearch/ODRL-Test-Suite) from the paper [Interoperable Interpretation and Evaluation of ODRL Policies](https://link.springer.com/chapter/10.1007/978-3-031-94578-6_11 )
- `data/samples`: [ODRL Validator](https://odrlapi.appspot.com/) by UPM and Wright State University
- `data/rdflicenses`: [Licensius](https://github.com/oeg-upm/licensius), a collection of RDF licenses as ODRL policies

## Architecture
Test suite
```mermaid
flowchart LR
    subgraph ODRLValidatorTestSuite["ODRL Validator Test Suite"]
        Config["Test Config"]
        Policies["Set of Policies"]

        TestCases["ODRL Test Cases"]

        Comparator["Comparator / Test Runner"]
        Validator["ODRL Validator"]

        Correct["Correct Behavior"]
        Incorrect["Incorrect Behavior"]

        Config --> TestCases
        Policies --> TestCases

        TestCases --> Comparator
        Validator --> Comparator

        Comparator -- "Match expected result" --> Correct
        Comparator -- "Mismatch expected result" --> Incorrect
    end
```

## Running the test suite 

TODO: rewrite this section (idea, document how to run the test suite and high level how it works)
1. document test case format
2. load in all policies

```sh
# Install the packages
npm i

# Running the test suite
npx tsx demo.ts
# or using npm
npm run demo
```