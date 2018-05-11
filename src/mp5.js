import { getEdges, vertexEquality, nextNotch, previousNotch, substractPolygons, getNotches, isClockwiseOrdered } from './utils.js';
import { MP1, MP1Prime } from './mp1.js';
import { mergingAlgorithm } from './merge.js';
import { preprocessPolygon } from './common.js';

/**
 * This is the MP5 procedure taken from "A practical algorithm for decomposing polygonal domains into convex polygons by diagonals"
 *
 * @param {{ x: number, y: number, id: number }[]} polygon
 * @param {{ x: number, y: number, id: number }} startingVertex
 * @returns {{ L: { x: number, y: number, id: number }[], end: boolean }}
 */
export function MP5Procedure (polygon, startingVertex = polygon[0]) {
  if (polygon.length < 4) {
    return {
      convexPolygon: [...polygon],
      end: true,
    };
  }

  const startingNotch = nextNotch(startingVertex, polygon);
  if (startingNotch === null) { // the polygon is convex if there is no notch in it
    return {
      convexPolygon: [...polygon],
      end: true,
    };
  }
  let currentNotch = startingNotch;

  do {
    const { L: cwL, end: cwEnd } = MP1(polygon, [currentNotch]);
    if (cwEnd) {
      return {
        convexPolygon: cwL,
        end: true,
      };
    }
    // MP1 + notch checking = MP3
    if (cwL.length > 2 && getNotches(polygon).some(vertex => vertexEquality(vertex, cwL[0]) || vertexEquality(vertex, cwL[cwL.length - 1]))) {
      return {
        convexPolygon: cwL,
        end: false,
      };
    }

    currentNotch = nextNotch(currentNotch, polygon);
  } while (!vertexEquality(currentNotch, startingNotch));

  currentNotch = startingNotch;

  do {
    const { L: ccwL, end: ccwEnd } = MP1Prime(polygon, [currentNotch]);
    if (ccwEnd) {
      return {
        convexPolygon: ccwL,
        end: true,
      };
    }
    // MP1 + notch checking = MP3
    if (ccwL.length > 2 && getNotches(polygon).some(vertex => vertexEquality(vertex, ccwL[0]) || vertexEquality(vertex, ccwL[ccwL.length - 1]))) {
      return {
        convexPolygon: ccwL,
        end: false,
      };
    }

    currentNotch = previousNotch(currentNotch, polygon);
  } while (!vertexEquality(currentNotch, startingNotch));

  throw new Error('ERROR MP5Procedure 3');
}

/**
 * This is the full MP5 algorithm taken from "A practical algorithm for decomposing polygonal domains into convex polygons by diagonals"
 *
 * @param {{ x: number, y: number }[]} polygon
 * @returns {{ x: number, y: number }[][]} The partition of convex polygons
 */
export function MP5 (polygon) {
  if (!Array.isArray(polygon)) {
    throw new Error(`MP5 can only take an array of points {x, y} as input`);
  }
  if (polygon.length <= 2) {
    return [polygon];
  }
  if (!isClockwiseOrdered(polygon)) {
    throw new Error(`MP5 can only work with clockwise ordered polygon`);
  }

  // L is containing the convex polygons.
  const L = [];
  // LLE is a list containing the diagonals of the partition. It will be used to merge inessential diagonals.
  const LLE = [];

  // Adds an id to each vertex.
  let P = preprocessPolygon(polygon);
  while (true) {
    const { convexPolygon, end } = MP5Procedure(P);
    const diagonal = { a: convexPolygon[0], b: convexPolygon[convexPolygon.length - 1] };

    L.push(convexPolygon);

    getEdges(convexPolygon).forEach((edge) => {
      for (let i = 0; i < LLE.length; i++) {
        const { i2, j2 } = LLE[i];
        if (vertexEquality(i2, edge.b) && vertexEquality(j2, edge.a)) {
          LLE[i].leftPolygon = convexPolygon;
          break;
        }
      }
    });

    if (end) {
      break;
    }

    LLE.push({
      i2: diagonal.b,
      j2: diagonal.a,
      rightPolygon: convexPolygon,
    });

    P = substractPolygons(P, convexPolygon);
  }

  return mergingAlgorithm(L, LLE).map((poly) => poly.map(({ x, y }) => ({ x, y })));
}
