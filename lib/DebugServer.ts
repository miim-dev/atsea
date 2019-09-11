import kleur from 'kleur';
import net from 'net';

interface DebugServerOptions {
  port?: number;
  listen?: number;
}

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

  constructor( options: DebugServerOptions ) {
    super();

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
    } ) );
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
      console.log( data );
    });

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

export default DebugServer;
