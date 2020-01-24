import { lensPath } from '../src/lens';

const lensA = lensPath('a', 'b');

type A = { a?: { b?: string } };

const a: A = { a: { b: 'test' } };

const v = lensA(a); // v type is string | undefined with strictNullChecks and just string without
