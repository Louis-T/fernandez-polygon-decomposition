# fernandez-polygon-decomposition

Library for decomposing polygons with (or without) holes into a partition of convex polygons.

It implements some of the algorithms presented in two publications by [J Fernández](http://www.um.es/geloca/gio/josemain.html) :
* _Algorithms for the decomposition of a polygon into convex polygons_
* _A practical algorithm for decomposing polygonal domains into convex polygons by diagonals_

---

[![Build Status](https://travis-ci.org/Louis-T/fernandez-polygon-decomposition.svg?branch=master)](https://travis-ci.org/Louis-T/fernandez-polygon-decomposition)

## Installation

```
npm install fernandez-polygon-decomposition
```

## Usage

```javascript
const decompose = require('fernandez-polygon-decomposition').default

const polygon = [
    { x: 0, y: 0 }, 
    { x: 100, y: 0 }, 
    { x: 10, y: 20 }, 
    { x: 0, y: 100 }
];

const convexPartition = decompose(polygon);
console.log(convexPartition);
```
