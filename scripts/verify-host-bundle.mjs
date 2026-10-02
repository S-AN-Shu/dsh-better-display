import assert from 'node:assert/strict';
// Import the emitted package entry, not the TS source: installation must boot.
const entry = await import('../lib/dsh-better-display.js');
assert.equal(entry.name, 'dsh-better-display');
assert.equal(typeof entry.apply, 'function');
assert.deepEqual(entry.inject, ['webServer']);
console.log('Emitted Host entry imports successfully');
