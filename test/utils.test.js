import { turnDirection, sideOfLine, isSimple, isConvex, isClockwiseOrdered, isFlat, polygonEquality } from '../src/utils';

expect.extend({
    toHaveTheSameSignAs(received, argument) {
        const pass = Math.sign(received) === Math.sign(argument);
        if (pass) {
          return {
            message: () =>
              `expected ${received} to have a different sign than ${argument}`,
            pass: true,
          };
        } else {
          return {
            message: () => `expected ${received} to have the same sign as ${argument}`,
            pass: false,
          };
        }
      },
});


describe('turnDirection', () => {
    test('it should be > 0 when there is a clockwise turn n°1', () => {
        const point1 = { x: 0, y: 0 };
        const point2 = { x: 100, y: 0 };
        const point3 = { x: 100, y: 100 };
        expect(turnDirection(point1, point2, point3)).toBeGreaterThan(0);
    });

    test('it should be > 0 when there is a clockwise turn n°2', () => {
        const point1 = { x: 0, y: 0 };
        const point2 = { x: 1, y: 0 };
        const point3 = { x: Number.MAX_SAFE_INTEGER, y: Number.EPSILON };
        expect(turnDirection(point1, point2, point3)).toBeGreaterThan(0);
    });

    test('it should be > 0 when there is a clockwise turn n°3', () => {
        const point1 = { x: 0, y: 0 };
        const point2 = { x: 100, y: 0 };
        const point3 = { x: 0, y: Number.EPSILON };
        expect(turnDirection(point1, point2, point3)).toBeGreaterThan(0);
    });

    test('it should be > 0 when there is a clockwise turn n°4', () => {
        const point1 = { x: 0, y: 0 };
        const point2 = { x: Number.EPSILON, y: 0 };
        const point3 = { x: Number.EPSILON, y: Number.EPSILON };
        expect(turnDirection(point1, point2, point3)).toBeGreaterThan(0);
    });

    test('it should be = 0 when the points are collinear', () => {
        const point1 = { x: 0, y: 0 };
        const point2 = { x: 100, y: 0 };
        const point3 = { x: 200, y: 0 };
        expect(turnDirection(point1, point2, point3)).toBe(0);
    });

    test('it should be < 0 when there is a counterclockwise turn n°1', () => {
        const point1 = { x: 0, y: 0 };
        const point2 = { x: 100, y: 0 };
        const point3 = { x: 100, y: -100 };
        expect(turnDirection(point1, point2, point3)).toBeLessThan(0);
    });

    test('it should be < 0 when there is a counterclockwise turn n°2', () => {
        const point1 = { x: 0, y: 0 };
        const point2 = { x: 1, y: 0 };
        const point3 = { x: Number.MAX_SAFE_INTEGER, y: -Number.EPSILON };
        expect(turnDirection(point1, point2, point3)).toBeLessThan(0);
    });

    test('it should be < 0 when there is a counterclockwise turn n°3', () => {
        const point1 = { x: 0, y: 0 };
        const point2 = { x: 100, y: 0 };
        const point3 = { x: 0, y: -Number.EPSILON };
        expect(turnDirection(point1, point2, point3)).toBeLessThan(0);
    });

    test('it should be < 0 when there is a counterclockwise turn n°4', () => {
        const point1 = { x: 0, y: 0 };
        const point2 = { x: Number.EPSILON, y: 0 };
        const point3 = { x: Number.EPSILON, y: -Number.EPSILON };
        expect(turnDirection(point1, point2, point3)).toBeLessThan(0);
    });
});

describe('sideOfLine', () => {
    test('two points on the same side should have the same sign', () => {
        const point1 = { x: 0, y: 10 };
        const point2 = { x: 1, y: 0 };
        const point3 = { x: 2, y: 0 };
        const point4 = { x: 10000, y: 1 };
        expect(sideOfLine(point1, point2, point3)).toHaveTheSameSignAs(sideOfLine(point4, point2, point3));
    });

    test('two points on a different side should have a different sign', () => {
        const point1 = { x: 0, y: 10 };
        const point2 = { x: 1, y: 0 };
        const point3 = { x: 2, y: 0 };
        const point4 = { x: 0,  y: -Number.EPSILON };
        expect(sideOfLine(point1, point2, point3)).not.toHaveTheSameSignAs(sideOfLine(point4, point2, point3));
    });

    test('two points on the line should be 0', () => {
        const point1 = { x: 100000, y: 0 };
        const point2 = { x: 1, y: 0 };
        const point3 = { x: 2, y: 0 };
        const point4 = { x: Number.EPSILON,  y: 0 };
        expect(sideOfLine(point1, point2, point3)).toBe(0);
        expect(sideOfLine(point4, point2, point3)).toBe(0);
    });
});

describe('isConvex', () => {
    test('convex polygon n°1', () => {
        const polygon = [
            { x: 0, y: 0},
            { x: 10, y: -10},
            { x: 20, y: 1},
            { x: 11, y: 9},
            { x: 1, y: 8},
        ];
        expect(isConvex(polygon)).toBe(true);
    });

    test('concave polygon n°1', () => {
        const polygon = [
            { x: 0, y: 0},
            { x: 200, y: 0},
            { x: 200, y: 200},
            { x: 100, y: 200},
            { x: 100, y: 100},
            { x: 0, y: 100},
        ];
        expect(isConvex(polygon)).toBe(false);
    });
});

describe('isSimple', () => {
    test('empty polygon', () => {
        const polygon = [];
        expect(isSimple(polygon)).toBe(true);
    });

    test('point', () => {
        const polygon = [{ x: 0, y: 0 }];
        expect(isSimple(polygon)).toBe(true);
    });

    test('line', () => {
        const polygon = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
        expect(isSimple(polygon)).toBe(true);
    });

    test('simple polygon', () => {
        const polygon = [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 100, y: 100 },
            { x: 0, y: 100 },
        ];
        expect(isSimple(polygon)).toBe(true);
    });

    test('not simple', () => {
        const polygon = [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 0, y: 100 },
            { x: 100, y: 100 },
        ];
        expect(isSimple(polygon)).toBe(false);
    });
});

describe('isClockwiseOrdered', () => {
    test('clockwise ordered n°1', () => {
        const polygon = [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 100, y: 100 },
            { x: 0, y: 100 },
        ];
        expect(isClockwiseOrdered(polygon)).toBe(true);
    });

    test('not clockwise ordered n°1', () => {
        const polygon = [
            { x: 0, y: 0 },
            { x: 0, y: 100 },
            { x: 100, y: 100 },
            { x: 100, y: 0 },
        ];
        expect(isClockwiseOrdered(polygon)).toBe(false);
    });

    test('not clockwise ordered n°2', () => {
        const polygon = [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 0, y: 100 },
            { x: 100, y: 100 },
        ];
        expect(isClockwiseOrdered(polygon)).toBe(false);
    });
});

describe('isFlat', () => {
    test('simple square', () => {
        const polygon = [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 100, y: 100 },
            { x: 0, y: 100 },
        ];
        expect(isFlat(polygon)).toBe(false);
    });

    test('simple square (centered on {0, 0})', () => {
        const polygon = [
            { x: -50, y: -50 },
            { x: 50, y: -50 },
            { x: 50, y: 50 },
            { x: -50, y: 50 },
        ];
        expect(isFlat(polygon)).toBe(false);
    });

    test('simple square', () => {
        const polygon = [
            { x: 0.0000000001, y: 0.0000000001 },
            { x: 100, y: 0.0000000001 },
            { x: 100, y: 100 },
            { x: 0.0000000001, y: 100 },
        ];
        expect(isFlat(polygon)).toBe(false);
    });

    test('flat square', () => {
        const polygon = [
            { x: 0, y: 0 },
            { x: 0, y: 100 },
            { x: 0, y: 100 },
            { x: 0, y: 0 },
        ];
        expect(isFlat(polygon)).toBe(true);
    });

    test('flat shape n°1', () => {
        const polygon = [
            { x: 395.7, y: 507.59999999999997 },
            { x: 395.7, y: 592.1999999999999 },
            { x: 395.7, y: 592.1999999999999 },
            { x: 395.7, y: 253.79999999999998 },
            { x: 395.7, y: 338.40000000000003 },
        ];
        expect(isFlat(polygon)).toBe(true);
    });

    test('flat shape n°2', () => {
        const polygon = [
            { x: 395.7, y: 592.1999999999999 },
            { x: 527.6, y: 592.1999999999999 },
            { x: 791.4, y: 592.1999999999999 },
            { x: 923.3, y: 592.1999999999999 },
            { x: 923.3, y: 592.1999999999999 },
            { x: 395.7, y: 592.1999999999999 },
        ];
        expect(isFlat(polygon)).toBe(true);
    });

    test('flat shape n°3', () => {
        const polygon = [
            { x: 791.4, y: 592.1999999999999 },
            { x: 923.3, y: 592.1999999999999 },
            { x: 923.3, y: 592.1999999999999 },
            { x: 395.7, y: 592.1999999999999 },
        ];
        expect(isFlat(polygon)).toBe(true);
    });

    test('flat shape n°3', () => {
        const polygon = [
            { x: 7.914, y: 5.921999999999999 },
            { x: 9.233, y: 5.921999999999999 },
            { x: 9.233, y: 5.921999999999999 },
            { x: 3.957, y: 5.921999999999999 },
        ];
        expect(isFlat(polygon)).toBe(true);
    });
});