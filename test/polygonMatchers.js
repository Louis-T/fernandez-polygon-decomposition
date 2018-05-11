import { isConvex, pointEquality } from '../src/utils';

function polygonEquality(polygon1, polygon2) {
    const polygon1Length = polygon1.length;
    const polygon2Length = polygon2.length;
    if(polygon1Length !== polygon2Length) {
        return false;
    }
    return polygon1.every((vertex, vertexIndexInPolygon1) => {
        const vertexIndexInPolygon2 = polygon2.findIndex(v => pointEquality(v, vertex));
        if(vertexIndexInPolygon2 === -1) {
            return false;
        }
        return pointEquality(polygon1[(vertexIndexInPolygon1 - 1 + polygon1Length) % polygon1Length], polygon2[(vertexIndexInPolygon2 - 1 + polygon2Length) % polygon2Length])
            && pointEquality(polygon1[(vertexIndexInPolygon1 + 1) % polygon1Length], polygon2[(vertexIndexInPolygon2 + 1) % polygon2Length]);
    });
};

expect.extend({
    toBeTheSamePolygonAs(received, argument) {
        const pass = polygonEquality(received, argument);
        if (pass) {
            return {
                message: () =>
                `expected ${JSON.stringify(received, null, 2)} and ${JSON.stringify(argument, null, 2)} to be different polygons`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${JSON.stringify(received, null, 2)} and ${JSON.stringify(argument, null, 2)} to be the same polygon`,
                pass: false,
            };
        }
    },
    toOnlyContainThePolygons(received, argument) {
        let pass = true;
        if(received.length !== argument.length) {
            pass = false;
        }
        received.forEach((polygon) => {
            if(!argument.some(p => polygonEquality(polygon, p))) {
                pass = false;
            }
        });
        if (pass) {
            return {
                message: () =>
                `expected ${JSON.stringify(received, null, 2)} not to contain only the following polygons : ${JSON.stringify(argument, null, 2)}`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${JSON.stringify(received, null, 2)} to contain only the following polygons : ${JSON.stringify(argument, null, 2)}`,
                pass: false,
            };
        }
    },
    toBeAConvexPartition(received) {
        let pass = true;
        for(let polygon of received) {
            if(!isConvex(polygon)) {
                pass = false;
                break;
            }
        }
        if (pass) {
            return {
                message: () =>
                `expected the partition not to be a partition of convex polygons`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected the partition to be a partition of convex polygons`,
                pass: false,
            };
        }
    }
});