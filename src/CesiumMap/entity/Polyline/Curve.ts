import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import Cesium from "cesium";
import {cartesians2mercators, mercators2cartesians} from "@/CesiumMap/entity/marsutils/pointconvert";
import {getCurvePoints, Point} from "@/CesiumMap/entity/core/algorithm";
import CPolyline from "@/CesiumMap/entity/CPolyline";


export default class Curve extends CPolyline {

    t = 0.3;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.CURVE
        this.requirePointCount = Infinity

        // 等到一切属性初始化完成后开始执行
        this.coordinatesVirtual = options.coordinates ?? [];
        if (options.coordinatesActual) this.coordinatesReal = options.coordinatesActual;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        return this.getGeometry(positions)
    }

    getGeometry(positions: Cesium.Cartesian3[]) {
        if (positions.length < 2) return []
        if (positions.length === 2) return positions
        //@ts-ignore
        const points: Point[] = cartesians2mercators(positions)
        return mercators2cartesians(getCurvePoints(this.t, points))
    }
}
