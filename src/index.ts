import logger from './lib/logger';
import keyevents from './lib/keyevents';

import Area from './lib/Area';

const atsea = {
  Area,
  render: (areas: Area | Area[]) => {
    let arrayedAreas: Area[] = [];
    if (Array.isArray(areas)) {
      arrayedAreas = areas;
    } else {
      arrayedAreas = [areas];
    }

    arrayedAreas.forEach((area: Area) => {
      area.render();
    });
  },
};

const port = 4921;
const options = {
  port: 0,
  listen: 0,
};
let mainTest = false;

if (process.argv.indexOf('--debug-listener') > -1) {
  options.listen = port;
} else {
  options.port = port;
  mainTest = true;
}
logger.init(options);

if (mainTest) {
  // keyevents.init();
  const a = new atsea.Area({
    size: {
      width: 5,
      height: 3,
    },
  });

  atsea.render([a]);
}
