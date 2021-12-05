const { copyFileSync, constants, mkdirSync } = require('fs');
const path = require('path');
const itod = require('./itod.js');
const { Exif_Image_DateTimeOriginal } = require('./tags.js');

const { args, images } = itod.parseArgv(process.argv);

const destDir = args['dest'] || path.resolve('./output');

mkdirSync(destDir, { recursive: true });

const debug = args['verbose'] || args['d'];

function dbg(msg, ...args) {
  if (debug) {
    console.log(`DBG: ${msg}`, ...args);
  }
}

if (images.length === 0) {
  throw new Error('Missing input image list');
}

const cmds = [];

function makeFnameFromDateTime(dateTime) {
  const [year, month, day, hour, minute, second] = dateTime.split(/[\s:]/);
  dbg('parsed dateTime=%s => year=%s month=%s day=%s hour=%s minute=%s second=%s', year, month, day, hour, minute, second);
  return `iPhone_${year}-${month}-${day}_${hour}-${minute}-${second}`;
}

images.forEach((image) => {
  const { base: baseName, ext } = path.parse(image);
  const exif = itod.getExifData(image);
  const newFileName = `${makeFnameFromDateTime(exif[Exif_Image_DateTimeOriginal])}${ext}`;
  cmds.push({ action: 'copy', source: image, target: path.join(destDir, newFileName) });
});

console.log('Commands:', cmds);

cmds.forEach(({ action, source, target }) => {
  switch (action) {
    case 'copy':
      dbg('Copying file src=%s to dest=%s', source, target);
      // fail if attempting to overwrite an existing file
      copyFileSync(source, target, constants.COPYFILE_EXCL);
      break;
    default:
      dbg('Encountered unexpected action=%s', action);
      throw new Error('Unhandled action');
  }
});
