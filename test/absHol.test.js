import './polygonMatchers';
import makeAlgoSuite from './algoSuite';
import { setRobustness, getRobustness } from '../src/utils';
import { absHol } from '../src/absHol';


describe.each([[false], [true]])('Robust: %s', (robustness) => {
    beforeAll(() => {
        setRobustness(robustness);
    });

    describe('absHol algorithm', makeAlgoSuite(absHol));

    describe('absHol algorithm', () => {
        test('Polygon with holes n°1', () => {
                const contour = [
                    { x: 0, y: 0 },
                    { x: 200, y: 0 },
                    { x: 200, y: 200 },
                    { x: 0, y: 200 },
                ];
                const holes = [
                    [
                        { x: 50, y: 50 },
                        { x: 150, y: 50 },
                        { x: 150, y: 150 },
                        { x: 50, y: 150 },
                    ]
                ];
                const partition = absHol(contour, holes);
                expect(partition).toBeAConvexPartition();
        });

        test('Polygon with holes n°2', () => {
            const contour = [
                { x: 0, y: 0 },
                { x: 200, y: 0 },
                { x: 200, y: 200 },
                { x: 0, y: 200 },
            ];
            const holes = [
                [
                    { x: 100, y: 50 },
                    { x: 200, y: 50 },
                    { x: 200, y: 150 },
                    { x: 100, y: 150 },
                ]
            ];
            const partition = absHol(contour, holes);
            expect(partition).toBeAConvexPartition();
        });

        test('Polygon with holes n°3', () => {
            const contour = [
                { x: 232, y: 500 },
                { x: 293, y: 413 },
                { x: 358, y: 303 },
                { x: 416, y: 202 },
                { x: 522, y: 164 },
                { x: 637, y: 200 },
                { x: 737, y: 230 },
                { x: 835, y: 259 },
                { x: 824, y: 365 },
                { x: 797, y: 473 },
                { x: 757, y: 567 },
            ];

            const holes = [
                [
                { x: 400, y: 400 },
                { x: 500, y: 400 },
                { x: 500, y: 500 },
                { x: 400, y: 500 },
                ],
                [
                { x: 600, y: 300 },
                { x: 650, y: 300 },
                { x: 650, y: 350 },
                { x: 600, y: 350 },
                ]
            ];

            const partition = absHol(contour, holes);
            expect(partition).toBeAConvexPartition();
        });

        test('Polygon with holes n°4', () => {
            const contour = [
                { x: 189, y: 553 },
                { x: 268, y: 465 },
                { x: 332, y: 385 },
                { x: 412, y: 289 },
                { x: 489, y: 197 },
                { x: 558, y: 102 },
                { x: 667, y: 88 },
                { x: 772, y: 144 },
                { x: 842, y: 224 },
                { x: 851, y: 324 },
                { x: 814, y: 430 },
                { x: 750, y: 525 },
                { x: 685, y: 601 },
            ];

            const holes = [
                [
                { x: 400, y: 400 },
                { x: 500, y: 400 },
                { x: 500, y: 500 },
                { x: 400, y: 500 },
                ],
                [
                { x: 600, y: 300 },
                { x: 650, y: 300 },
                { x: 650, y: 350 },
                { x: 600, y: 350 },
                ]
            ]

            const partition = absHol(contour, holes);
            expect(partition).toBeAConvexPartition();
        });

        test('Polygon with holes n°5', () => {
            const contour = [
                { x: 289, y: 555 },
                { x: 285, y: 455 },
                { x: 312, y: 355 },
                { x: 389, y: 290 },
                { x: 484, y: 251 },
                { x: 599, y: 224 },
                { x: 703, y: 216 },
                { x: 753, y: 305 },
                { x: 746, y: 406 },
                { x: 723, y: 505 },
                { x: 689, y: 600 },
            ];
            
            const holes = [
                [
                { x: 400, y: 400 },
                { x: 500, y: 400 },
                { x: 500, y: 500 },
                { x: 400, y: 500 },
                ],
                [
                { x: 600, y: 300 },
                { x: 610, y: 280 },
                { x: 620, y: 400 },
                { x: 530, y: 410 },
                { x: 520, y: 350 },
                { x: 540, y: 325 },
                ]
            ];

            const partition = absHol(contour, holes);
            expect(partition).toBeAConvexPartition();
        });

        test('Polygon with holes n°6', () => {
            const contour = [
                { x: 0, y: 0 },
                { x: 200, y: 0 },
                { x: 200, y: 200 },
                { x: 180, y: 180 },
                { x: 180, y: 160 },
                { x: 160, y: 160 },
                { x: 160, y: 180 },
                { x: 180, y: 180 },
                { x: 200, y: 200 },
                { x: 0, y: 200 },
            ];
            const holes = [
                [
                    { x: 30, y: 30},
                    { x: 60, y: 30},
                    { x: 60, y: 60},
                    { x: 30, y: 60},
                ]
            ];

            const partition = absHol(contour, holes);
            expect(partition).toBeAConvexPartition();
        });

        test('Polygon with holes n°7', () => {
            const contour = [
            { x: 239.75, y: 682 },
            { x: 209.75, y: 614 },
            { x: 191.75, y: 559 },
            { x: 176.75, y: 490 },
            { x: 156.75, y: 381 },
            { x: 152.75, y: 328 },
            { x: 155.75, y: 261 },
            { x: 177.75, y: 215 },
            { x: 226.75, y: 165 },
            { x: 286.75, y: 138 },
            { x: 373.75, y: 116 },
            { x: 443.75, y: 112 },
            { x: 519.75, y: 114 },
            { x: 587.75, y: 133 },
            { x: 638.75, y: 159 },
            { x: 692.75, y: 203 },
            { x: 718.75, y: 250 },
            { x: 717.75, y: 320 },
            { x: 688.75, y: 394 },
            { x: 645.75, y: 475 },
            { x: 604.75, y: 545 },
            { x: 573.75, y: 593 },
            { x: 535.75, y: 632 },
            { x: 480.75, y: 644 },
            { x: 439.75, y: 610 },
            { x: 415.75, y: 545 },
            ];

            const holes = [[
                {x: 300, y: 300},
                {x: 400, y: 250},
                {x: 350, y: 315},
                {x: 260, y: 300},
            ],
            [
                {x: 400, y: 400},
                {x: 500, y: 400},
                {x: 500, y: 500},
                {x: 400, y: 500},
            ],
            [
                {x: 600, y: 300},
                {x: 610, y: 280},
                {x: 620, y: 400},
                {x: 530, y: 410},
                {x: 520, y: 350},
                {x: 540, y: 325},
            ]];

            const partition = absHol(contour, holes);
            expect(partition).toBeAConvexPartition();
        });

        test('Polygon with holes n°8', () => {
            const contour = [
            { x: 277.75, y: 708 },
            { x: 217.75, y: 675 },
            { x: 184.75, y: 626 },
            { x: 153.75, y: 575 },
            { x: 125.75, y: 499 },
            { x: 119.75, y: 447 },
            { x: 124.75, y: 395 },
            { x: 146.75, y: 336 },
            { x: 172.75, y: 291 },
            { x: 207.75, y: 244 },
            { x: 231.75, y: 183 },
            { x: 248.75, y: 125 },
            { x: 294.75, y: 102 },
            { x: 337.75, y: 130 },
            { x: 320.75, y: 187 },
            { x: 376.75, y: 169 },
            { x: 417.75, y: 127 },
            { x: 433.75, y: 180 },
            { x: 496.75, y: 177 },
            { x: 480.75, y: 237 },
            { x: 448.75, y: 282 },
            { x: 393.75, y: 328 },
            { x: 444.75, y: 317 },
            { x: 488.75, y: 278 },
            { x: 527.75, y: 240 },
            { x: 577.75, y: 205 },
            { x: 613.75, y: 168 },
            { x: 649.75, y: 212 },
            { x: 672.75, y: 296 },
            { x: 685.75, y: 354 },
            { x: 687.75, y: 410 },
            { x: 684.75, y: 479 },
            { x: 675.75, y: 542 },
            { x: 665.75, y: 614 },
            { x: 646.75, y: 680 },
            { x: 625.75, y: 735 },
            ];

            const holes = [[
            {x: 300, y: 300},
            {x: 400, y: 250},
            {x: 350, y: 315},
            {x: 260, y: 300},
            ],
            [
                {x: 400, y: 400},
                {x: 500, y: 400},
                {x: 500, y: 500},
                {x: 400, y: 500},
            ],
            [
                {x: 600, y: 300},
                {x: 610, y: 280},
                {x: 620, y: 400},
                {x: 530, y: 410},
                {x: 520, y: 350},
                {x: 540, y: 325},
            ]];

            const partition = absHol(contour, holes);
            expect(partition).toBeAConvexPartition();
        });

        test('Polygon with holes n°9 (floating point error in getSegmentHoleIntersectionEdges)', () => {
            const contour = [
                { x: 156.5, y: 97.4 },
                { x: 782.5, y: 292.2 },
                { x: 1408.5, y: 97.4 },
                { x: 1408.5, y: 876.6 },
                { x: 782.5, y: 681.8 },
                { x: 156.5, y: 876.6 },
            ];
            const holes = [
                [
                    { x: 782.5, y: 389.6 },
                    { x: 939, y: 487 },
                    { x: 782.5, y: 584.4 },
                    { x: 626, y: 487 },
                ],
            ];

            const partition = absHol(contour, holes);
            expect(partition).toBeAConvexPartition();
        });

        test('Polygon with holes n°10', () => {
            const contour = [
                { x: 131.9, y: 84.60000000000001 },
                { x: 1187.1000000000001, y: 84.60000000000001 },
                { x: 1187.1000000000001, y: 761.4 },
                { x: 131.9, y: 761.4 },
            ];
            const holes = [
                [
                { x: 395.7, y: 253.79999999999998 },
                { x: 527.6, y: 253.79999999999998 },
                { x: 527.6, y: 338.40000000000003 },
                { x: 395.7, y: 338.40000000000003 },
                ],
                [
                { x: 791.4, y: 253.79999999999998 },
                { x: 923.3, y: 253.79999999999998 },
                { x: 923.3, y: 338.40000000000003 },
                { x: 791.4, y: 338.40000000000003 },
                ],
                [
                { x: 791.4, y: 507.59999999999997 },
                { x: 923.3, y: 507.59999999999997 },
                { x: 923.3, y: 592.1999999999999 },
                { x: 791.4, y: 592.1999999999999 },
                ],
                [
                { x: 395.7, y: 507.59999999999997 },
                { x: 527.6, y: 507.59999999999997 },
                { x: 527.6, y: 592.1999999999999 },
                { x: 395.7, y: 592.1999999999999 },
                ]
            ];

            const partition = absHol(contour, holes);
            expect(partition).toBeAConvexPartition();
        });

        test('Polygon with holes n°11', () => {
            const contour = [
                { x: 131.9, y: 84.60000000000001 },
                { x: 1187.1000000000001, y: 84.60000000000001 },
                { x: 1187.1000000000001, y: 761.4 },
                { x: 131.9, y: 761.4 },
            ];
            const holes = [
                [
                { x: 527.6, y: 338.40000000000003 },
                { x: 593.5500000000001, y: 423 },
                { x: 725.45, y: 423 },
                { x: 791.4, y: 338.40000000000003 },
                { x: 725.45, y: 507.59999999999997 },
                { x: 659.5, y: 465.3 },
                { x: 593.5500000000001, y: 507.59999999999997 },
                ]
            ];

            const partition = absHol(contour, holes);
            expect(partition).toBeAConvexPartition();
        });

        test('Polygon with holes n°12', () => {
            const contour = [
                { x: 131.9, y: 84.60000000000001 },
                { x: 1187.1000000000001, y: 84.60000000000001 },
                { x: 1187.1000000000001, y: 761.4 },
                { x: 131.9, y: 761.4 },
            ];
            const holes = [
                [
                { x: 395.7, y: 253.79999999999998 },
                { x: 527.6, y: 253.79999999999998 },
                { x: 659.5, y: 423 },
                { x: 395.7, y: 338.40000000000003 },
                ],
                [
                { x: 659.5, y: 423 },
                { x: 923.3, y: 507.59999999999997 },
                { x: 923.3, y: 592.1999999999999 },
                { x: 791.4, y: 592.1999999999999 },
                ]
            ];

            const partition = absHol(contour, holes);
            expect(partition).toBeAConvexPartition();
        });

        let n = 0;
        for (let i = 0; i <= 150; i += 75) {
            for (let j = 0; j <= 150; j += 75) {
                if (i === j && i === 75) {
                    continue;
                }

                test(`Holes on contour n°${++n} (one hole on the contour)`, () => {
                    const contour = [
                        { x: 0, y: 0},
                        { x: 200, y: 0},
                        { x: 200, y: 200},
                        { x: 0, y: 200},
                    ];
                    const holes = [
                        [
                            { x: 0 + i * 75, y: 0 + j * 75 },
                            { x: 50 + i * 75, y: 0 + j * 75 },
                            { x: 50 + i * 75, y: 50 + j * 75 },
                            { x: 0 + i * 75, y: 50 + j * 75 },
                        ]
                    ];
                });

                test(`Holes on contour n°${++n} (one hole on the contour, one hole at the center`, () => {
                    const contour = [
                        { x: 0, y: 0},
                        { x: 200, y: 0},
                        { x: 200, y: 200},
                        { x: 0, y: 200},
                    ];
                    const holes = [
                        [
                            { x: 0 + i * 75, y: 0 + j * 75 },
                            { x: 50 + i * 75, y: 0 + j * 75 },
                            { x: 50 + i * 75, y: 50 + j * 75 },
                            { x: 0 + i * 75, y: 50 + j * 75 },
                        ],
                        [
                            { x: 90, y: 90 },
                            { x: 110, y: 90 },
                            { x: 110, y: 110 },
                            { x: 90, y: 110 },
                        ],
                    ];
                });

                test(`Holes on contour n°${++n} (two holes on the contour)`, () => {
                    const contour = [
                        { x: 0, y: 0},
                        { x: 200, y: 0},
                        { x: 200, y: 200},
                        { x: 0, y: 200},
                    ];
                    const holes = [
                        [
                            { x: 0 + i * 75, y: 0 + j * 75 },
                            { x: 50 + i * 75, y: 0 + j * 75 },
                            { x: 50 + i * 75, y: 50 + j * 75 },
                            { x: 0 + i * 75, y: 50 + j * 75 },
                        ],
                        [
                            { x: 150 - i * 75, y: 150 - j * 75 },
                            { x: 200 - i * 75, y: 150 - j * 75 },
                            { x: 200 - i * 75, y: 200 - j * 75 },
                            { x: 150 - i * 75, y: 200 - j * 75 },
                        ],
                    ];
                });

                test(`Holes on contour n°${++n} (two holes on the contour, one hole at the center)`, () => {
                    const contour = [
                        { x: 0, y: 0},
                        { x: 200, y: 0},
                        { x: 200, y: 200},
                        { x: 0, y: 200},
                    ];
                    const holes = [
                        [
                            { x: 0 + i * 75, y: 0 + j * 75 },
                            { x: 50 + i * 75, y: 0 + j * 75 },
                            { x: 50 + i * 75, y: 50 + j * 75 },
                            { x: 0 + i * 75, y: 50 + j * 75 },
                        ],
                        [
                            { x: 150 - i * 75, y: 150 - j * 75 },
                            { x: 200 - i * 75, y: 150 - j * 75 },
                            { x: 200 - i * 75, y: 200 - j * 75 },
                            { x: 150 - i * 75, y: 200 - j * 75 },
                        ],
                        [
                            { x: 90, y: 90 },
                            { x: 110, y: 90 },
                            { x: 110, y: 110 },
                            { x: 90, y: 110 },
                        ],
                    ];
                });
            }
        }
    });

    describe('getRobustness', () => {
        test(`It should return the correct value (${String(robustness)})`, () => {
            expect(getRobustness()).toBe(robustness);
        });
    });
});
