const { parseArgv } = require('./itod');

describe('itod', () => {
  describe('#parseArgv', () => {
    let input;
    describe('when parsing no additional parameters', () => {
      beforeEach(() => {
        input = [
          '/home/you/.nvm/versions/node/v14.15.1/bin/node',
          '/home/you/.scripts/itod.js'
        ];
      });
      
      it('should reject the input', () => {
        expect(() => parseArgv(input)).toThrow(/Missing args/);
      });
    });
    
    describe('when parsing one image', () => {
      beforeEach(() => {
        input = [
          '/home/you/.nvm/versions/node/v14.15.1/bin/node',
          '/home/you/.scripts/itod.js',
          '/home/you/Pictures/IMG_1234.JPG',
        ];
      });
      
      it('should return a list of 1 images', () => {
        const result = parseArgv(input);
        expect(result).toHaveProperty('images');
        expect(result.images).toHaveLength(1);
      });
    });

    describe('when parsing a parameter', () => {
      beforeEach(() => {
        input = [
          '/home/you/.nvm/versions/node/v14.15.1/bin/node',
          '/home/you/.scripts/itod.js',
          '--foo=bar',
        ];
      });
      
      it('should return a list of 1 arguments and no images', () => {
        const result = parseArgv(input);
        expect(result).toHaveProperty('args');
        expect(Object.keys(result.args)).toHaveLength(1);
        expect(result.args['foo']).toBe('bar');
        expect(result).toHaveProperty('images');
        expect(result.images).toHaveLength(0);
      });
    });

    describe('when parsing an image and a parameter', () => {
      beforeEach(() => {
        input = [
          '/home/you/.nvm/versions/node/v14.15.1/bin/node',
          '/home/you/.scripts/itod.js',
          '--foo=bar',
          'IMG_1969.jpg',
        ];
      });

      it('should return one arg and a list of 1 images', () => {
        const result = parseArgv(input);
        expect(result).toHaveProperty('args');
        expect(Object.keys(result.args)).toHaveLength(1);
        expect(result).toHaveProperty('images');
        expect(result.images).toHaveLength(1);
      });
    });

    describe('when parsing multiple images and parameters', () => {
      beforeEach(() => {
        input = [
          '/home/you/.nvm/versions/node/v14.15.1/bin/node',
          '/home/you/.scripts/itod.js',
          '--foo=bar',
          'IMG_1969.JPG',
          'IMG_1970.JPG',
          '--baz=qux',
          '--debug=true',
        ];
      });

      it('should return three args and a list of 2 images', () => {
        const result = parseArgv(input);
        expect(result).toHaveProperty('args');
        expect(result.args['foo']).toBe('bar');
        expect(result.args['baz']).toBe('qux');
        expect(result.args['debug']).toStrictEqual('true');
        expect(Object.keys(result.args)).toHaveLength(3);
        expect(result).toHaveProperty('images');
        expect(result.images).toHaveLength(2);
      });
    });
  });

  describe('#generateImgName', () => {
    let imgFile;

    describe('when given an existing image with proper exif data', () => {
      beforeEach(() => {
        imgFile = '/path/to/IMG_0001.JPG';
      });
    });
  });
});
