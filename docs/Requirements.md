This document defines the requirements that must be implemented in the ODRL validator.

## Policy Structure and Typing Requirements
The extraction of these requirements is based on the [ODRL 2.2 information model](https://www.w3.org/TR/odrl-model/) and the [wiki page listing the validation operations](https://www.w3.org/2016/poe/wiki/Validation)

### Pre-validation
- R01: A valid document must contain at least one Policy - Violation - [Wiki V1](https://www.w3.org/2016/poe/wiki/Validation#V1._A_valid_document_must_contain_at_least_one_Policy)

### Policy
- R02: A policy must include at least one rule (permission, prohibition or obligation) - Violation - [Wiki V2](https://www.w3.org/2016/poe/wiki/Validation#V2._Every_policy_must_have_at_least_one_rule)
- R03: A policy must be identified by an IRI - Violation - [Wiki V3](https://www.w3.org/2016/poe/wiki/Validation#V3._Every_policy_must_be_identified_by_a_URI)
- R04: A policy uid must be an IRI and appear at most once - Violation - **New**
- R05: A policy profile must be an IRI - Violation - **New**
- R06: A policy inheritFrom must reference an existing odrl:Policy - Violation - **New**
- R07: A policy conflict strategy must appear at most once and be an IRI - Violation - [Wiki V23](https://www.w3.org/2016/poe/wiki/Validation#V23._Every_policy_most_have_at_most_one_conflict_strategy)
- R08: A policy conflict strategy must be a known ODRL value or a profile must be declared - Violation - [Wiki V11](https://www.w3.org/2016/poe/wiki/Validation#V11._In_absence_of_profile.2C_only_ODRL_Core_conflict_strategies_can_be_used)
- R09: Every rule in an Offer must have exactly one assigner - Violation - [Wiki V4](https://www.w3.org/2016/poe/wiki/Validation#V4._Every_rule_in_an_offer_must_have_exactly_one_assigner)
- R10: Every rule in an Agreement must have exactly one assigner and one assignee - Violation - [Wiki V5](https://www.w3.org/2016/poe/wiki/Validation#V5._Every_rule_in_an_agreement_must_have_exactly_one_assigner) + [Wiki V6](https://www.w3.org/2016/poe/wiki/Validation#V6._Every_rule_in_an_agreement_must_have_exactly_one_assignee)

### Rule
- R11: Every rule must have exactly one action - Violation - **New**
- R12: An action must be a known value, or a blank node with rdf:value and refinement - Violation - **New**
- R13: An action should belong to the ODRL vocabulary or be typed as odrl:Action - Warning - **New**
- R14: A rule may have at most one target - Violation - **New**
- R15: A target must be an Asset or an AssetCollection - Violation - **New**
- R16: A target should be typed as odrl:Asset or odrl:AssetCollection - Warning - **New**
- R17: A rule may have at most one assignee - Violation - **New**
- R18: An assignee must conform to the Party or PartyCollection shape - Violation - **New**
- R19: An assignee should be typed as odrl:Party or odrl:PartyCollection - Warning - **New**
- R20: A rule may have at most one assigner - Violation - **New**
- R21: An assigner must conform to the Party or PartyCollection shape - Violation - **New**
- R22: An assigner should be typed as odrl:Party or odrl:PartyCollection - Warning - **New**
- R23: Each constraint in a rule must be a valid Constraint or LogicalConstraint - Violation - **New**
- R24: Constraint terms should belong to the ODRL vocabulary or be correctly typed - Warning - **New**
- R25: A permission must have exactly one target - Violation - [Wiki V7](https://www.w3.org/2016/poe/wiki/Validation#V7._Every_rule_must_have_exactly_one_target)
- R26: Each duty of a permission must conform to the Duty shape - Violation - **New**
- R27: A prohibition must have exactly one target - Violation - [Wiki V7](https://www.w3.org/2016/poe/wiki/Validation#V7._Every_rule_must_have_exactly_one_target)
- R28: Each remedy of a prohibition must conform to the Duty shape - Violation - **New**
- R29: A remedy must not have a consequence - Violation - [Wiki V8](https://www.w3.org/2016/poe/wiki/Validation#V8._No_remedy_can_refer_to_a_duty_that_includes_a_consequence_duty)
- R30: Each consequence of a duty must conform to the Duty shape - Violation - **New**
- R31: A collection with odrl:refinement must have an odrl:source or rdf:value - Violation - [Wiki V9](https://www.w3.org/2016/poe/wiki/Validation#V9._Every_AssetCollection_with_a_refinement_must_have_a_source) + [Wiki V10](https://www.w3.org/2016/poe/wiki/Validation#V10._Every_PartyCollection_with_a_refinement_must_have_a_odrl:source)
- R32: An action outside the ODRL vocabulary requires a declared odrl:profile - Violation - [Wiki V12](https://www.w3.org/2016/poe/wiki/Validation#V12._In_absence_of_profile.2C_only_ODRL_actions_can_be_used)
- R33: A constraint term outside the ODRL vocabulary requires a declared odrl:profile - Violation - [Wiki V13](https://www.w3.org/2016/poe/wiki/Validation#V13._In_absence_of_profile.2C_only_ODRL_left_operands_can_be_used) + [Wiki V14](https://www.w3.org/2016/poe/wiki/Validation#V14._In_absence_of_profile.2C_only_ODRL_operators_can_be_used)
- R34: An action refinement must have exactly one rdf:value - Violation - **New**
- R35: odrl:includedIn must be odrl:use or odrl:transfer and appear at most once - Violation - **New**

### Constraint
- R36: A constraint must have exactly one leftOperand - Violation - [Wiki V17](https://www.w3.org/2016/poe/wiki/Validation#V17._Every_constraint_must_have_exactly_one_left_operand)
- R37: A constraint must have exactly one operator - Violation - [Wiki V18](https://www.w3.org/2016/poe/wiki/Validation#V18._Every_constraint_must_have_exactly_one_operator)
- R38: A constraint must have either rightOperand or rightOperandReference, but not both and not neither - Violation - [Wiki V16](https://www.w3.org/2016/poe/wiki/Validation#V16._Every_constraint_must_have_exactly_one_right_operand)
- R39: The rightOperand must be a literal, IRI, odrl:RightOperand instance, or a list of these - Violation - **New**
- R40: The rightOperandReference must be an IRI or a list of IRIs - Violation - [Wiki V20](https://www.w3.org/2016/poe/wiki/Validation#V20._The_values_of_the_property_rightOperandReference_must_be_URIs)
- R41: The leftOperand should belong to the ODRL vocabulary or be typed as odrl:LeftOperand - Warning - **New**
- R42: The operator should be a standard ODRL operator - Warning - **New**
- R43: A LogicalConstraint must contain exactly one of: odrl:and, odrl:or, odrl:xone, odrl:andSequence - Violation - [Wiki V15](https://www.w3.org/2016/poe/wiki/Validation#V15._In_absence_of_profile.2C_only_ODRL_logical_constraints_can_be_used)
- R44: Each element of a LogicalConstraint must be a valid Constraint - Violation - [Wiki V19](https://www.w3.org/2016/poe/wiki/Validation#V19._The_values_of_every_logical_constraint_must_be_constraints)

### Constraint operator compatibility (**IN PROGRESS**)
- R45: odrl:absolutePosition is only compatible with eq, gt, gteq, lt, lteq, neq - Warning - **New**
- R46: odrl:absoluteSpatialPosition is only compatible with comparison operators - Warning - **New**
- R47: odrl:absoluteTemporalPosition is only compatible with comparison operators - Warning - **New**
- R48: odrl:absoluteSize is only compatible with comparison operators - Warning - **New**
- R49: odrl:count is only compatible with comparison operators - Warning - **New**
- R50: The rightOperand for odrl:count must be an xsd:integer - Warning - **New**
- R51: odrl:dateTime is only compatible with comparison operators - Warning - **New**
- R52: The rightOperand for odrl:dateTime must be xsd:date or xsd:dateTime - Warning - **New**

**more requirements need to be included ([compatibility](https://docs.google.com/spreadsheets/d/1DTzZ7HJ0AdfZAZlDA73XC3kHF6jSCQxUuJO_-gCRC_Q/edit?usp=drive_link))**

### Party
- R53: A party may have at most one uid, and it must be an IRI - Violation - **New**
- R54: A party partOf must point to a PartyCollection - Violation - **New**
- R55: A PartyCollection may have at most one source, and it must be an IRI - Violation - [Wiki V10](https://www.w3.org/2016/poe/wiki/Validation#V10._Every_PartyCollection_with_a_refinement_must_have_a_odrl:source)
- R56: Each refinement of a PartyCollection must be a Constraint or LogicalConstraint - Violation - **New**

### Asset
- R57: An asset may have at most one uid, and it must be an IRI - Violation - **New**
- R58: An asset partOf must point to an AssetCollection - Violation - **New**
- R59: An AssetCollection may have at most one source, and it must be an IRI - Violation - [Wiki V9](https://www.w3.org/2016/poe/wiki/Validation#V9._Every_AssetCollection_with_a_refinement_must_have_a_source)
- R60: Each refinement of an AssetCollection must be a Constraint or LogicalConstraint - Violation - **New**

### Deontic conflicts 
- R61: A duty and a prohibition with the same assignee, target and action constitute a conflict - Conflict - **New**
- R62: A permission and a prohibition with the same assignee, target and action constitute a conflict - Conflict - **New**
- R63: Two constraints in the same rule with the same left operand and the \texttt{eq} operator must not have different right operands, as the rule could never be satisfied - Conflict - **New**


## Cardinality ODRL model for atomic policies


| Class | Property | Cardinality | Type | Level |
|---|---|---|---|---|
| **Policy** | `uid` | 1 | IRI | MUST |
| Policy | `permission` / `prohibition` / `obligation` | ≥1 (across the three) | Rule | MUST |
| Policy | `profile` | 0..n | IRI | MAY (MUST if non-Core terms are used) |
| Policy | `inheritFrom` | 0..n | IRI | MAY |
| Policy | `conflict` | 0..1 | ConflictTerm | MAY (default `invalid`) |
| **Offer** | `assigner` | 1 | Party | MUST |
| **Agreement** | `assigner` | 1 | Party | MUST |
| Agreement | `assignee` | 1 | Party | MUST |
| **Asset** | `uid` | 0..1 | IRI | SHOULD |
| Asset | `partOf` | 0..n | AssetCollection | MAY |
| **AssetCollection** | `source` | 0..1 | IRI | MAY |
| AssetCollection | `refinement` | 0..n | Constraint | MAY |
| **Party** | `uid` | 0..1 | IRI | SHOULD |
| Party | `partOf` | 0..n | PartyCollection | MAY |
| **PartyCollection** | `source` | 0..1 | IRI | MAY |
| PartyCollection | `refinement` | 0..n | Constraint | MAY |
| **Action** | `refinement` | 0..n | Constraint | MAY |
| Action | `includedIn` | 1 (except `use` / `transfer`) | Action | MUST |
| Action | `implies` | 0..n | Action | MAY |
| **Constraint** | `uid` | 0..1 | IRI | MAY |
| Constraint | `leftOperand` | 1 | LeftOperand | MUST |
| Constraint | `operator` | 1 | Operator | MUST |
| Constraint | `rightOperand` XOR `rightOperandReference` | 1 (one or the other, never both) | literal / IRI / RightOperand (or list, for set operators) | MUST |
| Constraint | `dataType` | 0..1 | datatype | MAY |
| Constraint | `unit` | 0..1 | IRI | MAY |
| Constraint | `status` | 0..1 | value | MAY |
| **LogicalConstraint** | `uid` | 0..1 | IRI | MAY |
| LogicalConstraint | `operand` | 1 (list) | list of Constraint | MUST |
| **Rule** | `action` | 1 | Action | MUST |
| Rule | `relation` (sub-property) | 0..1 | Asset | MAY |
| Rule | `function` (sub-property) | 0..n | Party | MAY |
| Rule | `failure` (sub-property) | 0..n | Rule | MAY |
| Rule | `constraint` | 0..n | Constraint / LogicalConstraint | MAY |
| Rule | `uid` | 0..1 | IRI | MAY |
| **Permission** | `target` | 1 | Asset | MUST |
| Permission | `assigner` | 0..1 | Party | MAY |
| Permission | `assignee` | 0..1 | Party | MAY |
| Permission | `duty` | 0..n | Duty | MAY |
| **Prohibition** | `target` | 1 | Asset | MUST |
| Prohibition | `assigner` | 0..1 | Party | MAY |
| Prohibition | `assignee` | 0..1 | Party | MAY |
| Prohibition | `remedy` | 0..n | Duty | MAY |
| **Duty** | `target` | 0..1 | Asset | MAY |
| Duty | `assigner` | 0..1 | Party | MAY |
| Duty | `assignee` | 0..1 | Party | MAY |
| Duty | `consequence` | 0..n | Duty | MAY (only if referenced by `duty` / `obligation`) |
