export const SHAPES: string = `@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

<http://example.com/PolicyShape> a sh:NodeShape ;
  sh:targetClass odrl:Policy ;
  sh:nodeKind sh:IRI ;
  sh:message "Policies must be identified by an IRI." ;
  sh:property [
    sh:message "Policies must have at least one permission, obligation or prohibition." ;
    sh:path [
      sh:alternativePath (odrl:permission odrl:prohibition odrl:obligation)
    ] ;
    sh:minCount 1
  ], [
    sh:message "Each permission must conform to an ODRL Permission." ;
    sh:path odrl:permission ;
    sh:node <http://example.com/PermissionShape>
  ], [
    sh:message "Each obligation must conform to an ODRL Duty." ;
    sh:path odrl:obligation ;
    sh:node <http://example.com/DutyShape>
  ], [
    sh:message "Each prohibition must conform to an ODRL Prohibition." ;
    sh:path odrl:prohibition ;
    sh:node <http://example.com/ProhibitionShape>
  ], [
    sh:nodeKind sh:IRI ;
    sh:message "Profile must be an IRI." ;
    sh:path odrl:profile
  ], [
    sh:nodeKind sh:IRI ;
    sh:message "InheritFrom must be an IRI." ;
    sh:path odrl:inheritFrom
  ], [
    sh:nodeKind sh:IRI ;
    sh:message "Conflict strategy must appear at most once and be a ConflictTerm: odrl:perm, odrl:prohibit, or odrl:invalid." ;
    sh:path odrl:conflict ;
    sh:in (odrl:perm odrl:prohibit odrl:invalid) ;
    sh:maxCount 1
  ] .

<http://example.com/PermissionShape> a sh:NodeShape ;
  sh:targetClass odrl:Permission ;
  sh:property [
    sh:message "A Permission must have one action." ;
    sh:path odrl:action ;
    sh:minCount 1 ;
    sh:maxCount 1
  ], [
    sh:message "A Permission must have one target." ;
    sh:path odrl:target ;
    sh:minCount 1 ;
    sh:maxCount 1
  ], [
    sh:message "A Permission may have at most one assignee." ;
    sh:path odrl:assignee ;
    sh:maxCount 1
  ], [
    sh:message "A Permission may have at most one assigner." ;
    sh:path odrl:assigner ;
    sh:maxCount 1
  ], [
    sh:message "Each constraint must conform to either an ODRL Constraint or an ODRL LogicalConstraint." ;
    sh:path odrl:constraint ;
    sh:or ([
      sh:node <http://example.com/ConstraintShape>
    ] [
      sh:node <http://example.com/LogicalConstraintShape>
    ])
  ], [
    sh:message "Each duty must conform to an ODRL Duty." ;
    sh:path odrl:duty ;
    sh:node <http://example.com/DutyShape>
  ] ;
  sh:closed true ;
  sh:ignoredProperties (rdf:type) .

<http://example.com/DutyShape> a sh:NodeShape ;
  sh:targetClass odrl:Duty ;
  sh:property [
    sh:message "A Duty must have one action." ;
    sh:path odrl:action ;
    sh:minCount 1 ;
    sh:maxCount 1
  ], [
    sh:message "A duty may have none or one target." ;
    sh:path odrl:target ;
    sh:maxCount 1
  ], [
    sh:message "A Duty may have at most one assignee." ;
    sh:path odrl:assignee ;
    sh:maxCount 1
  ], [
    sh:message "A Duty may have at most one assigner." ;
    sh:path odrl:assigner ;
    sh:maxCount 1
  ], [
    sh:message "Each constraint must conform to either an ODRL Constraint or an ODRL LogicalConstraint." ;
    sh:path odrl:constraint ;
    sh:or ([
      sh:node <http://example.com/ConstraintShape>
    ] [
      sh:node <http://example.com/LogicalConstraintShape>
    ])
  ], [
    sh:message "Each consequence must conform to an ODRL duty." ;
    sh:path odrl:consequence ;
    sh:node <http://example.com/DutyShape>
  ] ;
  sh:closed true ;
  sh:ignoredProperties (rdf:type) .

<http://example.com/ProhibitionShape> a sh:NodeShape ;
  sh:targetClass odrl:Prohibition ;
  sh:property [
    sh:message "A Prohibition must have one action." ;
    sh:path odrl:action ;
    sh:minCount 1 ;
    sh:maxCount 1
  ], [
    sh:message "A Prohibition must have one target." ;
    sh:path odrl:target ;
    sh:minCount 1 ;
    sh:maxCount 1
  ], [
    sh:message "A Prohibition may have at most one assignee." ;
    sh:path odrl:assignee ;
    sh:maxCount 1
  ], [
    sh:message "A Prohibition may have at most one assigner." ;
    sh:path odrl:assigner ;
    sh:maxCount 1
  ], [
    sh:message "Each constraint must conform to either an ODRL Constraint or an ODRL LogicalConstraint." ;
    sh:path odrl:constraint ;
    sh:or ([
      sh:node <http://example.com/ConstraintShape>
    ] [
      sh:node <http://example.com/LogicalConstraintShape>
    ])
  ], [
    sh:message "Each remedy must conform to an ODRL duty." ;
    sh:path odrl:remedy ;
    sh:node <http://example.com/DutyShape>
  ] ;
  sh:closed true ;
  sh:ignoredProperties (rdf:type) .

<http://example.com/SetPolicyShape> a sh:NodeShape ;
  sh:targetClass odrl:Set ;
  sh:node <http://example.com/PolicyShape> .

<http://example.com/OfferPolicyShape> a sh:NodeShape ;
  sh:targetClass odrl:Offer ;
  sh:property [
    sh:message "An Offer must have one assigner." ;
    sh:path odrl:assigner ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] ;
  sh:node <http://example.com/PolicyShape> .

<http://example.com/AgreementPolicyShape> a sh:NodeShape ;
  sh:targetClass odrl:Agreement ;
  sh:property [
    sh:message "An Agreement must have one assigner." ;
    sh:path odrl:assigner ;
    sh:minCount 1 ;
    sh:maxCount 1
  ], [
    sh:message "An Agreement must have one assignee." ;
    sh:path odrl:assignee ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] ;
  sh:node <http://example.com/PolicyShape> .

<http://example.com/ConstraintShape> a sh:NodeShape ;
  sh:targetClass odrl:Constraint ;
  sh:property [
    sh:message "A Constraint must have one odrl:leftOperand." ;
    sh:path odrl:leftOperand ;
    sh:minCount 1 ;
    sh:maxCount 1
  ], [
    sh:message "A Constraint must have one operator." ;
    sh:path odrl:operator ;
    sh:minCount 1 ;
    sh:maxCount 1
  ] ;
  sh:closed true ;
  sh:ignoredProperties (rdf:type) ;
  sh:xone ([
    sh:property [
      sh:message "A Constraint must have exactly one of odrl:rightOperand or odrl:rightOperandReference." ;
      sh:path odrl:rightOperand ;
      sh:minCount 1 ;
      sh:maxCount 1
    ]
  ] [
    sh:property [
      sh:nodeKind sh:IRI ;
      sh:message "A Constraint must have exactly one of odrl:rightOperand or odrl:rightOperandReference." ;
      sh:path odrl:rightOperandReference ;
      sh:minCount 1 ;
      sh:maxCount 1
    ]
  ]) .

<http://example.com/LogicalConstraintShape> a sh:NodeShape ;
  sh:targetClass odrl:LogicalConstraint ;
  sh:property [
    sh:path odrl:and ;
    sh:node <http://example.com/ConstraintShape>
  ], [
    sh:path odrl:or ;
    sh:node <http://example.com/ConstraintShape>
  ], [
    sh:path odrl:xone ;
    sh:node <http://example.com/ConstraintShape>
  ], [
    sh:path odrl:andSequence ;
    sh:node <http://example.com/ConstraintShape>
  ], [
    sh:message "A LogicalConstraint must contain one of odrl:and, odrl:or, odrl:xone, or odrl:andSequence." ;
    sh:path [
      sh:alternativePath (odrl:or odrl:xone odrl:and odrl:andSequence)
    ] ;
    sh:minCount 1
  ] ;
  sh:closed true ;
  sh:ignoredProperties (rdf:type) .
`