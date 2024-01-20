import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import * as Cesium from "cesium";
import {type Point} from "@/CesiumMap/entity/core/PlotUtils";
import * as pointconvert from '@/CesiumMap/entity/util/pointconvert'
import CPolyline from "@/CesiumMap/entity/CPolyline";
// import PositionType from "./PositionType";
import * as plotUtil from '../core/PlotUtils'


export default class StraightArrow extends CPolyline {

    maxArrowLength = 3000000;
    arrowLengthScale = 5;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.STRAIGHT_ARROW;
        this.requirePointCount = 2;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        this.coordinatesReal = this.getGeometry(positions)
    }

    getGeometry(positions: Cesium.Cartesian3[]):Cesium.Cartesian3[] {
        if (positions.length < 2) {
            return [];
        }
        //@ts-ignore
        const pnts:Point[] = pointconvert.cartesians2mercators(positions);
        const [pnt1, pnt2] = [pnts[0], pnts[1]];
        const distance = plotUtil.MathDistance(pnt1, pnt2);
        let len = distance / this.arrowLengthScale;
        len = len > this.maxArrowLength ? this.maxArrowLength : len;
        const leftPnt = plotUtil.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, false);
        const rightPnt = plotUtil.getThirdPoint(pnt1, pnt2, Math.PI / 6, len, true);
        return pointconvert.mercators2cartesians([pnt1, pnt2, leftPnt, pnt2, rightPnt])
    }
}
