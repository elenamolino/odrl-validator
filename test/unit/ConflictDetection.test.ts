import 'jest-rdf';
import { DataFactory, Store } from 'n3';
import { EyelingReasoner } from 'n3-utility';
import { ODRL, RDF } from 'odrl-atomization';
import { RULES } from '../../src/rules/Rules';
import { DETECTION } from '../../src/util/Vocabulary';
import { blanknodeify } from '../util/RDFUtil';
import { DPV, DPVODRL, TEST } from '../util/Util';

const { quad } = DataFactory;

describe('The conflict detection rules', () => {

    test('fires a conflict detection error when two constraints in a rule have the same left operand and operator, but a different right operand.', async () => {

        const policy = [
            quad(TEST.terms.permission1, RDF.terms.type, ODRL.terms.Permission),
            quad(TEST.terms.permission1, ODRL.terms.assignee, TEST.terms.alice),
            quad(TEST.terms.permission1, ODRL.terms.target, TEST.terms.resourceX),
            quad(TEST.terms.permission1, ODRL.terms.action, ODRL.terms.read),

            quad(TEST.terms.permission1, ODRL.terms.constraint, TEST.terms.constraint1),
            quad(TEST.terms.permission1, ODRL.terms.constraint, TEST.terms.constraint2),

            quad(TEST.terms.constraint1, RDF.terms.type, ODRL.terms.Constraint),
            quad(TEST.terms.constraint1, ODRL.terms.leftOperand, DPVODRL.terms.Purpose),
            quad(TEST.terms.constraint1, ODRL.terms.operator, ODRL.terms.eq),
            quad(TEST.terms.constraint1, ODRL.terms.rightOperand, DPV.terms.Advertising),

            quad(TEST.terms.constraint2, RDF.terms.type, ODRL.terms.Constraint),
            quad(TEST.terms.constraint2, ODRL.terms.leftOperand, DPVODRL.terms.Purpose),
            quad(TEST.terms.constraint2, ODRL.terms.operator, ODRL.terms.eq),
            quad(TEST.terms.constraint2, ODRL.terms.rightOperand, DPV.terms.NonCommercialResearch),
        ];

        const rules = RULES
        const reasoner = new EyelingReasoner();

        const inference = await reasoner.reason(new Store(policy), rules)

        const createNode = DataFactory.blankNode()
        const expected = [
            quad(createNode, RDF.terms.type, DETECTION.terms.Conflict),
            quad(createNode, RDF.terms.type, DETECTION.terms.ConstraintConflict),
            quad(createNode, DETECTION.terms.rules, TEST.terms.constraint2),
            quad(createNode, DETECTION.terms.rules, TEST.terms.constraint1),
            quad(
                createNode,
                DETECTION.terms.reason,
                DataFactory.literal('A rule with constraints with the same left operand and the equals operator can never be satisfied if the right operands differ')
            ),
        ];        
        expect(blanknodeify(inference.getQuads(null, null, null, null))).toBeRdfIsomorphic(expected);
    });
});