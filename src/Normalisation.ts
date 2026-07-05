import { Quad } from "@rdfjs/types";
import { Quad_Subject, Store } from "n3";
import { Atomizer, ODRL, RDF } from "odrl-atomization";

/**
 * ODRL Normalization is the process of applying a series of transformations to produce an irreducible standard form of an ODRL Policy.
 * There are several reasons why a standard form is desirable:
 * It simplifies policy structure validation and makes the evaluation process easier as well.
 * 
 * See following wiki for more information regarding normalization of ODRL policies: https://www.w3.org/2016/poe/wiki/Validation
 */
export interface INormalizer {
    normalise(quads: Quad[]): Promise<Quad[]>
}

export class Normalizer implements INormalizer {

    async normalise(quads: Quad[]): Promise<Quad[]> {
        // Infer the class of ODRL Rules based on its relation.
        // This is currently done for the following test cases of the ODRL Validator: 38, 39, 40, 45, 70, 71.
        // Note that 45 is still (rightfully) false. An agreement must have an assigner
        const inferredPolicies = inferRules(quads)

        // N1. Internalization of parties and assets declared out of the policy
        const internalizedPolicies = internalization(inferredPolicies);
        // N4. Interiorizing policy-level properties (dealing with compact policies)
        // N5. Expansion from compound to irreducible rules (dealing with composite rules)
        let atomizedODRLPolicies: Quad[];
        try {
            atomizedODRLPolicies = await new Atomizer().atomize(internalizedPolicies)
        } catch (error) {
            console.error("Error atomizing policies:", error);
            atomizedODRLPolicies = internalizedPolicies
        }
        return atomizedODRLPolicies
    }

}
/**
 * Infers the class of ODRL Rules based on its relation.
 */
export function inferRules(quads: Quad[]) {
    const store = new Store(quads)

    const permissions = store.getQuads(null, ODRL.terms.permission, null, null);
    for (const rule of permissions) {
        store.addQuad(rule.object as Quad_Subject, RDF.terms.type, ODRL.terms.Permission);
    }

    const prohibitions = store.getQuads(null, ODRL.terms.prohibition, null, null);
    for (const rule of prohibitions) {
        store.addQuad(rule.object as Quad_Subject, RDF.terms.type, ODRL.terms.Prohibition);
    }

    const duties = store.getQuads(null, ODRL.terms.obligation, null, null);
    for (const rule of duties) {
        store.addQuad(rule.object as Quad_Subject, RDF.terms.type, ODRL.terms.Duty);
    }

    return store.getQuads(null, null, null, null);
}

/**
 * Internalization of parties and assets declared out of the policy.
 * Deals with `assignerOf`, `hasPolicy` and `assigneeOf`.
 */
export function internalization(quads: Quad[]) {
    const store = new Store(quads)

    const assignees = store.getQuads(null, ODRL.terms.assigneeOf, null, null);
    for (const assignee of assignees) {
        store.removeQuad(assignee);
        store.addQuad(assignee.object as Quad_Subject, ODRL.terms.assignee, assignee.subject);
    }

    const assigners = store.getQuads(null, ODRL.terms.assignerOf, null, null);
    for (const assigner of assigners) {
        store.removeQuad(assigner);
        store.addQuad(assigner.object as Quad_Subject, ODRL.terms.assigner, assigner.subject);
    }

    const targets = store.getQuads(null, ODRL.terms.hasPolicy, null, null);
    for (const target of targets) {
        store.removeQuad(target);
        store.addQuad(target.object as Quad_Subject, ODRL.terms.target, target.subject);
    }

    return store.getQuads(null, null, null, null);
}
// The correct order for the transformations would be N1, N2, N3, N10, N4, N6, N7, N8, N9, N5. Pending to be renamed after after no references are found. 

// things we won't do right now
// N2. Type declaration of policy elements
// N3. Application of inheritance rules (`odrl:inheritFrom`)
// N6. Inferences derived from odrl:includedIn (useful reasoning for evaluation) -> done in the ODRL Evaluator
// N7. Inferences derived from odrl:implies (useful reasoning for evaluation)
// N8. Inferences derived from odrl:partOf for Asset Collection (useful reasoning for evaluation) -> done in the ODRL Evaluator
// N9. Inferences derived from odrl:partOf for Party Collection (useful reasoning for evaluation) -> done in the ODRL Evaluator
// N10. Policy Replacement (`α odrl:isReplacedBy β`)
