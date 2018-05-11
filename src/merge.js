import { pointEquality, turnDirection, isConvex } from './utils.js';

function rotateRight (arr, n) {
  const length = arr.length;
  return [...arr.slice(length - n), ...arr.slice(0, length - n)];
}

/**
 * Merges two polygons.
 * polygon1 and polygon2 should be convex and share an edge (= two consecutive vertices)
 *
 * @param {{ x: number, y: number, id: number }[]} polygon1
 * @param {{ x: number, y: number, id: number }[]} polygon2
 * @returns {{ x: number, y: number, id: number }[]}
 */
export function mergePolygons (polygon1, polygon2) {
  const sharedVertices = polygon1.map((v1, index) => [index, polygon2.findIndex(v2 => pointEquality(v1, v2))]).filter(([_, v2Index]) => v2Index > -1);
  const polygon1Length = polygon1.length;

  if (sharedVertices.length !== 2) {
    throw new Error('sharedVertices length should be 2 : ' + JSON.stringify(sharedVertices));
  }

  if ((sharedVertices[0][0] + 1) % polygon1Length === sharedVertices[1][0]) {
    return [
      ...rotateRight(polygon1, polygon1Length - sharedVertices[1][0]),
      ...rotateRight(polygon2, polygon2.length - sharedVertices[0][1]).slice(1, -1),
    ];
  } else {
    return [
      ...rotateRight(polygon1, polygon1Length - sharedVertices[0][0]),
      ...rotateRight(polygon2, polygon2.length - sharedVertices[1][1]).slice(1, -1),
    ];
  }
}

/**
 * Procedure to remove inessential diagonals from the partition of convex polygons.
 *
 * @params {{ x: number, y: number, id: number }[][]} polygons
 * @params {{ i2: { x: number, y: number, id: number }, j2: { x: number, y: number, id: number }, rightPolygon: { x: number, y: number, id: number }[][], leftPolygon: { x: number, y: number, id: number }[][] }[]}
 * @returns {{ x: number, y: number, id: number }[][]}
 */
export function mergingAlgorithm (polygons, LLE) {
  if (polygons.length < 2) {
    return polygons;
  }

  // LDP[poly] = true means that the polygon `poly` is one of the definitive polygons of the partition after the merging process.
  const LDP = new Map();
  // LUP[poly1] = poly2 means that the polygon `poly1` is part of the polygon `poly2`.
  const LUP = new Map();
  polygons.forEach((poly) => {
    LDP.set(poly, true);
    LUP.set(poly, poly);
  });

  if (LLE.length + 1 !== polygons.length) {
    throw new Error('wtf ? LLE + 1 !== polygons.length (' + (LLE.length + 1) + ', ' + polygons.length + ')');
  }

  for (let j = 0; j < LLE.length; j++) {
    const { i2, j2, rightPolygon, leftPolygon } = LLE[j];
    const Pj = LUP.get(leftPolygon);
    const Pu = LUP.get(rightPolygon);
    const PjLength = Pj.length;
    const PuLength = Pu.length;

    // custom nextVertex & previousVertex to take into account the originalId (for absHol)
    const i1 = Pu[(Pu.findIndex(v => (v.originalId || v.id) === (i2.originalId || i2.id)) + PuLength - 1) % PuLength]; // previousVertex(i2, Pu);
    const i3 = Pj[(Pj.findIndex(v => (v.originalId || v.id) === (i2.originalId || i2.id)) + 1) % PjLength]; // nextVertex(i2, Pj);
    const j1 = Pj[(Pj.findIndex(v => (v.originalId || v.id) === (j2.originalId || j2.id)) + PjLength - 1) % PjLength]; // previousVertex(j2, Pj)
    const j3 = Pu[(Pu.findIndex(v => (v.originalId || v.id) === (j2.originalId || j2.id)) + 1) % PuLength]; //  nextVertex(j2, Pu);

    if (turnDirection(i1, i2, i3) >= 0 && turnDirection(j1, j2, j3) >= 0) {
      const P = mergePolygons(Pj, Pu);
      if (!isConvex(P)) {
        throw new Error('mergePolygons is not convex !');
      }
      LDP.set(Pj, false);
      LDP.set(Pu, false);
      LDP.set(P, true);

      LUP.set(P, P);
      for (let poly of LUP.keys()) {
        if (LUP.get(poly) === Pj || LUP.get(poly) === Pu) {
          LUP.set(poly, P);
        }
      }
    }
  }

  return [...LDP.entries()].filter(([_, inPartition]) => inPartition).map(([polygon]) => polygon);
}
