import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import CPolyline from "@/CesiumMap/entity/CPolyline";
import Cesium from "cesium";
import {
    getArcPoints,
    getAzimuth,
    getCircleCenterOfThreePoints,
    isClockWise,
    MathDistance,
    type Point
} from "@/CesiumMap/entity/core/algorithm";
import {cartesians2mercators, mercators2cartesians} from "@/CesiumMap/entity/marsutils/pointconvert";
import PlotType from "@/CesiumMap/entity/PlotType";


export class Arc extends CPolyline {

    constructor(options: CEntityOption) {
        super(options);

        this.plotType = PlotType.ARC
        this.maxRequiredPointCount = 3

        this.coordinatesVirtual = options.coordinates ?? [];
        if (options.coordinatesActual) this.coordinatesReal = options.coordinatesActual;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        return this.getGeometry(positions)
    }

    getGeometry(positions: Cesium.Cartesian3[]) {
        if(positions.length < 2) {
            return []
        }
        if (positions.length === 2) {
            return positions;
        }
        //@ts-ignore
        const points: Point[] = cartesians2mercators(positions)
        // eslint-disable-next-line
        let [pnt1, pnt2, pnt3, startAngle, endAngle] = [points[0], points[1], points[2], 0, 0];
        const center = getCircleCenterOfThreePoints(pnt1, pnt2, pnt3);
        const radius = MathDistance(pnt1, center);
        const angle1 = getAzimuth(pnt1, center);
        const angle2 = getAzimuth(pnt2, center);
        if (isClockWise(pnt1, pnt2, pnt3)) {
            startAngle = angle2;
            endAngle = angle1;
        } else {
            startAngle = angle1;
            endAngle = angle2;
        }
        return mercators2cartesians(getArcPoints(center, radius, startAngle, endAngle))
    }
}
