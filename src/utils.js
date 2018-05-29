import classifyPoint from 'robust-point-in-polygon';

/**
 * Useful to avoid floating point problems.
 * May change in the future (maybe something greater than Number.EPSILON ?)
 */
export const EPSILON = Number.EPSILON;

/**
 * Compares two vertices of the same polygon. Both of the vertex must be defined by an unique id.
 *
 * @param {{ x: number, y: number, id: number }} vertex1
 * @param {{ x: number, y: number, id: number }} vertex2
 * @returns {boolean}
 */
export function vertexEquality (vertex1, vertex2) {
  if (vertex1.id === undefined || vertex2.id === undefined) {
    throw new Error('A vertex must be defined by an unique id.');
  }
  return vertex1.id === vertex2.id;
}

/**
 * @param {{ x: number, y: number }} point1
 * @param {{ x: number, y: number }} point2
 * @returns {boolean}
 */
export function pointEquality (point1, point2) {
  return point1.x === point2.x && point1.y === point2.y;
}

/**
 * @param {{ x: number, y: number }} point1
 * @param {{ x: number, y: number }} point2
 * @returns {number}
 */
export function squaredDistance (point1, point2) {
  return (point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y);
}

/**
 * See https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order.
 * The sum is negative when clockwise ordered because we are on the web (y is inversed)
 *
 * @param {{ x: number, y: number}[]} polygon
 * @returns {boolean}
 */
export function isClockwiseOrdered (polygon) {
  const polygonLength = polygon.length;
  let sum = 0;
  for (let i = 0; i < polygonLength; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygonLength];
    sum += (b.x - a.x) * (b.y + a.y);
  }
  return sum < 0;
}

/**
 * This method always returns a new array
 *
 * @param {{ x: number, y: number}[]} polygon
 * @returns {{ x: number, y: number}[]}
 */
export function orderClockwise (polygon) {
  if (!isClockwiseOrdered(polygon)) {
    return [...polygon].reverse();
  }
  return [...polygon];
}

/**
 * See https://stackoverflow.com/questions/38856588/given-three-coordinate-points-how-do-you-detect-when-the-angle-between-them-cro.
 * The three points are in clockwise order.
 * If the result if positive, then it is a clockwise turn, if it is negative, a ccw one.
 * If the result is 0, the points are collinear.
 *
 * @param {{ x: number, y: number}} point1
 * @param {{ x: number, y: number}} point2
 * @param {{ x: number, y: number}} point3
 * @returns {number}
 */
export function turnDirection (point1, point2, point3) {
  return (point2.x - point1.x) * (point3.y - point1.y) - (point2.y - point1.y) * (point3.x - point1.x);
}

/**
 * Checks on which side of the line (point2, point3) the point point1 is.
 *
 * @param {{ x: number, y: number}} point1
 * @param {{ x: number, y: number}} point2
 * @param {{ x: number, y: number}} point3
 * @returns {number}
 */
export function sideOfLine (point1, point2, point3) {
  return (point1.x - point3.x) * (point2.y - point3.y) - (point2.x - point3.x) * (point1.y - point3.y);
}

/*

function inPoly1 (point, polygon) {
  const { x, y } = point;
  var inside = false;
  for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;

      console.log(x, (xj - xi) * (y - yi) / (yj - yi) + xi)

      if( ((yi > y) != (yj > y)) &&
          (x < (xj - xi) * (y - yi) / (yj - yi) + xi) ) {
          inside = !inside;
      }
  }
  return inside;
}

function inPoly2 (point, polygon) {
  let isInside = false;
  let minX = polygon[0].x, maxX = polygon[0].x;
  let minY = polygon[0].y, maxY = polygon[0].y;
  for (let n = 1; n < polygon.length; n++) {
    const q = polygon[n];
    minX = Math.min(q.x, minX);
    maxX = Math.max(q.x, maxX);
    minY = Math.min(q.y, minY);
    maxY = Math.max(q.y, maxY);
  }

  if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
    return false;
  }

  let i = 0, j = polygon.length - 1;
  for (i, j; i < polygon.length; j = i++) {
    if ((polygon[i].y > point.y) != (polygon[j].y > point.y) &&
        (point.x <= (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
      isInside = !isInside;
    }
  }

  return isInside;
}

*/

/**
 * Checks if the point is inside (or on the edge) of the polygon.
 *
 * @param {{ x: number, y: number}} point
 * @param {{ x: number, y: number}[]} polygon
 * @returns {boolean}
 */
export function inPolygon (point, polygon) {
  return classifyPoint(polygon.map(({ x, y }) => [x, y]), [point.x, point.y]) <= 0;
}

/**
 * Check if the polygon polygon2 is (at least partially) contained by the polygon polygon1.
 *
 * @param {{ x: number, y: number, id: number }[]} polygon1
 * @param {{ x: number, y: number, id: number }[]} polygon2
 * @returns {boolean}
 */
export function containsPolygon (polygon1, polygon2) {
  return polygon2.some(vertex => inPolygon(vertex, polygon1));
};

/**
 * Check if the polygon polygon2 is totally contained by the polygon polygon1.
 *
 * @param {{ x: number, y: number, id: number }[]} polygon1
 * @param {{ x: number, y: number, id: number }[]} polygon2
 * @returns {boolean}
 */
export function containsEntirePolygon (polygon1, polygon2) {
  return polygon2.every(vertex => inPolygon(vertex, polygon1));
};

/**
 * Given a vertex of one polygon, returns the next vertex (in clockwise order) of this polygon.
 *
 * @param {{ x: number, y: number, id: number }} vertex
 * @param {{ x: number, y: number, id: number }[]} polygon
 * @returns {{ x: number, y: number, id: number }}
 */
export function nextVertex (vertex, polygon) {
  const polygonLength = polygon.length;
  const vertexIndex = polygon.findIndex(v => vertexEquality(vertex, v));
  if (vertexIndex === -1) {
    throw new Error('could not find vertex');
  }
  return polygon[(vertexIndex + 1) % polygonLength];
}

/**
 * Given a vertex of one polygon, returns the previous vertex (in clockwise order) of this polygon.
 *
 * @param {{ x: number, y: number, id: number }} vertex
 * @param {{ x: number, y: number, id: number }[]} polygon
 * @returns {{ x: number, y: number, id: number }}
 */
export function previousVertex (vertex, polygon) {
  const polygonLength = polygon.length;
  const vertexIndex = polygon.findIndex(v => vertexEquality(vertex, v));
  if (vertexIndex === -1) {
    throw new Error('could not find vertex');
  }
  return polygon[(vertexIndex - 1 + polygonLength) % polygonLength];
}

/**
 * Checks if a point is one of the vertex of a polygon.
 *
 * @param {{ x: number, y: number }} point
 * @param {{ x: number, y: number, id: number }[]} polygon
 * @returns {boolean}
 */
export function isAVertex (point, polygon) {
  return polygon.some(v => pointEquality(v, point));
}

/**
 * Checks if a point is a notch of a polygon.
 * The vertices of a polygon displaying a reflex angle, that is, greater than 180° are called notches.
 *
 * @param {{ x: number, y: number }} vertex
 * @param {{ x: number, y: number, id: number }[]} polygon
 * @returns {boolean}
 */
export function isANotch (vertex, polygon) {
  const polygonLength = polygon.length;
  const vertexIndex = polygon.findIndex(v => vertexEquality(vertex, v));
  return turnDirection(polygon[(vertexIndex - 1 + polygonLength) % polygonLength], vertex, polygon[(vertexIndex + 1) % polygonLength]) < 0;
}

/**
 * Returns all the notches of a given polygon.
 *
 * @param {{ x: number, y: number, id: number }[]} polygon
 * @returns {{ x: number, y: number, id: number }[]}
 */
export function getNotches (polygon) {
  const polygonLength = polygon.length;
  return polygon.filter((vertex, vertexIndex) => {
    return turnDirection(polygon[(vertexIndex - 1 + polygonLength) % polygonLength], vertex, polygon[(vertexIndex + 1) % polygonLength]) < 0;
  });
}

/**
 * Returns all the edges of a given polygon.
 * An edge is one segment between two consecutive vertex of the polygon.
 *
 * @param {{ x: number, y: number, id: number }[]} polygon
 * @returns {{ a: { x: number, y: number, id: number }, b: { x: number, y: number, id: number }}[]}
 */
export function getEdges (polygon) {
  const edges = [];
  const polygonLength = polygon.length;
  for (let i = 0; i < polygonLength; i++) {
    edges.push({
      a: polygon[i],
      b: polygon[(i + 1) % polygonLength],
    });
  }
  return edges;
};

/**
 * Given a vertex of one polygon, returns the next notch (in clockwise order) of this polygon.
 * Returns null if there are no notch in the polygon.
 *
 * @param {{ x: number, y: number, id: number }} vertex
 * @param {{ x: number, y: number, id: number }[]} polygon
 * @returns {({ x: number, y: number, id: number }|null)}
 */
export function nextNotch (vertex, polygon) {
  const polygonLength = polygon.length;
  const vertexIndex = polygon.findIndex(v => vertexEquality(vertex, v));
  let notchIndex = (vertexIndex + 1) % polygonLength;
  while (notchIndex !== vertexIndex) {
    if (turnDirection(polygon[(notchIndex - 1 + polygonLength) % polygonLength], polygon[notchIndex], polygon[(notchIndex + 1) % polygonLength]) < 0) {
      return polygon[notchIndex];
    }
    notchIndex = (notchIndex + 1) % polygonLength;
  }
  // if we started by the only notch, it will return the notch.
  if (turnDirection(polygon[(notchIndex - 1 + polygonLength) % polygonLength], polygon[notchIndex], polygon[(notchIndex + 1) % polygonLength]) < 0) {
    return polygon[notchIndex];
  }
  return null;
}

/**
 * Given a vertex of one polygon, returns the previous notch (in clockwise order) of this polygon.
 * Returns null if there are no notch in the polygon.
 *
 * @param {{ x: number, y: number, id: number }} vertex
 * @param {{ x: number, y: number, id: number }[]} polygon
 * @returns {({ x: number, y: number, id: number }|null)}
 */
export function previousNotch (vertex, polygon) {
  const polygonLength = polygon.length;
  const vertexIndex = polygon.findIndex(v => vertexEquality(vertex, v));
  let notchIndex = (vertexIndex - 1 + polygonLength) % polygonLength;
  while (notchIndex !== vertexIndex) {
    if (turnDirection(polygon[(notchIndex - 1 + polygonLength) % polygonLength], polygon[notchIndex], polygon[(notchIndex + 1) % polygonLength]) < 0) {
      return polygon[notchIndex];
    }
    notchIndex = (notchIndex - 1 + polygonLength) % polygonLength;
  }
  // if we started by the only notch, it will return the notch.
  if (turnDirection(polygon[(notchIndex - 1 + polygonLength) % polygonLength], polygon[notchIndex], polygon[(notchIndex + 1) % polygonLength]) < 0) {
    return polygon[notchIndex];
  }
  return null;
}

/**
 * Removes polygon2 from polygon1.
 * polygon2 vertices must be a subset of polygon1 vertices
 *
 * @param {{ x: number, y: number, id: number }[]} polygon1
 * @param {{ x: number, y: number, id: number }[]} polygon2
 * @returns {{ x: number, y: number, id: number }[]}
 */
export function substractPolygons (polygon1, polygon2) {
  // const firstIndex = polygon1.findIndex(p => pointEquality(p, polygon2[0]));
  // const lastIndex = polygon1.findIndex(p => pointEquality(p, polygon2[polygon2.length - 1]));
  const firstIndex = polygon1.findIndex(p => vertexEquality(p, polygon2[0]));
  const lastIndex = polygon1.findIndex(p => vertexEquality(p, polygon2[polygon2.length - 1]));
  if (firstIndex < lastIndex) {
    return [...polygon1.slice(0, firstIndex), polygon1[firstIndex], ...polygon1.slice(lastIndex)];
  } else {
    return [...polygon1.slice(lastIndex, firstIndex + 1)];
  }
}

/**
 * @param {{{ x: number, y: number, id: number }[]}} polygon
 * @return {boolean}
 */
export function isConvex (polygon) {
  const polygonLength = polygon.length;
  return polygon.every((vertex, vertexIndex) => {
    return turnDirection(polygon[(vertexIndex - 1 + polygonLength) % polygonLength], vertex, polygon[(vertexIndex + 1) % polygonLength]) >= 0;
  });
}

/**
 * See http://paulbourke.net/geometry/pointlineplane/
 *
 * @param {{ a: { x: number, y: number }, b: { x: number, y: number }}} line1
 * @param {{ a: { x: number, y: number }, b: { x: number, y: number }}} line2
 * @returns {{ x: number, y: number, ua: number, ub: number }}
 */
export function lineIntersection (line1, line2) {
  const { a: { x: x1, y: y1 }, b: { x: x2, y: y2 } } = line1;
  const { a: { x: x3, y: y3 }, b: { x: x4, y: y4 } } = line2;

  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (Math.abs(denom) < 0.000001) {
    return null;
  }
  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  return {
    x: x1 + ua * (x2 - x1),
    y: y1 + ua * (y2 - y1),
    ua, // in segment1 : ua >= 0 && ua <= 1
    ub, // in segment2 : ub >= 0 && ub <= 1
  };
};

/**
 * Checks if the polygon is simple.
 * See https://en.wikipedia.org/wiki/Simple_polygon
 *
 * @param {{ x: number, y: number, id: number }[]} polygon
 * @returns {boolean}
 */
export function isSimple (polygon) {
  const segments = [];
  for (let i = 0; i < polygon.length - 1; i++) {
    segments.push({
      a: polygon[i],
      b: polygon[i + 1],
    });
  }
  segments.push({
    a: polygon[polygon.length - 1],
    b: polygon[0],
  });
  return !segments.some((segment1) => {
    return segments.some((segment2) => {
      if (segment1 === segment2) {
        return false;
      }

      const intersection = lineIntersection(segment1, segment2);
      if (intersection === null) {
        return false;
      }

      const { ua, ub } = intersection;
      return ua > 0 && ua < 1 && ub > 0 && ub < 1;
    });
  });
}

/**
 * Checks if the polygon is flat (its area is 0).
 * See https://en.wikipedia.org/wiki/Shoelace_formula
 *
 * @param {{{ x: number, y: number, id: number }[]}} polygon
 * @returns {boolean}
 */
export function isFlat (polygon) {
  const polygonLength = polygon.length;
  return Math.abs(polygon.reduce((sum, { x, y }, index) => {
    const { x: nextX, y: nextY } = polygon[(index + 1) % polygonLength];
    sum += x * nextY - y * nextX;
    return sum;
  }, 0)) < 0.000001;
}
