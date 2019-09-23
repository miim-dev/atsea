import { Color } from './Style';

export interface AreaOptions {
  size?: AreaSize;
  background?: Color;
}

export interface AreaSize {
  width?: number | string;
  height?: number | string;
}

export interface AreaRealSize {
  cols: number;
  rows: number;
}

class Area {
  private options: AreaOptions;
  private size: AreaSize = {
    width: 0,
    height: 0,
  };
  private realSize: AreaRealSize;

  constructor(options: AreaOptions) {
    this.options = options;
    this.size = options.size || this.size;
  }

  calculateRealSize() {
    this.realSize = {
      cols: this.size.width as number,
      rows: this.size.height as number,
    };
  }

  render() {
    this.calculateRealSize();

    for (let y = 0; y < this.realSize.rows; y += 1) {
      for (let x = 0; x < this.realSize.cols; x += 1) {
        process.stdout.write('x');
      }

      if (y < this.realSize.rows - 1) {
        process.stdout.write('\n');
      }
    }
  }
}

export default Area;
