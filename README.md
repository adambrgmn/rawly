# Rawly [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Extract previews from raw-files (with much help from exiv2)

## The problem
You have a large set of RAW-images taken by your super camera. And you want to build a great looking showroom on the great internet :smirk:. But how do you preview those CR2's or NEF's to the people? The browser won't be able to show them. And it's very – and I do mean very – time consuming to go through every picture in Photoshop and extract those previews.

## The solution
Rawly!
With some great help from a NodeJS server and the great package [Exiv2](http://www.exiv2.org/). Rawly can iterate over your images and ”magically” extract those previews for you in quite a simple manner.

## Installation
```sh
$ brew install exiv2
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
    console.log(rawly.previews); // eg. [{ id: 1, type: 'image/jpeg', dimensions: '160x120', size: 11165 }, ...]

    rawly.extractPreviews(1)
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
const rawly = new Rawly('path/to/an/raw-image');
```

### rawly.extractPreviews(id, force)
Extract previews of the image. Returns a Promise resolved to either true if an extraction took place, or false if a preview was already found in the same folder and it skipped extraction.

Id is optional, in that case Rawly will extract all available previews from that specific file.

Force is also optional and defaults to false. If you set it to true it will force an overwrite of existing previews.

```js
rawly.extractPreviews([1, 3], false)
  .then((extracted) => {
    if (extracted) console.log(`Extracted previews for ${rawly.name}.`);
    if (!extracted) console.log(`Skipped extraction for ${rawly.name}.`);
  })
  .catch((err) => {
    console.error('An error occured:');
    console.error(err.message);
  });
```

## Properties
Each instance of Rawly gets some properties attatched to it which might be useful in your program:

```js
const rawly = new Rawly('./images/unicorn.CR2');
console.log(rawly);
// {
//   name: 'unicorn',
//   ext: 'CR2',
//   path: './images',
//   type: 'image/x-canon-cr2',
//   previewsExtracted: false,
//   previews: [
//     { id: 1, type: 'image/jpeg', dimensions: '160x120', size: 11165 },
//     { id: 2, type: 'image/tiff', dimensions: '362x234', size: 508248 },
//     { id: 3, type: 'image/jpeg', dimensions: '5616x3744', size: 1705174 },
//   ],
// };
```

## CLI
There is also a cli tool at your disposal if you wish.

```sh
$ brew install exiv2
$ npm install --global rawly
```

### Usage
```sh
$ cd root/of/image-bank
$ rawly './img/**/*.(CR2|NEF|...)'
```

This will extract all possible previews from every file matching your glob pattern. To specify a single preview to extract you can use the -p-flag (or --previews) together with a keyword:

```sh
$ rawly './img/**/*.(CR2|NEF|...)' -p largest
```

Available keywords are: s, sm, small, smallest, m, md, medium, l, lg, large, largest

You can also force Rawly to extract previews even if previews are already present:

```sh
$ rawly './img/**/*.(CR2|NEF|...)' -p largest -f # or --force
```

You can also print out this help if you might forget how it works:

```sh
$ rawly -h # or --help

  Usage: rawly [options] <glob ...>

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -f, --force             Force overwrite of existing previews
    -p, --previews [value]  Which preview to extract (eg. "smallest" or "largest")

```

## Tests
Tests are run with [Tape](https://github.com/substack/tape).
Clone this repo and run tests:

```sh
$ git clone https://github.com/adambrgmn/rawly
$ cd rawly
$ npm tests
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
