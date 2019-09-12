/* eslint @typescript-eslint/no-var-requires: 0 */

import DebugServer from '../lib/DebugServer';

const port = 4921;
const options = {
  port: 0,
  listen: 0,
};

if ( process.argv.indexOf( '--debug-listener' ) > -1 ) {
  options.listen = port;
}
else {
  options.port = port;
}
const s = new DebugServer( options );

const keypress = require( 'keypress' );

interface Key {
  name: string
  ctrl: boolean
  meta: boolean
  shift: boolean
  sequence: string
}

const mainEvent = ( ch: string, key: Key ): void => {
  s.log( { key, ch } );
  if ( key && key.ctrl && key.name === 'c' ) {
    process.stdin.pause();
    process.exit( 0 );
  }
};

keypress( process.stdin );
process.stdin.on( 'keypress', mainEvent );
process.stdin.setRawMode( true );
process.stdin.resume();
