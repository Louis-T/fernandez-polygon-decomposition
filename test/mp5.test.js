import makeAlgoSuite from './algoSuite';
import { setRobustness, getRobustness } from '../src/utils';
import { MP5 } from '../src/mp5';

describe.each([[false], [true]])('Robust: %s', (robustness) => {
    beforeAll(() => {
        setRobustness(robustness);
    });

    describe('MP5 algorithm', makeAlgoSuite(MP5, robustness));

    describe('getRobustness', () => {
        test(`It should return the correct value (${String(robustness)})`, () => {
            expect(getRobustness()).toBe(robustness);
        });
    });
});
