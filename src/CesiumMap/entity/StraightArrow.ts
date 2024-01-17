import {CEntityOption} from "./CEntity";
import * as Cesium from "cesium";
import CPolyline from './CPolyline';
import PlotType from "./PlotType";
import {plotUtil, Point} from "./core/PlotUtil";
import * as pointconvert from './util/pointconvert';
import CPolygon from "./CPolygon";
// import PositionType from "./PositionType";


export default class StraightArrow extends CPolygon {
    tailWidthFactor =  0.05;
    neckWidthFactor =  0.1;
    headWidthFactor =  0.15;
    headAngle = Math.PI / 4;
    neckAngle = Math.PI * 0.17741;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.STRAIGHT_ARROW;
        this.requirePointCount = 2;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        this.coordinatesReal = this.getGeometry(positions)
    }


    getGeometry(positions: Cesium.Cartesian3[]) {

        if (positions.length === 0) {
            return []
        }
        if (positions.length < 2) {
            return positions.concat(new Array(3 - positions.length).fill(positions[positions.length - 1]))
        }

        //@ts-ignore
        let pnts:Point[] = pointconvert.cartesians2mercators(positions);
        let _ref = [pnts[0], pnts[1]],
            pnt1 = _ref[0],
            pnt2 = _ref[1];
        let len = plotUtil.getBaseLength(pnts);
        let tailWidth = len * this.tailWidthFactor;
        let neckWidth = len * this.neckWidthFactor;
        let headWidth = len * this.headWidthFactor;
        let tailLeft = plotUtil.getThirdPoint(pnt2, pnt1, Math.PI / 2, tailWidth, true);
        let tailRight = plotUtil.getThirdPoint(pnt2, pnt1, Math.PI / 2, tailWidth, false);
        let headLeft = plotUtil.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, false);
        let headRight = plotUtil.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, true);
        let neckLeft = plotUtil.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, false);
        let neckRight = plotUtil.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, true);
        let pList = [tailLeft, neckLeft, headLeft, pnt2, headRight, neckRight, tailRight];

        let returnArr = pointconvert.mercators2cartesians(pList);
        return returnArr;
    }
}
