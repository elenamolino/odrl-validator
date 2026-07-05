import 'jest-rdf';
import { DataFactory, Store } from 'n3';
import { internalization } from '../../src/Normalisation';
import { ODRL, RDF } from 'odrl-atomization';
import { TEST } from '../util/Util';



const { quad } = DataFactory;

describe('The Internalization function', () => {

    test('internalizes an externally declared assigner.', () => {

        const policy = [
            quad(TEST.terms.policy1, RDF.terms.type, ODRL.terms.Policy),
            quad(TEST.terms.party1, ODRL.terms.assignerOf, TEST.terms.policy1),
        ];

        const expected = new Store([
            quad(TEST.terms.policy1, RDF.terms.type, ODRL.terms.Policy),
            quad(TEST.terms.policy1, ODRL.terms.assigner, TEST.terms.party1),
        ]);

        expect(internalization(policy)).toBeRdfIsomorphic(expected);
    });

    test('internalizes an externally declared assignee.', () => {

        const policy = [
            quad(TEST.terms.policy1, RDF.terms.type, ODRL.terms.Policy),
            quad(TEST.terms.party1, ODRL.terms.assigneeOf, TEST.terms.policy1),
        ];

        const expected = new Store([
            quad(TEST.terms.policy1, RDF.terms.type, ODRL.terms.Policy),
            quad(TEST.terms.policy1, ODRL.terms.assignee, TEST.terms.party1),
        ]);

        expect(internalization(policy)).toBeRdfIsomorphic(expected);
    });

    test('internalizes an externally declared target.', () => {

        const policy = [
            quad(TEST.terms.policy1, RDF.terms.type, ODRL.terms.Policy),
            quad(TEST.terms.asset, ODRL.terms.hasPolicy, TEST.terms.policy1),
        ];

        const expected = new Store([
            quad(TEST.terms.policy1, RDF.terms.type, ODRL.terms.Policy),
            quad(TEST.terms.policy1, ODRL.terms.target, TEST.terms.asset),
        ]);

        expect(internalization(policy)).toBeRdfIsomorphic(expected);
    });

    test('does nothing when there are no external declarations.', () => {

        const policy = [
            quad(TEST.terms.policy1, RDF.terms.type, ODRL.terms.Policy),
            quad(TEST.terms.policy1, ODRL.terms.assigner, TEST.terms.party1),
            quad(TEST.terms.policy1, ODRL.terms.assignee, TEST.terms.party1),
            quad(TEST.terms.policy1, ODRL.terms.target, TEST.terms.asset),
        ];

        expect(internalization(policy)).toBeRdfIsomorphic(policy);
    });

    test('internalizes all supported external declarations.', () => {

        const policy = [
            quad(TEST.terms.policy1, RDF.terms.type, ODRL.terms.Policy),

            quad(TEST.terms.party1, ODRL.terms.assignerOf, TEST.terms.policy1),
            quad(TEST.terms.party2, ODRL.terms.assigneeOf, TEST.terms.policy1),
            quad(TEST.terms.asset, ODRL.terms.hasPolicy, TEST.terms.policy1),
        ];

        const expected = new Store([
            quad(TEST.terms.policy1, RDF.terms.type, ODRL.terms.Policy),

            quad(TEST.terms.policy1, ODRL.terms.assigner, TEST.terms.party1),
            quad(TEST.terms.policy1, ODRL.terms.assignee, TEST.terms.party2),
            quad(TEST.terms.policy1, ODRL.terms.target, TEST.terms.asset),
        ]);

        expect(internalization(policy)).toBeRdfIsomorphic(expected);
    });

    test('internalizes an externally declared target when the target is already present.', () => {

        const policy = [
            quad(TEST.terms.policy1, RDF.terms.type, ODRL.terms.Policy),
            quad(TEST.terms.policy1, ODRL.terms.target, TEST.terms.asset),
            quad(TEST.terms.asset, ODRL.terms.hasPolicy, TEST.terms.policy1),
        ];

        const expected = new Store([
            quad(TEST.terms.policy1, RDF.terms.type, ODRL.terms.Policy),
            quad(TEST.terms.policy1, ODRL.terms.target, TEST.terms.asset),
        ]);

        expect(internalization(policy)).toBeRdfIsomorphic(expected);
    });

    test('internalizes an externally declared assignee when another assignee is already present.', () => {

        const policy = [
            quad(TEST.terms.policy1, RDF.terms.type, ODRL.terms.Policy),
            quad(TEST.terms.policy1, ODRL.terms.assignee, TEST.terms.party1),
            
            quad(TEST.terms.party2, ODRL.terms.assigneeOf, TEST.terms.policy1),
        ];

        const expected = new Store([
            quad(TEST.terms.policy1, RDF.terms.type, ODRL.terms.Policy),

            quad(TEST.terms.policy1, ODRL.terms.assignee, TEST.terms.party1),
            quad(TEST.terms.policy1, ODRL.terms.assignee, TEST.terms.party2),
        ]);

        expect(internalization(policy)).toBeRdfIsomorphic(expected);
    });
});