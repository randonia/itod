const { execSync } = require('child_process');
const path = require('path');

/**
  * Gets EXIF data from the given file, keyed by tag ID
  * @param {string} Absolute file path to image to process
  */
function getExifData(target) {
  const linesRaw = execSync(`exif "${target}" -m -i`).toString();
  const lines = linesRaw.split('\n').filter(line => line.trim().length);
  return lines.map(line => line.split('\t'))
    .reduce((acc, [key, value]) => {
      acc[Number.parseInt(key)] = value;
      return acc;
    }, {});
}

/**
 * @param {string[]} input Input array representing `process.argv`
 */
function parseArgv(input) {
  const [,, ...rest] = input;
  if (!rest.length) {
    throw new Error('Missing args');
  }
  const args = {};
  const imgs = []
  rest.forEach((item) => {
    if (item.startsWith('--')) {
      const [key, value] = item.substr(2).split('=');
      if (args[key] !== undefined) {
        throw new Error('Duplicate parameters');
      }
      // Support for single bool values like --verbose
      args[key] = value ?? true;
    } else {
      if (item.includes('~')) {
        throw new Error('Invalid image path');
      }
      imgs.push(path.resolve(item));
    }
  });
  return {
    args,
    images: imgs,
  };
}

module.exports = {
  getExifData,
  parseArgv,
};
