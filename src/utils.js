import robustCompare from 'robust-compare';
import robustCompress from 'robust-compress';
import robustOrientation from 'robust-orientation';
import classifyPoint from 'robust-point-in-polygon';
import robustProduct from 'robust-product';
import robustDiff from 'robust-subtract';

/**
 * Useful to avoid floating point problems.
 */
export const EPSILON = 0.00000001;

let robust = true;
export const setRobustness = (bool) => {
  robust = bool;
};
export const getRobustness = () => robust;

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
 * Checks if the polygon is flat (its area is 0).
 * Using orientation for robustness
 *
 * @param {{{ x: number, y: number, id: number }[]}} polygon
 * @returns {boolean}
 */
export function isFlat (polygon) {
  const polygonLength = polygon.length;
  return polygon.every((point, index) => {
    const previousPoint = polygon[(index - 1 + polygonLength) % polygonLength];
    const nextPoint = polygon[(index + 1) % polygonLength];
    return orientation(previousPoint, point, nextPoint) === 0;
  });
}

/**
 * Check if the polygon vertices are clockwise ordered.
 * Using orientation for robustness
 *
 * @param {{ x: number, y: number}[]} polygon
 * @returns {boolean}
 */
export function isClockwiseOrdered (polygon) {
  if (!isSimple(polygon)) {
    throw new Error('The isClockwiseOrdered method only works with simple polygons');
  }

  const polygonLength = polygon.length;

  // find bottom right vertex
  let bottomRightVertexIndex = 0;
  let bottomRightVertex = polygon[0];
  for (let i = 1; i < polygonLength; i++) {
    const vertex = polygon[i];
    if (vertex.y < bottomRightVertex.y || (vertex.y === bottomRightVertex.y && vertex.x > bottomRightVertex.x)) {
      bottomRightVertex = vertex;
      bottomRightVertexIndex = i;
    }
  }

  return orientation(polygon[(bottomRightVertexIndex - 1 + polygonLength) % polygonLength], bottomRightVertex, polygon[(bottomRightVertexIndex + 1) % polygonLength]) > 0;
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
export function orientation (point1, point2, point3) {
  if (robust) {
    const o = robustOrientation([point1.x, point1.y], [point2.x, point2.y], [point3.x, point3.y]);
    return o === 0 ? o : -o; // the y-axis is inverted
  } else {
    // return -((point1.y - point3.y) * (point2.x - point3.x) - (point1.x - point3.x) * (point2.y - point3.y));
    return (point2.x - point1.x) * (point3.y - point1.y) - (point2.y - point1.y) * (point3.x - point1.x);
  }
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
  return orientation(point2, point3, point1);
}

const VERTEX_CODE = 100;
const EDGE_CODE = 101;

/**
 * Winding number algorithm.
 * See https://en.wikipedia.org/wiki/Point_in_polygon?#Winding_number_algorithm
 * And more specifically http://www.inf.usi.ch/hormann/papers/Hormann.2001.TPI.pdf
 *
 * @param {{ x: number, y: number}} point
 * @param {{ x: number, y: number}[]} polygon
 * @returns {number}
 */
function windingNumber (point, polygon) {
  const polygonPoint = polygon[0];
  if (polygonPoint.x === point.x && polygonPoint.y === point.y) {
    return VERTEX_CODE;
  }

  const polygonLength = polygon.length;
  let wn = 0;
  for (let i = 0; i < polygonLength; i++) {
    const polygonPoint = polygon[i];
    const nextPolygonPoint = polygon[(i + 1) % polygonLength];

    if (nextPolygonPoint.y === point.y) {
      if (nextPolygonPoint.x === point.x) {
        return VERTEX_CODE;
      } else {
        if (polygonPoint.y === point.y && (nextPolygonPoint.x > point.x) === (polygonPoint.x < point.x)) {
          return EDGE_CODE;
        }
      }
    }

    if ((polygonPoint.y < point.y) !== (nextPolygonPoint.y < point.y)) { // crossing
      if (polygonPoint.x >= point.x) {
        if (nextPolygonPoint.x > point.x) {
          // wn += 2 * (nextPolygonPoint.y > polygonPoint.y ? 1 : -1) - 1;
          wn += nextPolygonPoint.y > polygonPoint.y ? 1 : -1;
        } else {
          const det = (polygonPoint.x - point.x) * (nextPolygonPoint.y - point.y) - (nextPolygonPoint.x - point.x) * (polygonPoint.y - point.y);
          if (det === 0) {
            return EDGE_CODE;
          } else if ((det > 0) === (nextPolygonPoint.y > polygonPoint.y)) { // right_crossing
            // wn += 2 * (nextPolygonPoint.y > polygonPoint.y ? 1 : -1) - 1;
            wn += nextPolygonPoint.y > polygonPoint.y ? 1 : -1;
          }
        }
      } else {
        if (nextPolygonPoint.x > point.x) {
          const det = (polygonPoint.x - point.x) * (nextPolygonPoint.y - point.y) - (nextPolygonPoint.x - point.x) * (polygonPoint.y - point.y);
          if (det === 0) {
            return EDGE_CODE;
          } else if ((det > 0) === (nextPolygonPoint.y > polygonPoint.y)) { // right_crossing
            // wn += 2 * (nextPolygonPoint.y > polygonPoint.y ? 1 : -1) - 1;
            wn += nextPolygonPoint.y > polygonPoint.y ? 1 : -1;
          }
        }
      }
    }
  }
  return wn;
}

/**
 * Checks if the point is inside (or on the edge) of the polygon.
 *
 * @param {{ x: number, y: number}} point
 * @param {{ x: number, y: number}[]} polygon
 * @returns {boolean}
 */
export function inPolygon (point, polygon) {
  if (robust) {
    return classifyPoint(polygon.map(({ x, y }) => [x, y]), [point.x, point.y]) <= 0;
  } else {
    return windingNumber(point, polygon) !== 0;
  }
}

/**
 * Checks if the point is inside (or on the edge) of a convex polygon.
 * We assume that the vertices are in clockwise order.
 *
 * @param {{ x: number, y: number}} point
 * @param {{ x: number, y: number}[]} polygon
 * @returns {boolean}
 */
export function inConvexPolygon (point, convexPolygon) {
  const polygonLength = convexPolygon.length;
  return convexPolygon.every((previousPoint, index) => {
    const nextPoint = convexPolygon[(index + 1) % polygonLength];
    return orientation(previousPoint, point, nextPoint) <= 0;
  });
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
  return orientation(polygon[(vertexIndex - 1 + polygonLength) % polygonLength], vertex, polygon[(vertexIndex + 1) % polygonLength]) < 0;
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
    return orientation(polygon[(vertexIndex - 1 + polygonLength) % polygonLength], vertex, polygon[(vertexIndex + 1) % polygonLength]) < 0;
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
    if (orientation(polygon[(notchIndex - 1 + polygonLength) % polygonLength], polygon[notchIndex], polygon[(notchIndex + 1) % polygonLength]) < 0) {
      return polygon[notchIndex];
    }
    notchIndex = (notchIndex + 1) % polygonLength;
  }
  // if we started by the only notch, it will return the notch.
  if (orientation(polygon[(notchIndex - 1 + polygonLength) % polygonLength], polygon[notchIndex], polygon[(notchIndex + 1) % polygonLength]) < 0) {
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
    if (orientation(polygon[(notchIndex - 1 + polygonLength) % polygonLength], polygon[notchIndex], polygon[(notchIndex + 1) % polygonLength]) < 0) {
      return polygon[notchIndex];
    }
    notchIndex = (notchIndex - 1 + polygonLength) % polygonLength;
  }
  // if we started by the only notch, it will return the notch.
  if (orientation(polygon[(notchIndex - 1 + polygonLength) % polygonLength], polygon[notchIndex], polygon[(notchIndex + 1) % polygonLength]) < 0) {
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
    return orientation(polygon[(vertexIndex - 1 + polygonLength) % polygonLength], vertex, polygon[(vertexIndex + 1) % polygonLength]) >= 0;
  });
}

/**
 * Quick hack to convert a non-overlapping increasing sequence into a number.
 *
 * @param {number[]} sequence
 * @returns {number}
 */
function robustSequenceToNumber (sequence) {
  const compressedSequence = robustCompress([...sequence]);
  return compressedSequence[compressedSequence.length - 1];
}

/**
 * See http://paulbourke.net/geometry/pointlineplane/
 * This method performs exact arithmetic calculations (except for the x and y values)
 *
 * @param {{ a: { x: number, y: number }, b: { x: number, y: number }}} line1
 * @param {{ a: { x: number, y: number }, b: { x: number, y: number }}} line2
 * @returns {{ x: number, y: number, insideSegment1: boolean, onEdgeSegment1: boolean, insideSegment2: boolean, onEdgeSegment2: boolean }}
 */
export function robustLineIntersection (line1, line2) {
  const { a: { x: x1, y: y1 }, b: { x: x2, y: y2 } } = line1;
  const { a: { x: x3, y: y3 }, b: { x: x4, y: y4 } } = line2;

  const y4y3 = robustDiff([y4], [y3]);
  const x2x1 = robustDiff([x2], [x1]);
  const x4x3 = robustDiff([x4], [x3]);
  const y2y1 = robustDiff([y2], [y1]);
  const y1y3 = robustDiff([y1], [y3]);
  const x1x3 = robustDiff([x1], [x3]);

  const denom = robustDiff(robustProduct(y4y3, x2x1), robustProduct(x4x3, y2y1));
  const robustDenomComparison = robustCompare(denom, [0]);

  if (robustDenomComparison === 0) {
    return null;
  }

  const ua = robustDiff(robustProduct(x4x3, y1y3), robustProduct(y4y3, x1x3));
  const ub = robustDiff(robustProduct(x2x1, y1y3), robustProduct(y2y1, x1x3));

  let comparisonUaMin, comparisonUaMax, comparisonUbMin, comparisonUbMax;
  if (robustDenomComparison > 0) {
    comparisonUaMin = robustCompare(ua, [0]);
    comparisonUaMax = robustCompare(ua, denom);
    comparisonUbMin = robustCompare(ub, [0]);
    comparisonUbMax = robustCompare(ub, denom);
  } else {
    comparisonUaMin = robustCompare([0], ua);
    comparisonUaMax = robustCompare(denom, ua);
    comparisonUbMin = robustCompare([0], ub);
    comparisonUbMax = robustCompare(denom, ub);
  }

  const nonRobustDenom = robustSequenceToNumber(denom);
  // x and y are not exact numbers, but it is enough for the algo
  return {
    x: x1 + robustSequenceToNumber(robustProduct(ua, x2x1)) / nonRobustDenom,
    y: y1 + robustSequenceToNumber(robustProduct(ua, y2y1)) / nonRobustDenom,
    insideSegment1: comparisonUaMin > 0 && comparisonUaMax < 0,
    onEdgeSegment1: comparisonUaMin === 0 || comparisonUaMax === 0,
    insideSegment2: comparisonUbMin > 0 && comparisonUbMax < 0,
    onEdgeSegment2: comparisonUbMin === 0 || comparisonUbMax === 0,
  };
}

/**
 * See http://paulbourke.net/geometry/pointlineplane/
 *
 * @param {{ a: { x: number, y: number }, b: { x: number, y: number }}} line1
 * @param {{ a: { x: number, y: number }, b: { x: number, y: number }}} line2
 * @returns {{ x: number, y: number, insideSegment1: boolean, onEdgeSegment1: boolean, insideSegment2: boolean, onEdgeSegment2: boolean }}
 */
export function lineIntersection (line1, line2) {
  if (robust) {
    return robustLineIntersection(line1, line2);
  }

  const { a: { x: x1, y: y1 }, b: { x: x2, y: y2 } } = line1;
  const { a: { x: x3, y: y3 }, b: { x: x4, y: y4 } } = line2;

  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (Math.abs(denom) < EPSILON) {
    return null;
  }
  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

  return {
    x: x1 + ua * (x2 - x1),
    y: y1 + ua * (y2 - y1),
    insideSegment1: ua > 0 && ua < 1,
    onEdgeSegment1: ua === 0 || ua === 1,
    insideSegment2: ub > 0 && ub < 1,
    onEdgeSegment2: ub === 0 || ub === 1,
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
  if (polygon.length < 3) {
    return true;
  }

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

      const { insideSegment1, insideSegment2 } = intersection;
      return insideSegment1 && insideSegment2;
    });
  });
}
