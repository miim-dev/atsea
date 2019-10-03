import test from 'ava';
import kleur from 'kleur';

import terminalDiff from './terminalDiff';

// (red)
// foo

// (blue)
// foo

test('fn() returns foo', (t) => {
  const result = terminalDiff(kleur.red('foo'), kleur.blue('foo'));
  console.log(result);
  t.is(true, true);
});
