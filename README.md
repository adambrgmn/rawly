# Rawly [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Extract previews from raw-files (with much help from Exiftools and Sharp)

## The problem
You have a large set of RAW-images taken by your super camera. And you want to build a great looking showroom on the great internet :smirk:. But how do you preview those CR2's or NEF's to the people? The browser won't be able to show them. And it's very – and I do mean very – time consuming to go through every picture in Photoshop and extract those previews.

## The solution
Rawly!
With some great help from a NodeJS and workhorses [Exiftools](http://www.sno.phy.queensu.ca/~phil/exiftool/) and [Sharp](http://sharp.dimens.io/en/stable/). Rawly can iterate over your images and ”magically” extract those previews for you in quite a simple manner.

## Installation
```sh
$ brew install exiftools
$ npm install --save rawly
```

## Usage
Use Rawly to iterate over images in a folder and extract the images in that very same folder.

```js
import glob from 'glob';
import Rawly from 'rawly';
// or if you're old-school: const Rawly = require('rawly').default <-- important to end with default

glob('./images/**/*.(CR2|NEF|...)', (paths) => {
  const rawlys = paths.map((path) => new Rawly(path));
  rawlys.forEach(rawly => {
    rawly.extractPreviews('1200x900', '-preview') // Scale to more reasonable size and append -preview to the end
      .then((extracted) => {
        if (extracted) console.log('Extracted a photo...');
        if (!extracted) console.log('Skipped this one because a preview was already extracted, and you didn\'t force me...');
      })
      .catch((err) => console.log(err.message));
  })
});
```

## Methods
### Rawly(path)
Create a a new instance of Rawly.

```js
const rawly = new Rawly('path/to/a/raw-image');
```

### rawly.extractPreviews([size], [suffix])
Extract previews of the image. Returns a Promise resolved to either true if an extraction took place, or false if a preview was already found in the same folder and it skipped extraction.

If you like you can specify dimensions to scale the preview image to. It will keep aspect ratio and won't crop, so the dimensions might not be exactly as specified.

```js
rawly.extractPreviews('1200x900')
  .then((extracted) => {
    if (extracted) console.log(`Extracted previews for ${this.name}.`);
    if (!extracted) console.log(`Skipped extraction for ${this.name}.`);
  })
  .catch((err) => {
    console.error('An error occured:');
    console.error(err);
  });
```

## Properties
Each instance of Rawly gets some properties attatched to it which might be useful in your program:

```js
const rawly = new Rawly('./images/unicorn.CR2');
console.log(rawly);
// {
//   fullPath: './images/unicorn.CR2',
//   name: 'unicorn',
//   ext: 'CR2',
//   path: './images',
//   previewExtracted: false,
// };
```

## CLI
There is also a cli tool at your disposal if you wish.

```sh
$ brew install exiftools
$ npm install --global rawly
```

### Usage
```sh
$ cd root/of/image-bank
$ rawly './**/*.(CR2|NEF|...)'
```

This will extract all possible previews from every file matching your glob pattern. To specify dimensions, use the -s (or --size) flag:

```sh
$ rawly './**/*.(CR2|NEF|...)' -s 1200x900
```

To append a suffix to your previews use the -e (or --ending) flag:

```sh
$ rawly './**/*.(CR2|NEF|...)' -e 'preview'
```

You can also print out this help if you might forget how it works:

```sh
$ rawly -h # or --help

  Usage: rawly [options] <glob ...>

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -s, --size [size]      Size of extracted preview (eg. "1200x900")
    -e, --ending [suffix]  String to append to end of file name

```

## Tests
Tests are run with [Tape](https://github.com/substack/tape).
Clone this repo and run tests:

```sh
$ git clone https://github.com/adambrgmn/rawly
$ cd rawly
$ npm install
$ npm test
```


## Contribution
Contribution is very welcome. Just open an issue or make a pull-request and we will make things work together.

This package is still in a very early stage and it's not optimal. So if you want som features added, please reach out to me!

## License
MIT © [Adam Bergman](http://fransvilhelm.com)


[npm-image]: https://badge.fury.io/js/rawly.svg
[npm-url]: https://npmjs.org/package/rawly
[daviddm-image]: https://david-dm.org/adambrgmn/rawly.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/adambrgmn/rawly
