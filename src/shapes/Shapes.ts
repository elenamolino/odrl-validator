export const SHAPES: string = `@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

<http://example.com/PolicyShape> a sh:NodeShape ;
  sh:targetClass odrl:Policy ;
  sh:nodeKind sh:IRI ;
  sh:message "Policies must be identified by an IRI." ;
  sh:property [
    sh:nodeKind sh:IRI ;
    sh:message "A Policy may have one uid, and it must be an IRI." ;
    sh:path odrl:uid ;
    sh:maxCount 1
  ], [
    sh:message "Policies must have at least one permission, obligation or prohibition." ;
    sh:path [
      sh:alternativePath (odrl:permission odrl:prohibition odrl:obligation)
    ] ;
    sh:minCount 1
  ], [
    sh:path odrl:permission ;
    sh:node <http://example.com/PermissionShape>
  ], [
    sh:path odrl:obligation ;
    sh:node <http://example.com/DutyShape>
  ], [
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
    sh:maxCount 1 ;
    sh:in (odrl:perm odrl:prohibit odrl:invalid)
  ] .

<http://example.com/PermissionShape> a sh:NodeShape ;
  sh:targetClass odrl:Permission ;
  sh:property [
    sh:message "A Permission must have one odrl:target." ;
    sh:path odrl:target ;
    sh:maxCount 1 ;
    sh:minCount 1
  ], [
    sh:message "Each Permission duty must conform to ODRL duty." ;
    sh:path odrl:duty ;
    sh:node <http://example.com/DutyShape>
  ] ;
  sh:node <http://example.com/RuleShape> .

<http://example.com/DutyShape> a sh:NodeShape ;
  sh:targetClass odrl:Duty ;
  sh:property [
    sh:message "Each Duty consequence must conform to ODRL duty." ;
    sh:path odrl:consequence ;
    sh:node <http://example.com/DutyShape>
  ] ;
  sh:node <http://example.com/RuleShape> .

<http://example.com/ProhibitionShape> a sh:NodeShape ;
  sh:targetClass odrl:Prohibition ;
  sh:property [
    sh:message "A Prohibition must have one odrl:target." ;
    sh:path odrl:target ;
    sh:maxCount 1 ;
    sh:minCount 1
  ], [
    sh:message "Each Prohibition remedy must conform to ODRL duty." ;
    sh:path odrl:remedy ;
    sh:node <http://example.com/DutyShape>
  ] ;
  sh:node <http://example.com/RuleShape> .

<http://example.com/SetPolicyShape> a sh:NodeShape ;
  sh:targetClass odrl:Set ;
  sh:node <http://example.com/PolicyShape> .

<http://example.com/OfferPolicyShape> a sh:NodeShape ;
  sh:targetClass odrl:Offer ;
  sh:property [
    sh:path odrl:permission ;
    sh:node <http://example.com/OfferPermissionShape>
  ], [
    sh:path odrl:prohibition ;
    sh:node <http://example.com/OfferProhibitionShape>
  ], [
    sh:path odrl:obligation ;
    sh:node <http://example.com/OfferDutyShape>
  ] ;
  sh:node <http://example.com/PolicyShape> .

<http://example.com/OfferPermissionShape> a sh:NodeShape ;
  sh:node <http://example.com/PermissionShape>, <http://example.com/OfferRequiredAssignerShape> .

<http://example.com/OfferProhibitionShape> a sh:NodeShape ;
  sh:node <http://example.com/ProhibitionShape>, <http://example.com/OfferRequiredAssignerShape> .

<http://example.com/OfferDutyShape> a sh:NodeShape ;
  sh:node <http://example.com/DutyShape>, <http://example.com/OfferRequiredAssignerShape> .

<http://example.com/AgreementPolicyShape> a sh:NodeShape ;
  sh:targetClass odrl:Agreement ;
  sh:property [
    sh:path odrl:permission ;
    sh:node <http://example.com/AgreementPermissionShape>
  ], [
    sh:path odrl:prohibition ;
    sh:node <http://example.com/AgreementProhibitionShape>
  ], [
    sh:path odrl:obligation ;
    sh:node <http://example.com/AgreementDutyShape>
  ] ;
  sh:node <http://example.com/PolicyShape> .

<http://example.com/AgreementPermissionShape> a sh:NodeShape ;
  sh:node <http://example.com/PermissionShape>, <http://example.com/AgreementRequiredAssignerShape>, <http://example.com/AgreementRequiredAssigneeShape> .

<http://example.com/AgreementProhibitionShape> a sh:NodeShape ;
  sh:node <http://example.com/ProhibitionShape>, <http://example.com/AgreementRequiredAssignerShape>, <http://example.com/AgreementRequiredAssigneeShape> .

<http://example.com/AgreementDutyShape> a sh:NodeShape ;
  sh:node <http://example.com/DutyShape>, <http://example.com/AgreementRequiredAssignerShape>, <http://example.com/AgreementRequiredAssigneeShape> .

<http://example.com/RuleShape> a sh:NodeShape ;
  sh:targetClass odrl:Permission, odrl:Prohibition, odrl:Duty ;
  sh:property [
    sh:nodeKind sh:IRI ;
    sh:message "A Rule may have one uid, and it must be an IRI." ;
    sh:path odrl:uid ;
    sh:maxCount 1
  ], [
    sh:message "A Rule must have one action." ;
    sh:path odrl:action ;
    sh:maxCount 1 ;
    sh:minCount 1
  ], [
    sh:message "Action should be a supported action or a blank node with rdf:value and odrl:refinement." ;
    sh:path odrl:action ;
    sh:severity sh:Warning ;
    sh:or ([
      sh:node <http://example.com/ActionShape>
    ] [
      sh:node <http://example.com/ActionWithRefinementShape>
    ])
  ], [
    sh:message "A Rule may have one target." ;
    sh:path odrl:target ;
    sh:maxCount 1
  ], [
    sh:message "Target should be a Asset or AssetCollection." ;
    sh:path odrl:target ;
    sh:node <http://example.com/AssetShape> ;
    sh:severity sh:Warning
  ], [
    sh:message "A Rule may have at most one assignee." ;
    sh:path odrl:assignee ;
    sh:maxCount 1
  ], [
    sh:message "The assignee should be a Party or PartyCollection." ;
    sh:path odrl:assignee ;
    sh:severity sh:Warning ;
    sh:or ([
      sh:node <http://example.com/PartyShape>
    ] [
      sh:node <http://example.com/PartyCollectionShape>
    ])
  ], [
    sh:message "A Rule may have at most one assigner." ;
    sh:path odrl:assigner ;
    sh:maxCount 1
  ], [
    sh:message "The assigner should be a Party or PartyCollection." ;
    sh:path odrl:assigner ;
    sh:severity sh:Warning ;
    sh:or ([
      sh:node <http://example.com/PartyShape>
    ] [
      sh:node <http://example.com/PartyCollectionShape>
    ])
  ], [
    sh:message "Each constraint must conform to ODRL constraint or ODRL logical constraint." ;
    sh:path odrl:constraint ;
    sh:or ([
      sh:node <http://example.com/ConstraintShape>
    ] [
      sh:node <http://example.com/LogicalConstraintShape>
    ])
  ] .

<http://example.com/ActionShape> a sh:NodeShape ;
  sh:property [
    sh:message "The value of odrl:includedIn should be either odrl:use or odrl:transfer." ;
    sh:path odrl:includedIn ;
    sh:maxCount 1 ;
    sh:in (odrl:use odrl:transfer)
  ], [
    sh:message "Each implies value should be an Action." ;
    sh:path odrl:implies ;
    sh:node <http://example.com/AllowedActionValueShape>
  ] ;
  sh:node <http://example.com/AllowedActionValueShape> .

<http://example.com/ActionWithRefinementShape> a sh:NodeShape ;
  sh:property [
    sh:message "An action refinement must have one rdf:value." ;
    sh:path rdf:value ;
    sh:maxCount 1 ;
    sh:minCount 1
  ], [
    sh:message "The action value should be part of the ODRL vocabulary or typed as odrl:Action." ;
    sh:path rdf:value ;
    sh:node <http://example.com/AllowedActionValueShape> ;
    sh:severity sh:Warning
  ], [
    sh:message "An action with refinement must have a valid refinement." ;
    sh:path odrl:refinement ;
    sh:minCount 1 ;
    sh:or ([
      sh:node <http://example.com/ConstraintShape>
    ] [
      sh:node <http://example.com/LogicalConstraintShape>
    ])
  ] .

<http://example.com/AssetShape> a sh:NodeShape ;
  sh:property [
    sh:nodeKind sh:IRI ;
    sh:message "An Asset may have one uid, and it must be an IRI." ;
    sh:path odrl:uid ;
    sh:maxCount 1
  ], [
    sh:message "partOf should point to an AssetCollection." ;
    sh:path odrl:partOf ;
    sh:node <http://example.com/AssetCollectionShape>
  ], [
    sh:nodeKind sh:IRI ;
    sh:message "hasPolicy must point to a Policy IRI." ;
    sh:path odrl:hasPolicy
  ] ;
  sh:node <http://example.com/AssetTypeShape> .

<http://example.com/PartyShape> a sh:NodeShape ;
  sh:property [
    sh:nodeKind sh:IRI ;
    sh:message "A Party may have one uid, and it must be an IRI." ;
    sh:path odrl:uid ;
    sh:maxCount 1
  ], [
    sh:message "partOf should point to an PartyCollection." ;
    sh:path odrl:partOf ;
    sh:node <http://example.com/PartyCollectionShape>
  ] ;
  sh:node <http://example.com/PartyTypeShape> .

<http://example.com/PartyCollectionShape> a sh:NodeShape ;
  sh:property [
    sh:nodeKind sh:IRI ;
    sh:message "A PartyCollection may have one source, and it must be an IRI." ;
    sh:path odrl:source ;
    sh:maxCount 1
  ], [
    sh:message "Each PartyCollection refinement must be a Constraint or LogicalConstraint." ;
    sh:path odrl:refinement ;
    sh:or ([
      sh:node <http://example.com/ConstraintShape>
    ] [
      sh:node <http://example.com/LogicalConstraintShape>
    ])
  ] ;
  sh:node <http://example.com/PartyShape> .

<http://example.com/ConstraintShape> a sh:NodeShape ;
  sh:targetClass odrl:Constraint ;
  sh:property [
    sh:nodeKind sh:IRI ;
    sh:message "A Constraint may have one uid, and it must be an IRI." ;
    sh:path odrl:uid ;
    sh:maxCount 1
  ], [
    sh:message "A Constraint may have one dataType." ;
    sh:path odrl:datatype ;
    sh:maxCount 1
  ], [
    sh:nodeKind sh:IRI ;
    sh:message "A Constraint may have one unit, and it must be an IRI." ;
    sh:path odrl:unit ;
    sh:maxCount 1
  ], [
    sh:message "A Constraint may have one status." ;
    sh:path odrl:status ;
    sh:maxCount 1
  ], [
    sh:message "A Constraint must have one odrl:leftOperand." ;
    sh:path odrl:leftOperand ;
    sh:maxCount 1 ;
    sh:minCount 1
  ], [
    sh:message "The constraint leftOperand should be part of the ODRL vocabulary or typed as odrl:LeftOperand." ;
    sh:path odrl:leftOperand ;
    sh:severity sh:Warning ;
    sh:or ([
      sh:in (odrl:absolutePosition odrl:absoluteSpatialPosition odrl:absoluteTemporalPosition odrl:absoluteSize odrl:count odrl:dateTime odrl:delayPeriod odrl:deliveryChannel odrl:elapsedTime odrl:event odrl:fileFormat odrl:industry odrl:language odrl:media odrl:meteredTime odrl:payAmount odrl:percentage odrl:product odrl:purpose odrl:recipient odrl:relativePosition odrl:relativeSpatialPosition odrl:relativeTemporalPosition odrl:relativeSize odrl:resolution odrl:spatial odrl:spatialCoordinates odrl:systemDevice odrl:timeInterval odrl:unitOfCount odrl:version odrl:virtualLocation)
    ] [
      sh:class odrl:LeftOperand
    ])
  ], [
    sh:message "A Constraint must have one odrl:operator." ;
    sh:path odrl:operator ;
    sh:maxCount 1 ;
    sh:minCount 1
  ], [
    sh:message "The operator should be a standard ODRL operators." ;
    sh:path odrl:operator ;
    sh:in (odrl:eq odrl:gt odrl:gteq odrl:lt odrl:lteq odrl:neq odrl:isA odrl:hasPart odrl:isPartOf odrl:isAllOf odrl:isAnyOf odrl:isNoneOf) ;
    sh:severity sh:Warning
  ] ;
  sh:xone ([
    sh:property [
      sh:message "A Constraint must have one of odrl:rightOperand or odrl:rightOperandReference." ;
      sh:path odrl:rightOperand ;
      sh:maxCount 1 ;
      sh:minCount 1 ;
      sh:or ([
        sh:nodeKind sh:Literal
      ] [
        sh:nodeKind sh:IRI
      ] [
        sh:class odrl:RightOperand
      ] [
        sh:node <http://example.com/RightOperandListShape>
      ])
    ]
  ] [
    sh:property [
      sh:message "A Constraint must have one of odrl:rightOperand or odrl:rightOperandReference." ;
      sh:path odrl:rightOperandReference ;
      sh:maxCount 1 ;
      sh:minCount 1 ;
      sh:or ([
        sh:nodeKind sh:IRI
      ] [
        sh:node <http://example.com/RightOperandReferenceListShape>
      ])
    ]
  ]) .

<http://example.com/LogicalConstraintShape> a sh:NodeShape ;
  sh:targetClass odrl:LogicalConstraint ;
  sh:property [
    sh:nodeKind sh:IRI ;
    sh:message "A Logical Constraint may have one uid, and it must be an IRI." ;
    sh:path odrl:uid ;
    sh:maxCount 1
  ], [
    sh:message "A LogicalConstraint must contain one of odrl:and, odrl:or, odrl:xone, or odrl:andSequence." ;
    sh:path [
      sh:alternativePath (odrl:or odrl:xone odrl:and odrl:andSequence)
    ] ;
    sh:maxCount 1 ;
    sh:minCount 1 ;
    sh:node <http://example.com/ConstraintListShape>
  ] .

<http://example.com/OfferRequiredAssignerShape> a sh:NodeShape ;
  sh:property [
    sh:message "An Offer rule must have one assigner." ;
    sh:path odrl:assigner ;
    sh:minCount 1
  ] .

<http://example.com/AgreementRequiredAssignerShape> a sh:NodeShape ;
  sh:property [
    sh:message "An Agreement rule must have one assigner." ;
    sh:path odrl:assigner ;
    sh:minCount 1
  ] .

<http://example.com/AgreementRequiredAssigneeShape> a sh:NodeShape ;
  sh:property [
    sh:message "An Agreement rule must have one assignee." ;
    sh:path odrl:assignee ;
    sh:minCount 1
  ] .

<http://example.com/RightOperandListShape> a sh:NodeShape ;
  sh:property [
    sh:message "Each value in rightOperand must be a literal, an IRI, or a RightOperand." ;
    sh:path ([
      sh:zeroOrMorePath rdf:rest
    ] rdf:first) ;
    sh:or ([
      sh:nodeKind sh:Literal
    ] [
      sh:nodeKind sh:IRI
    ] [
      sh:class odrl:RightOperand
    ])
  ] ;
  sh:node <http://example.com/RdfListShape> .

<http://example.com/RightOperandReferenceListShape> a sh:NodeShape ;
  sh:property [
    sh:nodeKind sh:IRI ;
    sh:message "Each value in rightOperandReference must be an IRI." ;
    sh:path ([
      sh:zeroOrMorePath rdf:rest
    ] rdf:first)
  ] ;
  sh:node <http://example.com/RdfListShape> .

<http://example.com/RdfListShape> a sh:NodeShape ;
  sh:property [
    sh:path [
      sh:zeroOrMorePath rdf:rest
    ] ;
    sh:node <http://example.com/RdfListNodeShape> ;
    sh:hasValue rdf:nil
  ] .

<http://example.com/ConstraintListShape> a sh:NodeShape ;
  sh:property [
    sh:message "Each value in a logical constraint must be a Constraint." ;
    sh:path ([
      sh:zeroOrMorePath rdf:rest
    ] rdf:first) ;
    sh:node <http://example.com/ConstraintShape>
  ] ;
  sh:node <http://example.com/RdfListShape> .

<http://example.com/RdfListNodeShape> a sh:NodeShape ;
  sh:or ([
    sh:property [
      sh:path rdf:first ;
      sh:maxCount 0
    ], [
      sh:path rdf:rest ;
      sh:maxCount 0
    ] ;
    sh:hasValue rdf:nil
  ] [
    sh:property [
      sh:path rdf:first ;
      sh:maxCount 1 ;
      sh:minCount 1
    ], [
      sh:path rdf:rest ;
      sh:maxCount 1 ;
      sh:minCount 1
    ] ;
    sh:not [
      sh:hasValue rdf:nil
    ]
  ]) .

<http://example.com/PartyTypeShape> a sh:NodeShape ;
  sh:message "The party should be typed as odrl:Party or odrl:PartyCollection." ;
  sh:severity sh:Warning ;
  sh:or ([
    sh:property [
      sh:path rdf:type ;
      sh:hasValue odrl:Party
    ]
  ] [
    sh:property [
      sh:path rdf:type ;
      sh:hasValue odrl:PartyCollection
    ]
  ]) .

<http://example.com/AllowedActionValueShape> a sh:NodeShape ;
  sh:message "Action is neither part of the ODRL Vocabulary nor typed as odrl:Action." ;
  sh:severity sh:Warning ;
  sh:or ([
    sh:in (odrl:acceptTracking odrl:aggregate odrl:anonymize odrl:annotate odrl:archive odrl:attribute odrl:compensate odrl:concurrentUse odrl:delete odrl:derive odrl:digitize odrl:display odrl:distribute odrl:ensureExclusivity odrl:execute odrl:extract odrl:give odrl:grantUse odrl:include odrl:index odrl:inform odrl:install odrl:modify odrl:move odrl:nextPolicy odrl:obtainConsent odrl:play odrl:present odrl:print odrl:read odrl:reproduce odrl:reviewPolicy odrl:sell odrl:stream odrl:synchronize odrl:textToSpeech odrl:transfer odrl:transform odrl:translate odrl:uninstall odrl:use odrl:watermark <http://creativecommons.org/ns#Attribution> <http://creativecommons.org/ns#CommercialUse> <http://creativecommons.org/ns#DerivativeWorks> <http://creativecommons.org/ns#Distribution> <http://creativecommons.org/ns#Notice> <http://creativecommons.org/ns#Reproduction> <http://creativecommons.org/ns#ShareAlike> <http://creativecommons.org/ns#Sharing> <http://creativecommons.org/ns#SourceCode>)
  ] [
    sh:class odrl:Action
  ]) .

<http://example.com/AssetTypeShape> a sh:NodeShape ;
  sh:message "The asset should be typed as odrl:Asset or odrl:AssetCollection." ;
  sh:severity sh:Warning ;
  sh:or ([
    sh:property [
      sh:path rdf:type ;
      sh:hasValue odrl:Asset
    ]
  ] [
    sh:property [
      sh:path rdf:type ;
      sh:hasValue odrl:AssetCollection
    ]
  ]) .

<http://example.com/AssetCollectionShape> a sh:NodeShape ;
  sh:property [
    sh:nodeKind sh:IRI ;
    sh:message "An AssetCollection may have one source, and it must be an IRI." ;
    sh:path odrl:source ;
    sh:maxCount 1
  ], [
    sh:message "Each AssetCollection refinement must be a Constraint or LogicalConstraint." ;
    sh:path odrl:refinement ;
    sh:or ([
      sh:node <http://example.com/ConstraintShape>
    ] [
      sh:node <http://example.com/LogicalConstraintShape>
    ])
  ] ;
  sh:node <http://example.com/AssetShape> .

<http://example.com/ConstraintValidationShape> a sh:NodeShape ;
  sh:targetClass odrl:Constraint ;
  sh:node <http://example.com/AbsolutePositionOperatorShape>, <http://example.com/AbsoluteSpatialPositionOperatorShape>, <http://example.com/AbsoluteTemporalPositionOperatorShape>, <http://example.com/AbsoluteSizeOperatorShape>, <http://example.com/CountOperatorShape>, <http://example.com/CountRightOperandShape>, <http://example.com/DateTimeOperatorShape>, <http://example.com/DateTimeRightOperandShape> ;
  sh:severity sh:Warning .

<http://example.com/AbsolutePositionOperatorShape> a sh:NodeShape ;
  sh:message "Absolute Position is only compatible with odrl:eq, odrl:gt, odrl:gteq, odrl:lt, odrl:lteq, or odrl:neq." ;
  sh:severity sh:Warning ;
  sh:not [
    sh:and (sh:property [
      sh:path odrl:leftOperand ;
      sh:hasValue odrl:absolutePosition
    ] sh:property [
      sh:path odrl:operator ;
      sh:not [
        sh:in (odrl:eq odrl:gt odrl:gteq odrl:lt odrl:lteq odrl:neq)
      ]
    ])
  ] .

<http://example.com/AbsoluteSpatialPositionOperatorShape> a sh:NodeShape ;
  sh:message "Absolute Spatial Position is only compatible with odrl:eq, odrl:gt, odrl:gteq, odrl:lt, odrl:lteq, or odrl:neq." ;
  sh:severity sh:Warning ;
  sh:not [
    sh:and (sh:property [
      sh:path odrl:leftOperand ;
      sh:hasValue odrl:AbsoluteSpatialPosition
    ] sh:property [
      sh:path odrl:operator ;
      sh:not [
        sh:in (odrl:eq odrl:gt odrl:gteq odrl:lt odrl:lteq odrl:neq)
      ]
    ])
  ] .

<http://example.com/AbsoluteTemporalPositionOperatorShape> a sh:NodeShape ;
  sh:message "Absolute Temporal Position is only compatible with odrl:eq, odrl:gt, odrl:gteq, odrl:lt, odrl:lteq, or odrl:neq." ;
  sh:severity sh:Warning ;
  sh:not [
    sh:and (sh:property [
      sh:path odrl:leftOperand ;
      sh:hasValue odrl:AbsoluteTemporalPosition
    ] sh:property [
      sh:path odrl:operator ;
      sh:not [
        sh:in (odrl:eq odrl:gt odrl:gteq odrl:lt odrl:lteq odrl:neq)
      ]
    ])
  ] .

<http://example.com/AbsoluteSizeOperatorShape> a sh:NodeShape ;
  sh:message "Absolute Size is only compatible with odrl:eq, odrl:gt, odrl:gteq, odrl:lt, odrl:lteq, or odrl:neq." ;
  sh:severity sh:Warning ;
  sh:not [
    sh:and (sh:property [
      sh:path odrl:leftOperand ;
      sh:hasValue odrl:AbsoluteSize
    ] sh:property [
      sh:path odrl:operator ;
      sh:not [
        sh:in (odrl:eq odrl:gt odrl:gteq odrl:lt odrl:lteq odrl:neq)
      ]
    ])
  ] .

<http://example.com/CountOperatorShape> a sh:NodeShape ;
  sh:message "Count is only compatible with odrl:eq, odrl:gt, odrl:gteq, odrl:lt, odrl:lteq, or odrl:neq." ;
  sh:severity sh:Warning ;
  sh:not [
    sh:and (sh:property [
      sh:path odrl:leftOperand ;
      sh:hasValue odrl:count
    ] sh:property [
      sh:path odrl:operator ;
      sh:not [
        sh:in (odrl:eq odrl:gt odrl:gteq odrl:lt odrl:lteq odrl:neq)
      ]
    ])
  ] .

<http://example.com/CountRightOperandShape> a sh:NodeShape ;
  sh:message "The rightOperand for count should be an integer." ;
  sh:severity sh:Warning ;
  sh:not [
    sh:and ([
      sh:property [
        sh:path odrl:leftOperand ;
        sh:hasValue odrl:count
      ]
    ] [
      sh:property [
        sh:path odrl:rightOperand ;
        sh:not [
          sh:datatype xsd:integer
        ]
      ]
    ])
  ] .

<http://example.com/DateTimeOperatorShape> a sh:NodeShape ;
  sh:message "DataTime is only compatible with odrl:eq, odrl:gt, odrl:gteq, odrl:lt, odrl:lteq, or odrl:neq." ;
  sh:severity sh:Warning ;
  sh:not [
    sh:and ([
      sh:property [
        sh:path odrl:leftOperand ;
        sh:hasValue odrl:dateTime
      ]
    ] [
      sh:property [
        sh:path odrl:operator ;
        sh:minCount 1 ;
        sh:not [
          sh:in (odrl:eq odrl:gt odrl:gteq odrl:lt odrl:lteq odrl:neq)
        ]
      ]
    ])
  ] .

<http://example.com/DataTimeRightOperandShape> a sh:NodeShape ;
  sh:message "The rightOperand for dateTime should be a valid date or date time." ;
  sh:severity sh:Warning ;
  sh:not [
    sh:and ([
      sh:property [
        sh:path odrl:leftOperand ;
        sh:hasValue odrl:dateTime
      ]
    ] [
      sh:property [
        sh:path odrl:rightOperand ;
        sh:not [
          sh:or ([
            sh:datatype xsd:date
          ] [
            sh:datatype xsd:dateTime
          ])
        ]
      ]
    ])
  ] .
`