import logger from './lib/logger';
import keyevents from './lib/keyevents';

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
logger.init( options );

keyevents.init();
