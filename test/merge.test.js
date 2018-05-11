import './polygonMatchers';
import { mergePolygons } from '../src/merge';

describe('mergePolygons', () => {
  test('1', () => {
    const polygon = [
        { x: 0, y: 0, id: 0 },
        { x: 100, y: 0, id: 1 },
        { x: 100, y: 100, id: 2 },
        { x: 0, y: 100, id: 3 },
    ];
    const polygon1 = [
        { x: 0, y: 0, id: 0 },
        { x: 100, y: 0, id: 1 },
        { x: 100, y: 100, id: 2 },
    ];
    const polygon2 = [
        { x: 0, y: 0, id: 0 },
        { x: 100, y: 100, id: 2 },
        { x: 0, y: 100, id: 3 },
    ];
    expect(mergePolygons(polygon1, polygon2)).toBeTheSamePolygonAs(polygon);
  });

  test('2', () => {
    const polygon = [
        { x: 0, y: 0, id: 0 },
        { x: 100, y: 0, id: 1 },
        { x: 100, y: 100, id: 2 },
        { x: 0, y: 100, id: 3 },
    ];
    const polygon1 = [
        { x: 0, y: 0, id: 0 },
        { x: 100, y: 0, id: 1 },
        { x: 100, y: 100, id: 2 },
    ];
    const polygon2 = [
        { x: 100, y: 100, id: 2 },  
        { x: 0, y: 100, id: 3 }, 
        { x: 0, y: 0, id: 0 },
    ];
    expect(mergePolygons(polygon1, polygon2)).toBeTheSamePolygonAs(polygon);
  });

  test('3', () => {
    const polygon = [
        { x: 0, y: 0, id: 0 },
        { x: 100, y: 0, id: 1 },
        { x: 100, y: 100, id: 2 },
        { x: 0, y: 100, id: 3 },
    ];
    const polygon1 = [
        { x: 100, y: 0, id: 1 },
        { x: 100, y: 100, id: 2 },
        { x: 0, y: 0, id: 0 },
    ];
    const polygon2 = [
        { x: 0, y: 0, id: 0 },
        { x: 100, y: 100, id: 2 },
        { x: 0, y: 100, id: 3 },
    ];
    expect(mergePolygons(polygon1, polygon2)).toBeTheSamePolygonAs(polygon);
  });
});