import { previousVertex, nextVertex, turnDirection, isAVertex, substractPolygons, sideOfLine, getNotches, inPolygon } from './utils.js';

// P is a polygon (vertices are clockwise ordered)
/**
 * This is the MP1 procedure taken from "Algorithms for the decomposition of a polygon into convex polygons" by J. Fernandez et al.
 * The variable names (for the most part) are named according to the publication.
 *
 * @param {{ x: number, y: number, id: number }[]} P P is a polygon with clockwise ordered vertices.
 * @param {{ x: number, y: number, id: number }[]} initialLVertices The initial vertices for the polygon L
 * @returns {{ L: { x: number, y: number, id: number }[], end: boolean }}
 */
export function MP1 (P, initialLVertices) {
  if (P.length < 4) {
    return { L: [...P], end: true };
  }

  let L = [...initialLVertices];
  if (L.length < 1) {
    L.push(P[0]);
  }
  if (L.length < 2) {
    L.push(nextVertex(L[0], P));
  }

  const v1 = L[0];
  const v2 = L[1];
  let vim1 = v1;
  let vi = v2;
  let vip1 = nextVertex(vi, P);
  while (L.length < P.length) {
    if (turnDirection(vim1, vi, vip1) >= 0 && turnDirection(vi, vip1, v1) >= 0 && turnDirection(vip1, v1, v2) >= 0) {
      L.push(vip1);
    } else {
      break;
    }
    vim1 = vi;
    vi = vip1;
    vip1 = nextVertex(vi, P);
  }

  if (P.length === L.length) {
    return { L, end: true };
  } else if (L.length < 2) {
    return { L, end: true };
  } else {
    while (L.length > 2) {
      const PmL = substractPolygons(P, L);
      // filter on L's bounding rectangle first ?
      const notches = getNotches(PmL).filter(point => !isAVertex(point, L)).filter(point => inPolygon(point, L));
      if (notches.length === 0) {
        break;
      }
      const v1 = L[0];
      const k = L.length;
      const vk = L[k - 1];

      L = L.slice(0, -1); // L.filter(point => !vertexEquality(point, vk));
      notches.forEach((notch) => {
        const sideOfVk = Math.sign(sideOfLine(vk, v1, notch));
        if (sideOfVk !== 0) {
          L = L.filter(point => Math.sign(sideOfLine(point, v1, notch)) !== sideOfVk);
        }
      });
    }
    return { L, end: false };
  }
}

/**
 * This is the MP1' procedure taken from "Algorithms for the decomposition of a polygon into convex polygons" by J. Fernandez et al.
 * The variable names (for the most part) are named according to the publication.
 *
 * @param {{ x: number, y: number, id: number }[]} P P is a polygon with clockwise ordered vertices.
 * @param {{ x: number, y: number, id: number }[]} initialLVertices The initial vertices for the polygon L
 * @returns {{ L: { x: number, y: number, id: number }[], end: boolean }}
 */
export function MP1Prime (P, initialLVertices) {
  if (P.length < 4) {
    return { L: [...P], end: true };
  }

  let L = [...initialLVertices];
  if (L.length < 1) {
    L.unshift(P[0]);
  }
  if (L.length < 2) {
    L.unshift(previousVertex(L[0], P));
  }

  const vk = L[L.length - 1];
  const vkm1 = L[L.length - 2];
  let vim1 = L[1];
  let vi = L[0];
  let vip1 = previousVertex(vi, P);
  while (L.length < P.length) {
    if (turnDirection(vim1, vi, vip1) <= 0 && turnDirection(vi, vip1, vk) <= 0 && turnDirection(vip1, vk, vkm1) <= 0) {
      L.unshift(vip1);
    } else {
      break;
    }
    vim1 = vi;
    vi = vip1;
    vip1 = previousVertex(vi, P);
  }

  if (P.length === L.length) {
    return { L, end: true };
  } else if (L.length < 2) {
    return { L, end: true };
  } else {
    while (L.length > 2) {
      const PmL = substractPolygons(P, L);
      const notches = getNotches(PmL).filter(point => !isAVertex(point, L)).filter(point => inPolygon(point, L));
      if (notches.length === 0) {
        break;
      }

      // CCW order
      const v1 = L[L.length - 1];
      const vk = L[0];

      L = L.slice(1); // L.filter(point => !vertexEquality(point, vk));
      notches.forEach((notch) => {
        const sideOfVk = Math.sign(sideOfLine(vk, v1, notch));
        if (sideOfVk !== 0) {
          L = L.filter(point => Math.sign(sideOfLine(point, v1, notch)) !== sideOfVk);
        }
      });
    }
    return { L, end: false };
  }
}
