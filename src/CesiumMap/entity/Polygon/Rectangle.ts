import {CEntityOption} from "../CEntity";
import * as Cesium from "cesium";
import PlotType from "../PlotType";
import {Point} from "../core/algorithm";
import * as pointconvert from '@/CesiumMap/entity/marsutils/pointconvert'
import CPolygon from "../CPolygon";

export default class Rectangle extends CPolygon {

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.RECTANGLE;
        this.requirePointCount = 2;

        this.coordinatesVirtual = options.coordinates ?? [];
        if (options.coordinatesActual) this.coordinatesReal = options.coordinatesActual;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        return this.getGeometry(positions)
    }

    getGeometry(positions: Cesium.Cartesian3[]) {
        if (positions.length < 2) {
            return []
        }

        //@ts-ignore
        let points: Point[] = pointconvert.cartesians2mercators(positions);
        const start = points[0];
        const end = points[1];
        const pList: Point[] = [start, [start[0], end[1]], end, [end[0], start[1]], start];
        return pointconvert.mercators2cartesians(pList);
    }

}
