import diff from 'fast-diff';

const terminalDiff = (a: string, b: string, cursorPosition = 0) => {
  const diffed = diff(a, b);
  const length = diffed.length;
  const commands = [];

  let index = 0;
  for (index; index < length; ++index) {
    const d = diffed[index];
    console.log(d);
  }
};

export default terminalDiff;
