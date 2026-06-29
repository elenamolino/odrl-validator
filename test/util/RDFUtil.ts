import { DataFactory, Quad, Store, Term } from "n3";


/**
 * Replace all the subjects of nodes in a graph with a blank node.
 * References to this subject in the graph are also accordingly updated.
 * @param quads
 */
export function blanknodeify(quads: Quad[]): Quad[] {
    const store = new Store(quads);
    const subjects: Term[] = store.getSubjects(null, null, null);

    for (const subject of subjects) {
        const blankNode = DataFactory.blankNode();

        const triplesWhereSubject = store.getQuads(subject, null, null, null);
        const replacedTriplesSubject = triplesWhereSubject.map(quad => DataFactory.quad(blankNode, quad.predicate, quad.object));

        store.removeQuads(triplesWhereSubject);
        store.addQuads(replacedTriplesSubject);

        const triplesWhereObject = store.getQuads(null, null, subject, null);
        const replacedTriplesObject = triplesWhereObject.map(quad => DataFactory.quad(quad.subject, quad.predicate, blankNode));

        store.removeQuads(triplesWhereObject);
        store.addQuads(replacedTriplesObject);
    }

    return store.getQuads(null, null, null, null);
}