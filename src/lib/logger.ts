import util from 'util';
import kleur from 'kleur';
import net from 'net';

interface DebugServerOptions {
  port?: number;
  listen?: number;
}

const intensityFormatted = {
  unknown: kleur.gray( 'UNKNOWN' ),
  log: kleur.gray( 'LOG' ),
  info: kleur.cyan( 'INFO' ),
  warn: kleur.yellow( 'WARN' ),
  error: kleur.red( 'ERROR' ),
};

class Logger {
  print( message: any, intensity: string ) {
    ( console as any )[ intensity as any ]( message );
  }

  log( message: any ) {
    this.print( message, 'log' );
  }

  info( message: any ) {
    this.print( message, 'info' );
  }

  warn( message: any ) {
    this.print( message, 'warn' );
  }

  error( message: any ) {
    this.print( message, 'error' );
  }
}

class DebugServer extends Logger {
  server: any;
  clientList: any[] = [];
  client: any;
  errorOccurred: boolean = false;

  init( options: DebugServerOptions ) {
    if ( options.listen ) {
      this.initListener( options );
    }
    else if ( options.port ) {
      this.initServer( options );
    }
    else {
      throw new Error( 'Neither a port nor a listen port is specified' );
    }
  }

  stop() {
    if ( this.server ) {
      this.server.close();
    }
  }

  broadcast( packet: string ) {
    for ( const client of this.clientList ) {
      if ( client ) {
        client.write( packet );
      }
    }
  }

  print( message: any, intensity: string ) {
    this.broadcast( JSON.stringify( {
      message,
      intensity,
      time: Date.now(),
    } ) + '\n' );
  }

  private formatTime( timestamp?: number ) {
    if ( !timestamp ) {
      return '';
    }

    const pad = ( num: number ) => {
      const str = '' + num;
      return '0'.repeat( 2 - str.length ) + str;
    }

    const d = new Date( timestamp );
    return `${ pad( d.getHours() ) }:${ pad( d.getMinutes() ) }:${ pad( d.getSeconds() )}`;
  }

  private initServer( options: DebugServerOptions ) {
    this.server = net.createServer( ( client ) => {
      const clientId = this.clientList.length;
      this.clientList[ clientId ] = client;

      client.setEncoding( 'utf-8' );
      client.setTimeout( 60000 );

      const removeClientIdFromList = () => {
        this.clientList[ clientId ] = null;
        delete this.clientList[ clientId ];
      }

      client.on( 'data', ( data ) => {
        if ( data.toString() === 'PING' ) {
          client.write( 'PONG' );
        }
      } );

      client.on( 'end', () => {
        removeClientIdFromList();
      });

      client.on('timeout', () => {
        removeClientIdFromList();
      } );
    } );

    this.server.listen( options.port );
  }

  private initListener( options: DebugServerOptions ) {
    this.client = net.createConnection( {
      host: 'localhost',
      port: options.listen,
    }, () => {
      console.log( kleur.cyan( `Listening for messages on ${ this.client.remoteAddress }:${ this.client.remotePort }` ) );
    } );

    this.client.setTimeout( 60000 );
    this.client.setEncoding( 'utf8' );

    this.client.on( 'data', ( data: any ) => {
      if ( data.toString() === 'PONG' ) {
        return;
      }

      const lines = data.split( '\n' );
      for ( const line of lines ) {
        if ( !line.trim() ) {
          continue;
        }

        try {
          const parsed = JSON.parse( line );
          const { time, intensity, message, ...rest } = parsed;
          const timeLabel = this.formatTime( time );
          const intensityLabel = intensity
            ? (intensityFormatted as any )[ intensity ]
            : intensityFormatted.unknown;
          const messagePrintable = typeof message === 'object'
            ? util.inspect( message, {
              showHidden: false,
              depth: null,
              colors: true,
              compact: false,
            } )
            : message.toString ? message.toString() : message;

          const output = [ timeLabel, intensityLabel, messagePrintable ]
            .filter( Boolean )
            .join( ' ' );

          console.log( output );
        } catch ( _error ) {
          console.log( line );
        }
      }
    } );

    this.client.on( 'end', () => {
      console.log( 'Client socket disconnect.' );
      this.errorOccurred = true;
    });

    this.client.on( 'timeout', () => {
      console.log( 'Client connection timeout.' );
      this.errorOccurred = true;
    });

    this.client.on( 'error', ( error: any ) => {
      console.error( 'error', JSON.stringify( error ) );
      this.errorOccurred = true;
    });

    let pingTimer: any;
    pingTimer = setInterval( () => {
      if ( this.errorOccurred ) {
        return clearInterval( pingTimer );
      }

      this.client.write( 'PING' );
    }, 10000 );
  }
}

const logger = new DebugServer();

export default logger;
