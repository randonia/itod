console.log(process.argv);

const [,, ...imgs] = process.argv;

console.log('Image list is %s images long', imgs.length);

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
      args[key] = value;
    } else {
      imgs.push(item);
    }
  });
  return {
    args,
    images: imgs,
  };
}

module.exports = {
  parseArgv,
}
