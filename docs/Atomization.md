# Atomization: dealing with compact policies and rule composition

When working with a lot of policies in ODRL, the strict cardinalities on rules result into writing a lot of rules.
To avoid repetition, the ODRL 2.2 Information Model (IM) introduces syntactic sugar to write compact policies in [§2.7 Policy Rule Composition](https://www.w3.org/TR/odrl-model/#composition) with two techniques:

- [Compact policies](#compact-policies): Elevate action, target, and assignee/assigner properties from the rule to the policy level.
- [Rule composition](#rule-composition): Extend the cardinalities of action, target, and assignee/assigner on the rule level.

As the goal of this repository is to provide a tool to validate ODRL policies this poses a conondrum:
On the one hand, we have to be very strict regarding the cardinalities on a rule level, and, on the other hand these cardinalities don't matter for valid ODRL policies.
To balance this issue, we opt for a pragmatic approach[^1]: we **atomize** the policies and validate with a SHACL shape that only deals with policies with rules in **atomic** form (basically ignoring §2.7 all together).

Luckily, there exists a package already that provides this exact support for ODRL policies: [ODRL-atomization](https://www.npmjs.com/package/odrl-atomization).

In the **ODRL Validator** we thus make use of that package to atomize the policies before doing the SHACL validation.

Below is some further explanation how atomization of compact policies, rule composition and the combination of those works in practice.

## Atomization

**Atomic rules** in ODRL means that the cardinalities of the action, target, and assignee/assigner properties are limited to 1.
E.g. An atomic rule can not have two actions.

### Compact Policies

In ODRL, `action`, `target`, and `assignee`/`assigner` properties are typically defined at the rule level. 
However, when these properties are common across multiple rules, they can be elevated to the policy level. 
This approach results in a **compact policy**, where the same permissions are conveyed by placing these properties (such as `assignee`, `action`, and `target`) at the policy level, rather than repeating them in each individual rule.

Elevating these properties to the policy level means they are inherited by all the rules within the policy, simplifying the representation without altering the meaning.
Conversely, the meaning of the policy would be the same if the properties were moved back to the individual rule level, as in the **atomic rule form**.

To illustrate how this works, the following examples show two equivalent policies. The first is in the atomic form with rules defined explicitly, while the second uses the compact policy form to reduce redundancy.

#### Policy with Two Atomic Rules

In this policy, Alice is assigned to each rule individually. 
The rules specify that Alice is allowed to read resource X and modify resource Y:

```ttl
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

<#policy1> a odrl:Policy ;
    odrl:permission <#rule1>, <#rule2> .

<#rule1> a odrl:Permission ;
    odrl:assignee <#alice> ;
    odrl:action odrl:read ;
    odrl:target <#resourceX> .

<#rule2> a odrl:Permission ;
    odrl:assignee <#alice> ;
    odrl:action odrl:modify ;
    odrl:target <#resourceY> .
```

#### Compact Policy with Two Rules
In this compact policy, Alice is placed at the policy level as the `assignee` for both rules, reducing repetition while maintaining the same meaning: Alice is allowed to read resource X and modify resource Y:

```ttl
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

<#policy2> a odrl:Policy ;
    odrl:assignee <#alice> ;
    odrl:permission <#rule1>, <#rule2> .

<#rule1> a odrl:Permission ;
    odrl:action odrl:read ;
    odrl:target <#resourceX> .

<#rule2> a odrl:Permission ;
    odrl:action odrl:modify ;
    odrl:target <#resourceY> .
```

### Rule Composition
When introducing rules, ODRL limits the cardinality to the `action`, `target`, and `assignee`/`assigner` properties to 1.
If you are creating a lot of rules that pertain to a single `assignee`, this introduces a lot of repetition.
All other properties, can be combined however in a single rule. This then result in the carthesision product of all its individual properties

When introducing rules, ODRL limits the cardinality of the action, target, and assignee/assigner properties to 1. 
This means each rule can only assign a single action, target, and assignee at a time. 
However, in a policy multiple atomic rules might contain unnecessary repetition when multiple rules share common values for these properties.

**Composite rules** address this redundancy through providing a more efficient way to represent rules.
A composite rule is essentially a set of rules that corresponds to the **Cartesian product** of all individual properties (such as `action`, `assignee`, and `target`).
By grouping common properties together, a composite rule allows for the consolidation of multiple atomic rules into a single, concise rule while preserving its meaning.

For example, consider a policy with four atomic rules, where both Alice and bob are allowed to read and modify resource X. 
Each of these rules has a separate `assignee` and `action`, but the `target` (resource X) is the same across all rules. 
Using a composite rule, we can group the common `assignee` and `action` properties, forming a rule that encompasses the Cartesian product of these properties.

#### Policy with Four Atomic Rules
In this policy, each action-target-assignee combination is specified separately, leading to a lot of repetition. 
Alice and Bob are allowed to read or modify resource X
```ttl
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

<#policy3> a odrl:Policy ;
    odrl:permission <#rule1>, <#rule2>, <#rule3>, <#rule4> .

<#rule1> a odrl:Permission ;
    odrl:assignee <#alice> ;
    odrl:action odrl:read ;
    odrl:target <#resourceX> .

<#rule2> a odrl:Permission ;
    odrl:assignee <#alice> ;
    odrl:action odrl:modify ;
    odrl:target <#resourceX> .

<#rule3> a odrl:Permission ;
    odrl:assignee <#bob> ;
    odrl:action odrl:read ;
    odrl:target <#resourceX> .

<#rule4> a odrl:Permission ;
    odrl:assignee <#bob> ;
    odrl:action odrl:modify ;
    odrl:target <#resourceX> .
```

#### Policy with a Composite Rule
In a **composite rule**, all the actions, targets, and assignees are combined in one rule, greatly reducing redundancy while maintaining the same meaning. 
The resulting rule allows Alice and Bob to either read or modify resource X

```ttl
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

<#policy4> a odrl:Policy ;
    odrl:permission <#compositeRule> .

<#compositeRule> a odrl:Permission ;
    odrl:assignee <#alice>, <#bob> ;
    odrl:action odrl:read, odrl:modify ;
    odrl:target <#resourceX> .
```

### Combination: Compact Policies with Composite Rules
The techniques of **compact policies** and **composite rules** can be effectively combined to create more efficient and streamlined representations of rules in ODRL. 
By elevating common properties to the policy level and combining multiple properties into a single composite rule, significant reduction can be achieved while preserving clarity and precision.

We demonstrate how these two techniques work together by showcasing two equivalent policies conveying the same meaning: Alice and Bob are granted full permissions to read and modify resource X, while Charlie is prohibited from accessing or modifying it.
With **atomic rules**, this structure results in six individual rules, specifying each `assignee`, `action`, and `target` individually.
However, by combining the concepts of compact policies and composite rules, we can reduce this to just two rules without changing the meaning.

#### Policy with Six Atomic Rules
In this policy, there are six separate atomic rules: four permissions for Alice and Bob, and two prohibitions for Charlie.

Alice and Bob are granted full permissions to read and modify resource X, while Charlie is prohibited from accessing or modifying it.
```ttl
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

<#policy5> a odrl:Policy ;
    odrl:permission <#rule1>, <#rule2>, <#rule3>, <#rule4> ;
    odrl:prohibition <#rule5>, <#rule6> .

<#rule1> a odrl:Permission ;
    odrl:assignee <#alice> ;
    odrl:action odrl:read ;
    odrl:target <#resourceX> .

<#rule2> a odrl:Permission ;
    odrl:assignee <#alice> ;
    odrl:action odrl:modify ;
    odrl:target <#resourceX> .

<#rule3> a odrl:Permission ;
    odrl:assignee <#bob> ;
    odrl:action odrl:read ;
    odrl:target <#resourceX> .

<#rule4> a odrl:Permission ;
    odrl:assignee <#bob> ;
    odrl:action odrl:modify ;
    odrl:target <#resourceX> .

<#rule5> a odrl:Prohibition ;
    odrl:assignee <#charlie> ;
    odrl:action odrl:read ;
    odrl:target <#resourceX> .

<#rule5> a odrl:Prohibition ;
    odrl:assignee <#charlie> ;
    odrl:action odrl:modify ;
    odrl:target <#resourceX> .
```

#### Compact policy with two Composite Rules

In this compact policy, the common `target` property (`resourceX`) is elevated to the policy level.
Additionally, the `assignee` and `action` properties are grouped together in composite rules.

Alice and Bob are granted full permissions to read and modify resource X, while Charlie is prohibited from accessing or modifying it.
```ttl
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

<#policy6> a odrl:Policy ;
    odrl:target <#resourceX> ;
    odrl:permission <#rule1> ;
    odrl:prohibition <#rule2> .

<#rule1> a odrl:Permission ;
    odrl:assignee <#alice>, <#bob> ;
    odrl:action odrl:read, odrl:modify .

<#rule2> a odrl:Prohibition ;
    odrl:assignee <#charlie> ;
    odrl:action odrl:read, odrl:modify .
```

[^1]: This is also what is recommended in the ODRL Standard *"It is RECOMMENDED that compact ODRL Policies be expanded to atomic Policies when being processed for conformance.*
