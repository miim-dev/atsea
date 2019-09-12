/* eslint @typescript-eslint/no-var-requires: 0 */

import logger from './logger';
const keypress = require( 'keypress' );

interface Key {
  name: string
  ctrl: boolean
  meta: boolean
  shift: boolean
  sequence: string
}

const mainEvent = ( ch: string, key: Key ): void => {
  logger.log( { key, ch } );
  if ( key && key.ctrl && key.name === 'c' ) {
    process.stdin.pause();
    process.exit( 0 );
  }
};

class Keyevents {
  init() {
    keypress( process.stdin );
    process.stdin.on( 'keypress', mainEvent );
    process.stdin.setRawMode( true );
    process.stdin.resume();
  }
}

const keyevents = new Keyevents();
export default keyevents;
