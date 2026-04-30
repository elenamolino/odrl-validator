# TODOs for this repository

## High-level
See the [wiki](https://github.com/elenamolino/odrl-validator/wiki)
- [ ] add jest for automated testing
- [ ] publish on npm

### Validator
- [ ] TODO: proper ingestion of the rules and shapes (to be browser compatible)
  - [x] change constructor (also have defaults)
  - [ ] shape and rules as string (like ODRL Evaluator)
  - [x] split core and browser index.ts
- [ ] Fix issue regarding ODRL actions on the shape
  - A solution could be injection the ODRL voc together with the policies for the SHACL Validation. An issue however is that if somebody adds `a odrl:Action` into the policy, we no longer would validate actions. To be discussed
- [ ] parse SHACL violations properly
- [ ] handle the absence of policies in the validation. Is that technically a valid policy
- [ ] parse conflict errors properly

### Pipeline
- [ ] fix Ids in the config -> make proper URIs that are dereferencable (w3id, github, ...)
- [ ] Test for each policies in [rdflicenses](./data/rdflicenses/) whether they are valid policies

## Optional
- [ ] An HTTP API to call the validator (github actions)
- [ ] A frontend to load in all the samples and validate them
- [ ] Make all policy IDs URL to all policies (that way we can dereference them) 