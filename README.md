# fernandez-polygon-decomposition

Library for decomposing polygons with (or without) holes into a partition of convex polygons.

It implements some of the algorithms presented in two publications by [J Fernández](http://www.um.es/geloca/gio/josemain.html) :
* _Algorithms for the decomposition of a polygon into convex polygons_
* _A practical algorithm for decomposing polygonal domains into convex polygons by diagonals_

[Launch the demo !](https://louis-t.github.io/fernandez-polygon-decomposition/)
---

[![npm version](https://badge.fury.io/js/fernandez-polygon-decomposition.svg)](https://www.npmjs.com/package/fernandez-polygon-decomposition)
[![Build Status](https://travis-ci.org/Louis-T/fernandez-polygon-decomposition.svg?branch=master)](https://travis-ci.org/Louis-T/fernandez-polygon-decomposition)

## Installation

```
npm install fernandez-polygon-decomposition
``` 
or 
```
yarn add fernandez-polygon-decomposition
```

## Basic usage

The main function of this library is used to decompose a [simple polygon](#issimple) into a partition of convex polygons :

```javascript
const { decompose } = require('fernandez-polygon-decomposition');
// or (if you can use ES2015's import syntax)
import { decompose } from 'fernandez-polygon-decomposition';

const polygon = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 10, y: 20 },
  { x: 0, y: 100 }
];

const convexPartition = decompose(polygon);
console.log(convexPartition);
// [
//   [ 
//     { x: 10, y: 20 },
//     { x: 0, y: 100 },
//     { x: 0, y: 0 }
//   ],
//   [
//     { x: 0, y: 0 },
//     { x: 100, y: 0 },
//     { x: 10, y: 20 }
//   ]
// ]
```
:warning: In order to decompose your polygon, **its vertices have to be in clockwiser order** (relative to the inverted y-axis of the web).

:bulb: But the library exports (along with other methods, see [this section](#other-methods)) some useful functions if you want to change the vertices order of your polygon :

```javascript
const { isClockwiseOrdered, orderClockwise } = require('fernandez-polygon-decomposition');
// or (if you can use ES2015's import syntax)
import { isClockwiseOrdered, orderClockwise } from 'fernandez-polygon-decomposition';

const badPolygon = [
  { x: 0, y: 0 },
  { x: 0, y: 100 },
  { x: 100, y: 100 }, 
  { x: 100, y: 0 }
];

console.log(isClockwiseOrdered(badPolygon));
// false

const goodPolygon = orderClockwise(badPolygon);
console.log(goodPolygon);
// [
//   { x: 100, y: 0 },
//   { x: 100, y: 100 }, 
//   { x: 0, y: 100 },
//   { x: 0, y: 0 }
// ]

console.log(isClockwiseOrdered(goodPolygon));
// true
```

## Advanced usage (arithmetic robustness)

By default, this library uses a set of robust predicates ([more here](https://github.com/mikolalysenko/robust-arithmetic-notes)) that aims to prevent floating point errors.
Hence, this library is able to give correct convex partitions with (almost ?) every inputs.

But these kind of predicates are quite slow (compared to standard javascript operators or methods).

If you can control your inputs (not having coordinates like `{ x: 253.79999999999998, y: 84.60000000000001 }` for example), it is best to disable this feature in order to gain a speed boost (multiple times faster).

You can do so easily : `setRobustness(false);`
Check [here](#setrobustness---getrobustness) for more details about this method.



## Other methods

### isSimple

Checks if the polygon is simple (see https://en.wikipedia.org/wiki/Simple_polygon).
```javascript
const { isSimple } = require('fernandez-polygon-decomposition');
// or (if you can use ES2015's import syntax)
import { isSimple } from 'fernandez-polygon-decomposition';

const polygon = [
  { x: 0, y: 0 }, 
  { x: 100, y: 0 }, 
  { x: 10, y: 20 }, 
  { x: 0, y: 100 }
];

console.log(isSimple(polygon));
// true
```

### isClockwiseOrdered

Indicates if the polygon vertices are in clockwise order (relative to the inverted y-axis of the web, ie : counterclockwise in normal mathematics).

```javascript
const { isClockwiseOrdered } = require('fernandez-polygon-decomposition');
// or (if you can use ES2015's import syntax)
import { isClockwiseOrdered } from 'fernandez-polygon-decomposition';

const badPolygon = [
  { x: 0, y: 0 },
  { x: 0, y: 100 },
  { x: 100, y: 100 }, 
  { x: 100, y: 0 }
];

console.log(isClockwiseOrdered(badPolygon));
// false
```

### orderClockwise

Checks if the vertices of the polygon are in clockwise order, and if they are not, it reverses the order of those vertices.

```javascript
const { orderClockwise } = require('fernandez-polygon-decomposition');
// or (if you can use ES2015's import syntax)
import { orderClockwise } from 'fernandez-polygon-decomposition';

const badPolygon = [
  { x: 0, y: 0 },
  { x: 0, y: 100 },
  { x: 100, y: 100 }, 
  { x: 100, y: 0 }
];

const goodPolygon = orderClockwise(badPolygon);
console.log(goodPolygon);
// [
//   { x: 100, y: 0 },
//   { x: 100, y: 100 }, 
//   { x: 0, y: 100 },
//   { x: 0, y: 0 }
// ]
```

### isConvex

Indicates if the polygon is convex.

```javascript
const { isConvex } = require('fernandez-polygon-decomposition');
// or (if you can use ES2015's import syntax)
import { isConvex } from 'fernandez-polygon-decomposition';

const concavePolygon = [
  { x: 0, y: 0 }, 
  { x: 100, y: 0 }, 
  { x: 10, y: 20 }, 
  { x: 0, y: 100 }
];

const convexPolygon = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 }, 
  { x: 0, y: 100 }
];

console.log(isConvex(concavePolygon));
// false

console.log(isConvex(convexPolygon));
// true
```


### setRobustness - getRobustness

By default, this library uses a set of robust predicates that aims to prevent floating point errors.

But if you work with integers, or controlled inputs (few decimal places), it is best to disable it, in order to increase the speed of the algorithm (multiple times faster).

The use of these predicates can be configured (globally, for all methods) by the method `setRobustness`, and the current robustness state of the library can be accessed by the method `getRobustness`.

```javascript
const { getRobustness, setRobustness } = require('fernandez-polygon-decomposition');
// or (if you can use ES2015's import syntax)
import { getRobustness, setRobustness } from 'fernandez-polygon-decomposition';

console.log(getRobustness());
// true

setRobustness(false);
console.log(getRobustness());
// false

// now, every method of the library will use standard JS operators
```

