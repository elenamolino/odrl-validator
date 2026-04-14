import { readFile } from 'fs/promises';
import { Parser} from 'n3';
import type { Quad } from '@rdfjs/types';
import { resolve } from "path";
import type { ODRLTestCase, ValidatorResult } from './Types';

/**
 * Loads ODRL test cases from a config.json file and parses TTL files.
 *
 * @param configPath Path to the config JSON file (e.g. "./config.json")
 * @returns Array of fully constructed ODRLTestCase objects
 */
export async function loadODRLTestCases(configPath: string): Promise<ODRLTestCase[]> {
  // 1. Load and parse config JSON
  const absoluteConfigPath = resolve(__dirname, "..", configPath);
console.log(__dirname);
    
  const configRaw = await readFile(absoluteConfigPath, "utf8");

  const config: Array<{
    id: string;
    file: string;
    expected: ValidatorResult;
  }> = JSON.parse(configRaw);

  const parser = new Parser();
  const testCases: ODRLTestCase[] = [];

  // 2. Loop over entries in the config list
  for (const entry of config) {
    // Load TTL file
    const ttlPath = resolve(__dirname, "..", entry.file);
    const ttlContent = await readFile(ttlPath, 'utf8');
    console.log(entry.file)
    
    // Parse into quads
    const quads: Quad[] = parser.parse(ttlContent);

    // Create the full test case
    const testCase: ODRLTestCase = {
      id: entry.id,
      file: entry.file,
      representation: quads,
      expected: entry.expected
    };

    testCases.push(testCase);
  }

  return testCases;
}