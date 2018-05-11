import { EPSILON, getEdges, containsPolygon, containsEntirePolygon, isClockwiseOrdered, vertexEquality, turnDirection, substractPolygons, inPolygon, squaredDistance, lineIntersection, isFlat } from './utils.js';
import { MP5Procedure } from './mp5.js';
import { mergingAlgorithm, mergePolygons } from './merge.js';
import { preprocessPolygon } from './common.js';

/**
 * Checks if the given segment instersects the polygon
 *
 * @param {{ a: { x: number, y: number }, b: { x: number, y: number }}} segment
 * @param {{ x: number, y: number }[]} polygon
 * @returns {boolean}
 */
const segmentIntersectsPolygon = (segment, polygon) => {
  const polygonLength = polygon.length;
  for (let i = 0; i < polygonLength; i++) {
    const edge = {
      a: polygon[(i - 1 + polygonLength) % polygonLength],
      b: polygon[i],
    };

    const intersection = lineIntersection(segment, edge);
    if (intersection === null) {
      continue;
    }

    const { ua, ub } = intersection;
    if (ua > EPSILON && ub >= 0 && ua < (1 - EPSILON) && ub <= 1) {
      return true;
    } else if (ua === 0 && (ub === 0 || ub === 1)) {
      console.log('beginning of segment on a vertex');
      return true;
    } else if (ua === 1 && (ub === 0 || ub === 1)) {
      console.log('end of segment on a vertex');
      return true;
    } else if (ua >= 0 && ub >= 0 && ua <= 1 && ub <= 1) {
      console.error('whaaaat ?');
    }
  }
  return false;
};

/**
 * Returns all the edges of the given hole that intersects the given segment.
 *
 * @param {{ a: { x: number, y: number }, b: { x: number, y: number }}} segment
 * @param {{ x: number, y: number, id: number }[]} hole
 * @returns {{ x: number, y: number, edge: { a: { x: number, y: number }, b: { x: number, y: number }}, hole: { x: number, y: number, id: number }[] }[]}
 */
const getSegmentHoleIntersectionEdges = (segment, hole) => {
  const edges = [];
  const holeLength = hole.length;
  for (let i = 0; i < holeLength; i++) {
    const edge = {
      a: hole[(i - 1 + holeLength) % holeLength],
      b: hole[i],
    };

    const intersection = lineIntersection(segment, edge);
    if (intersection === null) {
      continue;
    }

    const { x, y, ua, ub } = intersection;
    if (ua > EPSILON && ub >= 0 && ua < (1 - EPSILON) && ub <= 1) {
      edges.push({
        x,
        y,
        edge,
        hole,
      });
    }
  }
  return edges;
};

const rotateLeft = (a, i = 1) => {
  return [...a.slice(i), ...a.slice(0, i)];
};

/**
 * This is the DrawTrueDiagonal procedure taken from "A practical algorithm for decomposing polygonal domains into convex polygons by diagonals"
 *
 * @param {{ a: { x: number, y: number }, b: { x: number, y: number }}} diagonal
 * @param {{ x: number, y: number, id: number }[]} C
 * @param {{ x: number, y: number, id: number }[][]} holesInC
 * @returns {{ a: { x: number, y: number }, b: { x: number, y: number }, hole: { x: number, y: number, id: number }[]}}
 */
const drawTrueDiagonal = (diagonal, C, holesInC) => {
  const comparator = (a, b) => squaredDistance(diagonal.a, a) - squaredDistance(diagonal.a, b);

  let edges = [];
  const holesInCLength = holesInC.length;
  for (let i = 0; i < holesInCLength; i++) {
    edges.push(...getSegmentHoleIntersectionEdges(diagonal, holesInC[i]));
  }

  while (edges.length > 0) {
    const closestEdge = edges.sort(comparator)[0];
    const closestVertex = Object.values(closestEdge.edge).filter(v => inPolygon(v, C)).sort(comparator)[0];
    // is it possible that we have to take another edge ??
    if (closestVertex === undefined) {
      throw new Error('ERROR drawTrueDiagonal');
    }

    diagonal = { a: diagonal.a, b: closestVertex, hole: closestEdge.hole };

    edges = [];
    for (let i = 0; i < holesInCLength; i++) {
      edges.push(...getSegmentHoleIntersectionEdges(diagonal, holesInC[i]));
    }
  }
  return diagonal;
};

/**
 * This is the AbsHol algorithm taken from "A practical algorithm for decomposing polygonal domains into convex polygons by diagonals"
 *
 * @param {{ x: number, y: number, id: number }[]} P
 * @param {{ x: number, y: number, id: number }[][]} holes
 * @param {number} idOffset
 * @returns {{ LPCP: { x: number, y: number, id: number }[][], trueDiagonals: { a: { x: number, y: number, id: number }, b: { x: number, y: number, id: number } }[] , LLE: { i2: { x: number, y: number, id: number }, j2: { x: number, y: number, id: number }, rightPolygon: { x: number, y: number, id: number }[][], leftPolygon: { x: number, y: number, id: number }[][] }[] }} The partition of convex polygons
 */
function absHolProcedure (P, holes, idOffset) {
  const LLE = [];
  const trueDiagonals = [];
  const LPCP = [];

  let Q = [...P];
  while (true) {
    const { convexPolygon: C, end } = MP5Procedure(Q);

    let diagonal = { a: C[0], b: C[C.length - 1], hole: null };

    const holesLength = holes.length;
    let diagonalIsCutByAHole = false;
    const holesInC = [];
    for (let i = 0; i < holesLength; i++) {
      const hole = holes[i];
      if (!diagonalIsCutByAHole && segmentIntersectsPolygon(diagonal, hole)) {
        diagonalIsCutByAHole = true;
        diagonal.hole = hole;
      }
      if (containsPolygon(C, hole)) {
        holesInC.push(hole);
      }
    }

    if (diagonalIsCutByAHole || holesInC.length > 0) {
      if (!diagonalIsCutByAHole) {
        diagonal = { a: C[0], b: holesInC[0][0], hole: holesInC[0] };
      }
      const { hole: HPrime, ...dPrime } = drawTrueDiagonal(diagonal, C, holesInC);
      trueDiagonals.push(dPrime);

      // Absorption of H'
      holes = holes.filter(hole => hole !== HPrime);
      const vi = C[0];
      const id1 = ++idOffset;
      const id2 = ++idOffset;
      const rotatedHPrime = rotateLeft(HPrime, HPrime.findIndex(v => vertexEquality(v, dPrime.b)) + 1).reverse();

      const viIndexInQ = Q.findIndex(v => vertexEquality(v, vi));
      Q = [...Q.slice(0, viIndexInQ + 1), ...rotatedHPrime, { ...rotatedHPrime[0], id: id1, originalId: rotatedHPrime[0].id.originalId || rotatedHPrime[0].id }, { ...vi, id: id2, originalId: vi.originalId || vi.id }, ...Q.slice(viIndexInQ + 1)];
    } else {
      LPCP.push(C);

      getEdges(C).forEach((edge) => {
        for (let i = 0; i < LLE.length; i++) {
          const { i2: diagonalA, j2: diagonalB } = LLE[i];
          if ((diagonalA.originalId || diagonalA.id) === (edge.b.originalId || edge.b.id) &&
                       (diagonalB.originalId || diagonalB.id) === (edge.a.originalId || edge.a.id)) {
            LLE[i].leftPolygon = C;
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
        rightPolygon: C,
      });

      Q = substractPolygons(Q, C);
    }
  }

  return { LPCP, trueDiagonals, LLE };
}

/**
 * An implementation of the algorithm presented in "A practical algorithm for decomposing polygonal domains into convex polygons by diagonals"
 * It will decompose a polygon (with or without holes) in a partition of convex polygons.
 *
 * @param {{ x: number, y: number }[]} polygon
 * @param {{ x: number, y: number }[][]} holes
 * @returns {{ x: number, y: number }[][]} The partition of convex polygons
 */
export function absHol (polygon, holes = []) {
  if (!Array.isArray(polygon)) {
    throw new Error(`absHol can only take an array of points {x, y} as input`);
  }
  if (polygon.length <= 2) {
    return [polygon];
  }
  if (!isClockwiseOrdered(polygon)) {
    throw new Error(`absHol can only work with clockwise ordered vertices`);
  }
  // en mode dev : vérifier que les holes sont bien tous dans polygon
  if (!holes.every(hole => containsEntirePolygon(polygon, hole))) {
    throw new Error('One or more holes are not totally inside the polygon !');
  }

  // Starting the ids at 1 to ensure there are no problem when computing the diagonals (originalId || id)
  const preprocessedPolygon = preprocessPolygon(polygon, 1);
  let offset = preprocessedPolygon.length + 1;

  const preprocessedHoles = holes.map((hole) => {
    const preprocessedHole = preprocessPolygon(hole, offset);
    offset += preprocessedHole.length;
    return preprocessedHole;
  });

  const { LPCP, trueDiagonals, LLE } = absHolProcedure(preprocessedPolygon, preprocessedHoles, offset);

  // Removing "flat" polygons
  let mergedPoly = mergingAlgorithm(LPCP, LLE).filter((poly) => !isFlat(poly));

  // Merging the inessentials true diagonals
  trueDiagonals.forEach(({ a: i2, b: j2 }) => {
    let Pj, Pu, i1, i3, j1, j3;

    for (let i = 0; i < mergedPoly.length; i++) {
      const poly = mergedPoly[i];
      const polyLength = poly.length;
      const edges = getEdges(poly);
      for (let j = 0; j < edges.length; j++) {
        const { a: edgeA, b: edgeB } = edges[j];
        // TODO : ici je pense qu'on peut passer previous/nextVertex, a verifier
        if ((i2.originalId || i2.id) === (edgeA.originalId || edgeA.id) &&
            (j2.originalId || j2.id) === (edgeB.originalId || edgeB.id)) {
          i1 = poly[(poly.findIndex(v => (v.originalId || v.id) === (edgeA.originalId || edgeA.id)) + polyLength - 1) % polyLength]; // previousVertex(edgeA, poly);
          j3 = poly[(poly.findIndex(v => (v.originalId || v.id) === (edgeB.originalId || edgeB.id)) + 1) % polyLength]; // nextVertex(edgeB, poly);
          Pu = poly;
          break;
        } else if ((i2.originalId || i2.id) === (edgeB.originalId || edgeB.id) &&
                   (j2.originalId || j2.id) === (edgeA.originalId || edgeA.id)) {
          i3 = poly[(poly.findIndex(v => (v.originalId || v.id) === (edgeB.originalId || edgeB.id)) + 1) % polyLength]; // nextVertex(edgeB, poly);
          j1 = poly[(poly.findIndex(v => (v.originalId || v.id) === (edgeA.originalId || edgeA.id)) + polyLength - 1) % polyLength]; // previousVertex(edgeA, poly);
          Pj = poly;
          break;
        }
      }

      if (Pu && Pj) {
        if (turnDirection(i1, i2, i3) >= 0 && turnDirection(j1, j2, j3) >= 0) {
          mergedPoly = mergedPoly.filter(poly => (poly !== Pu && poly !== Pj)).concat([mergePolygons(Pj, Pu)]);
        }
        break;
      }
    }
  });

  return mergedPoly.map((poly) => poly.map(({ x, y }) => ({ x, y })));
}
