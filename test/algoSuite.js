import './polygonMatchers';


function generateNVerticesPolygon(n, radius = 1) {
    const vertices = [];
    for (let i = 0; i < n; i++) {
        const angle = i * 2 * Math.PI / n;
        vertices.push({
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
        });
    }
    return vertices;
};

function generateRandomStarShapedPolygon(n) {
    const vertices = [];
    for (let i = 0; i < n; i++) {
        const angle = i * 2 * Math.PI / n;
        const radius = Math.random() * 100;
        vertices.push({
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
        });
    }
    return vertices;
}

export default (algo, robustness) => {
    return () => {
        for(let i = 0; i <= 100; i++) {
            test(`${i} sides convex polygon`, () => {
                const polygon = generateNVerticesPolygon(i);
                const partition = algo(polygon);
                expect(partition.length).toBe(1);
                expect(partition[0]).toBeTheSamePolygonAs(polygon);
                expect(partition).toBeAConvexPartition();
            });
        }

        for(let i = 3; i <= 100; i++) {
            test(`${i} sides star shaped polygon`, () => {
                const polygon = generateRandomStarShapedPolygon(i);
                const partition = algo(polygon);
                expect(partition.length).toBeGreaterThanOrEqual(1);
                expect(partition).toBeAConvexPartition();
            });
        }

        test('Should throw an error if the input is not an array', () => {
            expect(() => {
                algo();
            }).toThrow();

            expect(() => {
                algo(null);
            }).toThrow();

            expect(() => {
                algo('not an array');
            }).toThrow();
        });

        test('Should throw an error if the input vertices are not CW ordered', () => {
            expect(() => {
                algo([
                    { x: 1, y: 8},
                    { x: 11, y: 9},
                    { x: 20, y: 1},
                    { x: 10, y: -10},
                    { x: 0, y: 0},
                ]);
            }).toThrow();
        });

        test('convex n°1', () => {
            const polygon = [
                { x: 0, y: 0},
                { x: 10, y: -10},
                { x: 20, y: 1},
                { x: 11, y: 9},
                { x: 1, y: 8},
            ];
            const partition = algo(polygon);
            expect(partition.length).toBe(1);
            expect(partition[0]).toBeTheSamePolygonAs(polygon);
            expect(partition).toBeAConvexPartition();
        });

        test('concave n°1', () => {
            const polygon = [
                { x: 0, y: 0},
                { x: 200, y: 0},
                { x: 200, y: 200},
                { x: 100, y: 200},
                { x: 100, y: 100},
                { x: 0, y: 100},
            ];
            const partition = algo(polygon);
            expect(partition.length).toBe(2);
            expect(partition).toOnlyContainThePolygons([
                [
                    { x: 200, y: 0},
                    { x: 200, y: 200},
                    { x: 100, y: 200},
                    { x: 100, y: 100},
                ],
                [
                    { x: 100, y: 100},
                    { x: 0, y: 100},
                    { x: 0, y: 0},
                    { x: 200, y: 0},
                ]
            ]);
            expect(partition).toBeAConvexPartition();
        });

        test('concave n°2', () => {
            const polygon = [
                { x: 0, y: 0},
                { x: 175, y: 0},
                { x: 175, y: 25},
                { x: 200, y: 25},
                { x: 200, y: 200},
                { x: 100, y: 200},
                { x: 100, y: 100},
                { x: 0, y: 100},
            ];
            const partition = algo(polygon);
            expect(partition.length).toBe(2);
            expect(partition).toOnlyContainThePolygons([
                [
                    { x: 175, y: 25},
                    { x: 200, y: 25},
                    { x: 200, y: 200},
                    { x: 100, y: 200},
                    { x: 100, y: 100},
                ],
                [
                    { x: 100, y: 100},
                    { x: 0, y: 100},
                    { x: 0, y: 0},
                    { x: 175, y: 0},
                    { x: 175, y: 25},
                ]
            ]);
            expect(partition).toBeAConvexPartition();
        });

        test('concave n°3', () => {
            const polygon = [
                { x: 0, y: 0},
                { x: 200, y: 0},
                { x: 200, y: 200},
                { x: 400, y: 200},
                { x: 400, y: 0},
                { x: 600, y: 0},
                { x: 600, y: 400},
                { x: 0, y: 400},
            ];
            const partition = algo(polygon);
            expect(partition.length).toBe(3);
            expect(partition).toOnlyContainThePolygons([
                [
                    { x: 0, y: 400},
                    { x: 0, y: 0},
                    { x: 200, y: 0},
                    { x: 200, y: 200},
                ],
                [
                    { x: 200, y: 200},
                    { x: 400, y: 200},
                    { x: 600, y: 400},
                    { x: 0, y: 400},
                ],
                [
                    { x: 400, y: 200},
                    { x: 400, y: 0},
                    { x: 600, y: 0},
                    { x: 600, y: 400},
                ]
            ]);
            expect(partition).toBeAConvexPartition();
        });

        test('concave n°4', () => {
            const polygon = [
                { x: 0, y: 0},
                { x: 200, y: 0},
                { x: 210, y: 200},
                { x: 390, y: 200},
                { x: 400, y: 0},
                { x: 600, y: 0},
                { x: 590, y: 200},
                { x: 700, y: 400},
                { x: 0, y: 400},
                { x: 10, y: 200},
            ];
            const partition = algo(polygon);
            expect(partition.length).toBe(3);
            expect(partition).toBeAConvexPartition();
        });

        test('concave n°5', () => {
            /*const polygon = [
                { x: 22.275707709256533, y: 0 },
                { x: 82.31332794441389, y: 47.52362204660129 },
                { x: 40.907320734786545, y: 70.8535579141661 },
                { x: 3.3042806928813077e-15, y: 53.96299888558688 },
                { x: -51.38365221748002, y: 88.99909631912465 },
                { x: -81.79044688232696, y: 47.22173652465125 },
                { x: -56.10965548115439, y: 6.8714509986256464e-15 },
                { x: -56.378865994890184, y: -32.55035345875566 },
                { x: -47.465188949808145, y: -82.21211885192444 },
                { x: -4.2250827489239944e-15, y: -23.00027921991147 },
                { x: 45.720081109915284, y: -79.18950340854332 },
                { x: 28.122415191151283, y: -16.236483980873633 }
            ];*/
            const polygon = [
                { x: 22, y: 0 },
                { x: 82, y: 47 },
                { x: 40, y: 70 },
                { x: 0, y: 54 },
                { x: -51, y: 89 },
                { x: -82, y: 47 },
                { x: -56, y: 1 },
                { x: -56, y: -32 },
                { x: -47, y: -82 },
                { x: -1, y: -23 },
                { x: 45, y: -79 },
                { x: 28, y: -16 }
            ];
            const partition = algo(polygon);
            expect(partition.length).toBeGreaterThan(1);
            expect(partition).toBeAConvexPartition();
        });

        test('concave n°6', () => {
            /*const polygon = [
                { x: 58.48274130420271, y: 0 },
                { x: 67.69096654608518, y: 84.88178726684374 },
                { x: -10.06459409060641, y: 44.09586787748601 },
                { x: -54.84743983778685, y: 26.413134932451072 },
                { x: -13.340371264011491, y: -6.424384206217241 },
                { x: -18.605177744492938, y: -81.51460975699136 },
                { x: 27.98801963938743, y: -35.095866557516665 }
            ];*/
            const polygon = [
                { x: 58, y: 0 },
                { x: 67, y: 84 },
                { x: -10, y: 44 },
                { x: -54, y: 26 },
                { x: 0, y: -6 },
                { x: -18, y: -81 },
                { x: 27, y: -35 }
            ];
            const partition = algo(polygon);
            expect(partition.length).toBeGreaterThan(1);
            expect(partition).toBeAConvexPartition();
        });

        test('concave n°7', () => {
            const polygon = [
                { x: 100, y: 100 },
                { x: 110, y: 80 },
                { x: 150, y: 75 },
                { x: 160, y: 10 },
                { x: 155, y: 78 },
                { x: 120, y: 90 },
                { x: 120, y: 120 },
                { x: 150, y: 130 },
                { x: 160, y: 110 },
                { x: 130, y: 110 },
                { x: 142, y: 100 },
                { x: 140, y: 90 },
                { x: 180, y: 100 },
                { x: 150, y: 150 },
                { x: 110, y: 130 },
            ];
            const partition = algo(polygon);
            expect(partition.length).toBeGreaterThan(1);
            expect(partition).toBeAConvexPartition();
        });

        test('concave n°8', () => {
              const polygon = [
                  { x: 100, y: 100 },
                  { x: 110, y: 80 },
                  { x: 150, y: 75 },
                  { x: 160, y: 10 },
                  { x: 155, y: 78 },
                  { x: 120, y: 87 },
                  { x: 120, y: 120 },
                  { x: 150, y: 130 },
                  { x: 160, y: 110 },
                  { x: 130, y: 110 },
                  { x: 142, y: 100 },
                  { x: 140, y: 90 },
                  { x: 180, y: 100 },
                  { x: 150, y: 150 },
                  { x: 110, y: 130 },
              ];
              const partition = algo(polygon);
              expect(partition.length).toBeGreaterThan(1);
              expect(partition).toBeAConvexPartition();
        });

        test('concave n°9', () => {
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
            const partition = algo(polygon);
            expect(partition.length).toBeGreaterThan(1);
            expect(partition).toBeAConvexPartition();
        });

        test('weakly-in-simple n°1', () => {
            const polygon = [
                { x: 0, y: 0},
                { x: 1000, y: 0},
                { x: 750, y: 250},
                { x: 250, y: 250},
                { x: 250, y: 750},
                { x: 750, y: 750},
                { x: 750, y: 250},
                { x: 1000, y: 0},
                { x: 1000, y: 1000},
                { x: 0, y: 1000},
            ];
            const partition = algo(polygon);
            expect(partition.length).toBe(4);
            expect(partition).toOnlyContainThePolygons([
                [
                    { x: 0, y: 0},
                    { x: 1000, y: 0},
                    { x: 750, y: 250},
                    { x: 250, y: 250},
                ],
                [
                    { x: 0, y: 0},
                    { x: 250, y: 250},
                    { x: 250, y: 750},
                    { x: 0, y: 1000},
                ],
                [
                    { x: 0, y: 1000},
                    { x: 250, y: 750},
                    { x: 750, y: 750},
                    { x: 1000, y: 1000},
                ],
                [
                    { x: 1000, y: 1000},
                    { x: 750, y: 750},
                    { x: 750, y: 250},
                    { x: 1000, y: 0},
                ]
            ]);
            expect(partition).toBeAConvexPartition();
        });

        // Only works in robust mode
        (robustness ? test : test.skip)('weakly-in-simple n°2', () => {
            const polygon = [
                { x: 95, y: 84.60000000000001 },
                { x: 855, y: 84.60000000000001 },
                { x: 807.5, y: 126.89999999999999 },
                { x: 760, y: 126.89999999999999 },
                { x: 712.5, y: 126.89999999999999 },
                { x: 665, y: 143.82000000000002 },
                { x: 712.5, y: 160.74 },
                { x: 475, y: 423 },
                { x: 380, y: 253.79999999999998 },
                { x: 285, y: 253.79999999999998 },
                { x: 285, y: 338.40000000000003 },
                { x: 475, y: 423 },
                { x: 712.5, y: 160.74 },
                { x: 712.5, y: 126.89999999999999 },
                { x: 760, y: 126.89999999999999 },
                { x: 760, y: 169.20000000000002 },
                { x: 475, y: 423 },
                { x: 570, y: 592.1999999999999 },
                { x: 665, y: 592.1999999999999 },
                { x: 665, y: 507.59999999999997 },
                { x: 475, y: 423 },
                { x: 760, y: 169.20000000000002 },
                { x: 807.5, y: 169.20000000000002 },
                { x: 807.5, y: 126.89999999999999 },
                { x: 855, y: 84.60000000000001 },
                { x: 855, y: 761.4 },
                { x: 95, y: 761.4 },
            ];
            const partition = algo(polygon);
            expect(partition.length).toBeGreaterThan(0);
            expect(partition).toBeAConvexPartition();
        });
    };
};