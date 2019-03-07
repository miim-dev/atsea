const bootstrap = ( stdout : any, height : number ) => {
  stdout.write( '\n'.repeat( height ) );
};

const atsea = ( options : any ) => {
  const opts = {
    stdout: process.stdout,
    stderr: process.stderr,
    height: 1,
    ...options,
  };

  bootstrap( opts.stdout, opts.height );
};

export default atsea;
