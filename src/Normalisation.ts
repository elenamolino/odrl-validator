import { Quad } from "@rdfjs/types";
import { Quad_Subject, Store } from "n3";
import { Atomizer, ODRL } from "odrl-atomization";

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
        // N1. Internalization of parties and assets declared out of the policy
        const internalizedPolicies = internalization(quads);
        // N4. Interiorizing policy-level properties (dealing with compact policies)
        // N5. Expansion from compound to irreducible rules (dealing with composite rules)
        const atomizedODRLPolicies = await new Atomizer().atomize(internalizedPolicies)
        return atomizedODRLPolicies
    }

}


export function internalization(quads: Quad[]) {
    const store = new Store(quads)

    const assignees = store.getQuads(null, ODRL.terms.assigneeOf, null, null);
    for (const assignee of assignees) {
        store.removeQuad(assignee);
        store.addQuad(assignee.object as Quad_Subject, ODRL.terms.assignee, assignee.subject, assignee.graph);
    }

    const assigners = store.getQuads(null, ODRL.terms.assignerOf, null, null);
    for (const assigner of assigners) {
        store.removeQuad(assigner);
        store.addQuad(assigner.object as Quad_Subject, ODRL.terms.assigner, assigner.subject, assigner.graph);
    }

    const targets = store.getQuads(null, ODRL.terms.hasPolicy, null, null);
    for (const target of targets) {
        store.removeQuad(target);
        store.addQuad(target.object as Quad_Subject, ODRL.terms.target, target.subject, target.graph);
    }

    return store.getQuads(null, null, null, null);
}
// TODO: 
// 1. go to meeting notes and write why we need normalization
// 2. describe our algorithm (if it differs from the wiki, elaborate)
// 3. create some tests based on the current failing tests -> see meeting notes or mattermost
// 4. implement


// The correct order for the transformations would be N1, N2, N3, N10, N4, N6, N7, N8, N9, N5. Pending to be renamed after after no references are found. 

// things we won't do right now
// N2. Type declaration of policy elements
// N3. Application of inheritance rules (`odrl:inheritFrom`)
// N6. Inferences derived from odrl:includedIn (useful reasoning for evaluation) -> done in the ODRL Evaluator
// N7. Inferences derived from odrl:implies (useful reasoning for evaluation)
// N8. Inferences derived from odrl:partOf for Asset Collection (useful reasoning for evaluation) -> done in the ODRL Evaluator
// N9. Inferences derived from odrl:partOf for Party Collection (useful reasoning for evaluation) -> done in the ODRL Evaluator
// N10. Policy Replacement (`α odrl:isReplacedBy β`)
