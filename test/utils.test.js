import { orientation, sideOfLine, isSimple, isConvex, isClockwiseOrdered, isFlat, inPolygon, inConvexPolygon, polygonEquality, setRobustness, getRobustness } from '../src/utils';

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
    toBeZero(received) {
        const pass = received === 0;
        if (pass) {
          return {
            message: () =>
              `expected ${received} to be different than 0 or -0`,
            pass: true,
          };
        } else {
          return {
            message: () => `expected ${received} to be 0 or -0`,
            pass: false,
          };
        }
    }  
});

const EPSILON = 0.00000001;

describe.each([[false], [true]])('Robust: %s', (robustness) => {
    beforeAll(() => {
        setRobustness(robustness);
    });

    describe('orientation', () => {
        test('it should be > 0 when there is a clockwise turn n°1', () => {
            const point1 = { x: 0, y: 0 };
            const point2 = { x: 100, y: 0 };
            const point3 = { x: 100, y: 100 };
            expect(orientation(point1, point2, point3)).toBeGreaterThan(0);
        });
    
        test('it should be > 0 when there is a clockwise turn n°2', () => {
            const point1 = { x: 0, y: 0 };
            const point2 = { x: 1, y: 0 };
            const point3 = { x: Number.MAX_SAFE_INTEGER, y: Number.EPSILON };
            expect(orientation(point1, point2, point3)).toBeGreaterThan(0);
        });
    
        test('it should be > 0 when there is a clockwise turn n°3', () => {
            const point1 = { x: 0, y: 0 };
            const point2 = { x: 100, y: 0 };
            const point3 = { x: 0, y: Number.EPSILON };
            expect(orientation(point1, point2, point3)).toBeGreaterThan(0);
        });
    
        test('it should be > 0 when there is a clockwise turn n°4', () => {
            const point1 = { x: 0, y: 0 };
            const point2 = { x: Number.EPSILON, y: 0 };
            const point3 = { x: Number.EPSILON, y: Number.EPSILON };
            expect(orientation(point1, point2, point3)).toBeGreaterThan(0);
        });
    
        test('it should be = 0 when the points are collinear', () => {
            const point1 = { x: 0, y: 0 };
            const point2 = { x: 100, y: 0 };
            const point3 = { x: 200, y: 0 };
            expect(orientation(point1, point2, point3)).toBeZero();
        });
    
        test('it should be < 0 when there is a counterclockwise turn n°1', () => {
            const point1 = { x: 0, y: 0 };
            const point2 = { x: 100, y: 0 };
            const point3 = { x: 100, y: -100 };
            expect(orientation(point1, point2, point3)).toBeLessThan(0);
        });
    
        test('it should be < 0 when there is a counterclockwise turn n°2', () => {
            const point1 = { x: 0, y: 0 };
            const point2 = { x: 1, y: 0 };
            const point3 = { x: Number.MAX_SAFE_INTEGER, y: -Number.EPSILON };
            expect(orientation(point1, point2, point3)).toBeLessThan(0);
        });
    
        test('it should be < 0 when there is a counterclockwise turn n°3', () => {
            const point1 = { x: 0, y: 0 };
            const point2 = { x: 100, y: 0 };
            const point3 = { x: 0, y: -Number.EPSILON };
            expect(orientation(point1, point2, point3)).toBeLessThan(0);
        });
    
        test('it should be < 0 when there is a counterclockwise turn n°4', () => {
            const point1 = { x: 0, y: 0 };
            const point2 = { x: Number.EPSILON, y: 0 };
            const point3 = { x: Number.EPSILON, y: -Number.EPSILON };
            expect(orientation(point1, point2, point3)).toBeLessThan(0);
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
            const point1 = { x: -100000, y: 0 };
            const point2 = { x: 1, y: 0 };
            const point3 = { x: 2, y: 0 };
            const point4 = { x: Number.EPSILON,  y: 0 };
            expect(sideOfLine(point1, point2, point3)).toEqual(sideOfLine(point4, point2, point3));
            expect(sideOfLine(point1, point2, point3)).toBeZero();
            expect(sideOfLine(point4, point2, point3)).toBeZero();
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
    
        test('concave polygon n°2', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: -100 },
                { x: 200, y: 0 },
                { x: 300, y: -100 },
                { x: 400, y: 0 },
                { x: 300, y: 100 },
                { x: 200, y: 0 },
                { x: 100, y: 100 },
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
    
        test('simple polygon n°1', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 },
            ];
            expect(isSimple(polygon)).toBe(true);
        });
    
        test('simple polygon n°2', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: -100 },
                { x: 200, y: 0 },
                { x: 300, y: -100 },
                { x: 400, y: 0 },
                { x: 300, y: 100 },
                { x: 200, y: 0 },
                { x: 100, y: 100 },
            ];
            expect(isSimple(polygon)).toBe(true);
        });
    
        test('simple polygon n°3', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 200, y: 0 },
                { x: 200, y: 200 },
                { x: 180, y: 180 },
                { x: 180, y: 160 },
                { x: 160, y: 160 },
                { x: 160, y: 180 },
                { x: 180, y: 180 },
                { x: 200, y: 200 },
                { x: 0, y: 200 }
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
    
        test('clockwise ordered n°2', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: -100 },
                { x: 200, y: 0 },
                { x: 300, y: -100 },
                { x: 400, y: 0 },
                { x: 300, y: 100 },
                { x: 200, y: 0 },
                { x: 100, y: 100 },
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
    
        test('not clockwise ordered (not simple)', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 0, y: 100 },
                { x: 100, y: 100 },
            ];
            expect(() => {
                isClockwiseOrdered(polygon);
            }).toThrow();
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
                { x: Number.EPSILON, y: Number.EPSILON },
                { x: 100, y: Number.EPSILON },
                { x: 100, y: 100 },
                { x: Number.EPSILON, y: 100 },
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
    
        test('flat shape n°4', () => {
            const polygon = [
                { x: 0.0007914, y: 0.0005921999999999999 },
                { x: 0.0009233, y: 0.0005921999999999999 },
                { x: 0.0009233, y: 0.0005921999999999999 },
                { x: 0.0003957, y: 0.0005921999999999999 },
            ];
            expect(isFlat(polygon)).toBe(true);
        });
    });
    
    
    const inConvexPolygonSuite = method => () => {
        test('simple square - point inside n°1', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 },
            ];
            const point = { x: 50, y: 50 };
            expect(method(point, polygon)).toBe(true);
        });
    
        test('simple square - point inside n°2', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 },
            ];
            const point = { x: Number.EPSILON, y: Number.EPSILON };
            expect(method(point, polygon)).toBe(true);
        });
    
        test('simple square - point inside n°3', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 },
            ];
            const point = { x: 100 - EPSILON, y: Number.EPSILON };
            expect(method(point, polygon)).toBe(true);
        });
    
        test('simple square - point inside n°4', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 },
            ];
            const point = { x: 100 - EPSILON, y: 100 - EPSILON };
            expect(method(point, polygon)).toBe(true);
        });
    
        test('simple square - point inside n°5', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 },
            ];
            const point = { x: Number.EPSILON, y: 100 - EPSILON };
            expect(method(point, polygon)).toBe(true);
        });
    
        
        test('simple square - point outside n°6', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 },
            ];
            const point =  { x: 0, y: 200 };
            expect(method(point, polygon)).toBe(false);
        });
    
        test('simple square - point outside n°7', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 },
            ];
            const point =  { x: 200, y: 100 };
            expect(method(point, polygon)).toBe(false);
        });
    
        let n = 0;
        for (let i = 0; i <= 100; i += 50) {
            for (let j = 0; j <= 100; j += 50) {
                if (i === j && i === 50) {
                    continue;
                }
                test(`simple square - point on edge n°${++n}`, () => {
                    const polygon = [
                        { x: 0, y: 0 },
                        { x: 100, y: 0 },
                        { x: 100, y: 100 },
                        { x: 0, y: 100 },
                    ];
                    const point = { x: 0 + i, y: 0 + j };
                    expect(method(point, polygon)).toBe(true);
                });
            }
        }
    
        test('simple square - point outside n°1', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 },
            ];
            const point = { x: 150, y: 50 };
            expect(method(point, polygon)).toBe(false);
        });
    
        test('simple square - point outside n°2', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 },
            ];
            const point = { x: -Number.EPSILON, y: -Number.EPSILON };
            expect(method(point, polygon)).toBe(false);
        });
    
        test('simple square - point outside n°3', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 },
            ];
            const point = { x: 100 + EPSILON, y: -Number.EPSILON };
            expect(method(point, polygon)).toBe(false);
        });
    
        test('simple square - point outside n°4', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 },
            ];
            const point = { x: 100 + EPSILON, y: 100 + EPSILON };
            expect(method(point, polygon)).toBe(false);
        });
    
        test('simple square - point outside n°5', () => {
            const polygon = [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 },
            ];
            const point = { x: -Number.EPSILON, y: 100 + EPSILON };
            expect(method(point, polygon)).toBe(false);
        });
    
        test('point outside n°1', () => {
            const polygon = [
                { x: 500, y: 400 },
                { x: 400, y: 400 },
                { x: 350, y: 315 },
                { x: 400, y: 250 },
            ];
            const point =  { x: 620, y: 400 };
            expect(method(point, polygon)).toBe(false);
        });
    


        // Only works in robust mode
        (robustness ? test : test.skip)('point outside n°2', () => {
            const polygon = [
                { x: 527.6, y: 338.40000000000003 },
                { x: 527.6,y: 253.79999999999998 },
                { x: 1187.1000000000001,y: 84.60000000000001 },
                { x: 1187.1000000000001,y: 761.4 },
            ];
            const point =  { x: 791.4, y: 507.59999999999997 };
            
            expect(method(point, polygon)).toBe(false);
        });
    
        test('point outside n°3', () => {
            const polygon = [
                { x: 527.6,y: 338.40000000000003 },
                { x: 527.6,y: 253.79999999999998 },
                { x: 1187.1000000000001,y: 84.60000000000001 },
                { x: 1187.1000000000001,y: 761.4 }
            ];
            const point =  { x: 395.7, y: 507.59999999999997 };
            expect(method(point, polygon)).toBe(false);
        });
    };
    
    
    describe('inConvexPolygon', inConvexPolygonSuite(inConvexPolygon));
    
    describe('inPolygon', () => {
        inConvexPolygonSuite(inPolygon)();
    });

    describe('getRobustness', () => {
        test(`It should return the correct value (${String(robustness)})`, () => {
            expect(getRobustness()).toBe(robustness);
        });
    });
});