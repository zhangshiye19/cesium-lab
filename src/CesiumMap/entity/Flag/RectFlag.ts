import {CEntityOption} from "../CEntity";
import * as Cesium from "cesium";
import PlotType from "../PlotType";
import {Point} from "../core/algorithm";
import * as pointconvert from '@/CesiumMap/entity/marsutils/pointconvert'
import {mercators2cartesians} from "@/CesiumMap/entity/marsutils/pointconvert";
import CPolyline from "@/CesiumMap/entity/CPolyline";

export default class RectFlag extends CPolyline {
    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.RECTFLAG;
        this.requirePointCount = 2;

        this.coordinatesVirtual = options.coordinates ?? [];
        if (options.coordinatesActual) this.coordinatesReal = options.coordinatesActual;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        return this.getGeometry(positions)
    }

    getGeometry(positions: Cesium.Cartesian3[]): Cesium.Cartesian3[] {
        if(positions.length < 2) return []

        //@ts-ignore
        let points:Point[] = pointconvert.cartesians2mercators(positions);

        // 取第一个
        const startPoint:Point = points[0];
        // 取最后一个
        const endPoint = points[points.length - 1];
        const point1:Point = [endPoint[0], startPoint[1]];
        const point2:Point = [endPoint[0], (startPoint[1] + endPoint[1]) / 2];
        const point3:Point = [startPoint[0], (startPoint[1] + endPoint[1]) / 2];
        const point4:Point = [startPoint[0], endPoint[1]];
        const components:Point[] = [startPoint, point1, point2, point3, point4];

        return mercators2cartesians(components);
    }

}
