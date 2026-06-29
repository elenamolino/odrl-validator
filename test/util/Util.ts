import { createVocabulary } from "rdf-vocabulary";

export const TEST = createVocabulary(
    'http://example.org/',
    'policy1',
    'permission1',
    'prohibition1',
    'duty1',
    'asset',
    'party1',
    'party2',
    'alice',
    'resourceX',
    'constraint1',
    'constraint2'
);

export const DPV = createVocabulary(
    'http://www.w3.org/ns/dpv#',
    'NonCommercialResearch',
    'Advertising'
)
export const DPVODRL = createVocabulary(
    'https://w3id.org/dpv/mappings/odrl#',
    'Purpose',
)
