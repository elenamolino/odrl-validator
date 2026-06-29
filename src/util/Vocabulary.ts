import { createVocabulary } from 'rdf-vocabulary';

// custom vocabulary for Inconsistency Detection
export const DETECTION = createVocabulary('https://w3id.org/force/detection#',
    'Conflict',
    'DeonticConflict',
    'ConstraintConflict',
    'rules',
    'reason'
)