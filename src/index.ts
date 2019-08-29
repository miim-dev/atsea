/* eslint @typescript-eslint/no-var-requires: 0 */
const keypress = require( 'keypress' )

interface Key {
  name: string
  ctrl: boolean
  meta: boolean
  shift: boolean
  sequence: string
}

const mainEvent = ( ch: string, key: Key ): void => {
  console.table( key )
  if ( key && key.ctrl && key.name === 'c' ) {
    process.stdin.pause()
  }
}

keypress( process.stdin )
process.stdin.on( 'keypress', mainEvent )
process.stdin.setRawMode( true )
process.stdin.resume()
