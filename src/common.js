import { pointEquality } from './utils.js';

export function preprocessPolygon (polygon, offset = 0) {
  const polygonLength = polygon.length;
  return polygon.filter((vertex, index) => {
    return !pointEquality(vertex, polygon[(index + 1) % polygonLength]);
  }).map((vertex, index) => ({ ...vertex, id: index + offset }));
}
