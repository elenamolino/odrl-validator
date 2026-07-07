# ODRL Validation Rules

This document provides a overview of the validation rules implemented in the current [ODRL validator](https://odrlapi.appspot.com/).

**Validation Pipeline**

The [validator](https://github.com/oeg-upm/licensius/blob/master/odrlapi/src/main/java/oeg/odrlapi/validator/ODRLValidator.java) executes the following control checks:

1. [Validation01](https://github.com/oeg-upm/licensius/blob/master/odrlapi/src/main/java/oeg/odrlapi/validator/Validation01.java) – Policy existence  
2. [Validation03](https://github.com/oeg-upm/licensius/blob/master/odrlapi/src/main/java/oeg/odrlapi/validator/Validation03.java) – Type consistency  
3. [Validation04](https://github.com/oeg-upm/licensius/blob/master/odrlapi/src/main/java/oeg/odrlapi/validator/Validation04.java) – Permission cardinality  
4. [Validation05](https://github.com/oeg-upm/licensius/blob/master/odrlapi/src/main/java/oeg/odrlapi/validator/Validation05.java) – Assigner in Offer rules  
5. [Validation06](https://github.com/oeg-upm/licensius/blob/master/odrlapi/src/main/java/oeg/odrlapi/validator/Validation06.java) – Logical constraints  
6. [Validation07](https://github.com/oeg-upm/licensius/blob/master/odrlapi/src/main/java/oeg/odrlapi/validator/Validation07.java) – Controlled vocabulary
7. [Validation08](https://github.com/oeg-upm/licensius/blob/master/odrlapi/src/main/java/oeg/odrlapi/validator/Validation08.java) – Collection refinement 
8. [Validation09](https://github.com/oeg-upm/licensius/blob/master/odrlapi/src/main/java/oeg/odrlapi/validator/Validation09.java) – Remedy constraint  
9. [ValidationSHACL](https://github.com/oeg-upm/licensius/blob/master/odrlapi/src/main/java/oeg/odrlapi/validator/ValidationSHACL.java) – SHACL-based validation  

> Note: Validation02 exists but is not executed.

***

### V01 – Policy existence
- **Description:** At least one policy must exist.  
- **Condition:**  
  - No `odrl:Policy`, `odrl:Agreement`, `odrl:Offer`, or `odrl:Set` found  

────────────────────────

### V03 – Type consistency  
- **Description:** A resource cannot have incompatible types.  
- **Condition:**  
  - Policies:
    - Must not be more than one of `Agreement`, `Offer`, `Set`
  - Rules:
    - Must not be more than one of `Permission`, `Prohibition`, `Duty`

────────────────────────

### V04 – Permission cardinality
- **Description:** A permission should not have multiple assigners or assignees.  
- **Condition:**  
  - At most 1 `odrl:assigner`
  - At most 1 `odrl:assignee`

────────────────────────

### V05 – Assigner in Offer rules
- **Description:** Every rule inside an Offer must have exactly one assigner.  
- **Condition:**  
  - For each rule (`permission`, `obligation`, `prohibition`) under a `odrl:Offer`:  
    - The number of `odrl:assigner` must be exactly 1 

────────────────────────

### V06 – Logical constraints
- **Description:** Operands in logical constraints must be valid constraints.  
- **Condition:** 
  - Must not be literals  
  - Must be instances of `odrl:Constraint`

────────────────────────

### V07 – Controlled vocabulary
- **Description:** Non-ODRL terms are allowed only when a profile is defined. Otherwise, values must belong to the [standard ODRL vocabulary](https://github.com/oeg-upm/licensius/blob/master/odrlapi/src/main/java/oeg/odrlapi/validator/ODRL.java).  
- **Condition:** 
  - If no `odrl:profile` is declared, the following properties must use terms from the ODRL vocabulary:
    - `odrl:action`
    - `odrl:leftOperand`
    - `odrl:operator`

────────────────────────

### V08 – Collection refinement
- **Description:** Collections (`odrl:AssetCollection` or `odrl:PartyCollection` ) with refinement must define their source.  
- **Condition:** 
  - Must include `odrl:source` if `odrl:refinement` is present

────────────────────────

### V09 – Remedy constraint
- **Description:** A remedy cannot reference a duty with consequences.  
- **Condition:** 
  - `remedy` must not point to a `Duty` that has `odrl:consequence`

***

### SHACL Constraints

- Every `odrl:Policy` must have an identifier (URI) and at least one rule
- Every `odrl:Offer` must have an assigner, either directly or within its rules  
- Every `odrl:Agreement` must have both an assigner and an assignee  
- Every `odrl:Rule` must have at least one action  
- Every `odrl:Permission` must have at most one assigner and at most one assignee  
- Every `odrl:Permission` must have at least one target  
- Every `odrl:Constraint` must be well-formed:
  - exactly one `odrl:leftOperand`
  - exactly one `odrl:operator`
  - and exactly one of:
    - `odrl:rightOperand`
    - `odrl:rightOperandReference`

- Actions and targets should ideally be URIs  
