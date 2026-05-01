export const SHAPES: string = `@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .

<http://example.com/ns#odrlPolicy> a sh:NodeShape ;
  sh:targetClass odrl:Policy, odrl:Set, odrl:Agreement, odrl:Offer ;
  sh:property [
    sh:path [
      sh:alternativePath (odrl:permission odrl:prohibition odrl:duty)
    ] ;
    sh:minCount 1 ;
    sh:or ([
      sh:class odrl:Permission
    ] [
      sh:class odrl:Prohibition
    ] [
      sh:class odrl:Duty
    ])
  ], [
    sh:path odrl:profile ;
    sh:nodeKind sh:IRI
  ], [
    sh:path odrl:inheritFrom ;
    sh:nodeKind sh:IRI
  ], [
    sh:path odrl:conflict ;
    sh:nodeKind sh:IRI
  ] .

<http://example.com/ns#odrlRule> a sh:NodeShape ;
  sh:targetClass odrl:Permission, odrl:Prohibition, odrl:Duty ;
  sh:property [
    sh:path odrl:action ;
    sh:minCount 1 ;
    sh:nodeKind sh:IRI ;
    sh:maxCount 1
  ], [
    sh:path odrl:assigner ;
    sh:nodeKind sh:IRI ;
    sh:maxCount 1
  ], [
    sh:path odrl:assignee ;
    sh:nodeKind sh:IRI ;
    sh:maxCount 1
  ], [
    sh:path odrl:constraint ;
    sh:or ([
      sh:class odrl:Constraint
    ] [
      sh:class odrl:LogicalConstraint
    ])
  ] .

<http://example.com/ns#odrlPermission> a sh:NodeShape ;
  sh:targetClass odrl:Permission ;
  sh:property [
    sh:path odrl:target ;
    sh:minCount 1 ;
    sh:nodeKind sh:IRI ;
    sh:maxCount 1
  ], [
    sh:path odrl:duty ;
    sh:class odrl:Duty
  ] .

<http://example.com/ns#odrlProhibition> a sh:NodeShape ;
  sh:targetClass odrl:Prohibition ;
  sh:property [
    sh:path odrl:target ;
    sh:minCount 1 ;
    sh:nodeKind sh:IRI ;
    sh:maxCount 1
  ], [
    sh:path odrl:remedy ;
    sh:class odrl:Duty
  ] .

<http://example.com/ns#odrlDuty> a sh:NodeShape ;
  sh:targetClass odrl:Duty ;
  sh:property [
    sh:path odrl:target ;
    sh:nodeKind sh:IRI ;
    sh:maxCount 1
  ], [
    sh:path odrl:consequence ;
    sh:class odrl:Duty
  ] .

<http://example.com/ns#Constraint> a sh:NodeShape ;
  sh:targetClass odrl:Constraint ;
  sh:property [
    sh:path odrl:leftOperand ;
    sh:minCount 1 ;
    sh:class odrl:LeftOperand ;
    sh:maxCount 1
  ], [
    sh:path odrl:rightOperand ;
    sh:minCount 1 ;
    sh:or ([
      sh:class odrl:rightOperand
    ] [
      sh:nodeKind sh:Literal
    ] [
      sh:nodeKind sh:IRI
    ]) ;
    sh:maxCount 1
  ], [
    sh:path odrl:operator ;
    sh:minCount 1 ;
    sh:class odrl:Operator ;
    sh:maxCount 1
  ] .

<http://example.com/ns#LogicalConstraint> a sh:NodeShape ;
  sh:targetClass odrl:LogicalConstraint ;
  sh:property [
    sh:path [
      sh:alternativePath (odrl:or odrl:xone odrl:and odrl:andSequence)
    ] ;
    sh:or ([
      sh:class odrl:Constraint
    ] [
      sh:class odrl:LogicalConstraint
    ])
  ] .

<urn:x-base:default> a owl:Ontology .

<http://example.com/PolicyShape> a sh:NodeShape ;
  sh:targetClass odrl:Policy ;
  sh:property [
    sh:path [
      sh:alternativePath (odrl:permission odrl:prohibition odrl:obligation)
    ] ;
    sh:minCount 1 ;
    sh:message "Policies must have at least one permission, obligation or prohibition."
  ], [
    sh:path odrl:permission ;
    sh:message "Each permission must conform to an ODRL Permission." ;
    sh:node <http://example.com/PermissionShape>
  ], [
    sh:path odrl:obligation ;
    sh:message "Each obligation must conform to an ODRL Duty." ;
    sh:node <http://example.com/DutyShape>
  ], [
    sh:path odrl:prohibition ;
    sh:message "Each prohibition must conform to an ODRL Prohibition." ;
    sh:node <http://example.com/ProhibitionShape>
  ], [
    sh:path odrl:profile ;
    sh:nodeKind sh:IRI ;
    sh:message "Profile must be an IRI."
  ], [
    sh:path odrl:inheritFrom ;
    sh:nodeKind sh:IRI ;
    sh:message "InheritFrom must be an IRI."
  ], [
    sh:path odrl:conflict ;
    sh:nodeKind sh:IRI ;
    sh:maxCount 1 ;
    sh:message "Conflict strategy must appear at most once and be a ConflictTerm: odrl:perm, odrl:prohibit, or odrl:invalid." ;
    sh:in (odrl:perm odrl:prohibit odrl:invalid)
  ] ;
  sh:nodeKind sh:IRI ;
  sh:message "Policies must be identified by an IRI." .

<http://example.com/PermissionShape> a sh:NodeShape ;
  sh:targetClass odrl:Permission ;
  sh:property [
    sh:path odrl:action ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:message "A Permission must have one action."
  ], [
    sh:path odrl:target ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:message "A Permission must have one target."
  ], [
    sh:path odrl:assignee ;
    sh:maxCount 1 ;
    sh:message "A Permission may have at most one assignee."
  ], [
    sh:path odrl:assigner ;
    sh:maxCount 1 ;
    sh:message "A Permission may have at most one assigner."
  ], [
    sh:path odrl:constraint ;
    sh:or ([
      sh:node <http://example.com/ConstraintShape>
    ] [
      sh:node <http://example.com/LogicalConstraintShape>
    ]) ;
    sh:message "Each constraint must conform to either an ODRL Constraint or an ODRL LogicalConstraint."
  ], [
    sh:path odrl:duty ;
    sh:message "Each duty must conform to an ODRL Duty." ;
    sh:node <http://example.com/DutyShape>
  ] ;
  sh:closed true ;
  sh:ignoredProperties (rdf:type) .

<http://example.com/DutyShape> a sh:NodeShape ;
  sh:targetClass odrl:Duty ;
  sh:property [
    sh:path odrl:action ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:message "A Duty must have one action."
  ], [
    sh:path odrl:target ;
    sh:maxCount 1 ;
    sh:message "A duty may have none or one target."
  ], [
    sh:path odrl:assignee ;
    sh:maxCount 1 ;
    sh:message "A Duty may have at most one assignee."
  ], [
    sh:path odrl:assigner ;
    sh:maxCount 1 ;
    sh:message "A Duty may have at most one assigner."
  ], [
    sh:path odrl:constraint ;
    sh:or ([
      sh:node <http://example.com/ConstraintShape>
    ] [
      sh:node <http://example.com/LogicalConstraintShape>
    ]) ;
    sh:message "Each constraint must conform to either an ODRL Constraint or an ODRL LogicalConstraint."
  ], [
    sh:path odrl:consequence ;
    sh:message "Each consequence must conform to an ODRL duty." ;
    sh:node <http://example.com/DutyShape>
  ] ;
  sh:closed true ;
  sh:ignoredProperties (rdf:type) .

<http://example.com/ProhibitionShape> a sh:NodeShape ;
  sh:targetClass odrl:Prohibition ;
  sh:property [
    sh:path odrl:action ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:message "A Prohibition must have one action."
  ], [
    sh:path odrl:target ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:message "A Prohibition must have one target."
  ], [
    sh:path odrl:assignee ;
    sh:maxCount 1 ;
    sh:message "A Prohibition may have at most one assignee."
  ], [
    sh:path odrl:assigner ;
    sh:maxCount 1 ;
    sh:message "A Prohibition may have at most one assigner."
  ], [
    sh:path odrl:constraint ;
    sh:or ([
      sh:node <http://example.com/ConstraintShape>
    ] [
      sh:node <http://example.com/LogicalConstraintShape>
    ]) ;
    sh:message "Each constraint must conform to either an ODRL Constraint or an ODRL LogicalConstraint."
  ], [
    sh:path odrl:remedy ;
    sh:message "Each remedy must conform to an ODRL duty." ;
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
    sh:path odrl:assigner ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:message "An Offer must have one assigner."
  ] ;
  sh:node <http://example.com/PolicyShape> .

<http://example.com/AgreementPolicyShape> a sh:NodeShape ;
  sh:targetClass odrl:Agreement ;
  sh:property [
    sh:path odrl:assigner ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:message "An Agreement must have one assigner."
  ], [
    sh:path odrl:assignee ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:message "An Agreement must have one assignee."
  ] ;
  sh:node <http://example.com/PolicyShape> .

<http://example.com/ConstraintShape> a sh:NodeShape ;
  sh:targetClass odrl:Constraint ;
  sh:property [
    sh:path odrl:leftOperand ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:message "A Constraint must have one odrl:leftOperand."
  ], [
    sh:path odrl:operator ;
    sh:minCount 1 ;
    sh:maxCount 1 ;
    sh:message "A Constraint must have one operator."
  ] ;
  sh:closed true ;
  sh:ignoredProperties (rdf:type) ;
  sh:xone ([
    sh:property [
      sh:path odrl:rightOperand ;
      sh:minCount 1 ;
      sh:maxCount 1 ;
      sh:message "A Constraint must have exactly one of odrl:rightOperand or odrl:rightOperandReference."
    ]
  ] [
    sh:property [
      sh:path odrl:rightOperandReference ;
      sh:minCount 1 ;
      sh:nodeKind sh:IRI ;
      sh:maxCount 1 ;
      sh:message "A Constraint must have exactly one of odrl:rightOperand or odrl:rightOperandReference."
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
    sh:path [
      sh:alternativePath (odrl:or odrl:xone odrl:and odrl:andSequence)
    ] ;
    sh:minCount 1 ;
    sh:message "A LogicalConstraint must contain one of odrl:and, odrl:or, odrl:xone, or odrl:andSequence."
  ] ;
  sh:closed true ;
  sh:ignoredProperties (rdf:type) .
`