# TODOs for this repository

## High-level
See the [wiki](https://github.com/elenamolino/odrl-validator/wiki)
- [ ] add jest for automated testing
- [ ] publish on npm

### Validator

### Pipeline
- [ ] fix Ids in the config -> make proper URIs that are dereferencable (w3id, github, ...)
- [ ] Test for each policies in [rdflicenses](./data/rdflicenses/) whether they are valid policies

## Optional
- [ ] An HTTP API to call the validator (github actions)
- [ ] A frontend to load in all the samples and validate them
- [ ] Make all policy IDs URL to all policies (that way we can dereference them) 