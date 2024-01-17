import {CEntityOption} from "./CEntity";
import * as Cesium from "cesium";
import PlotType from "./PlotType";
import {plotUtil, Point} from "./core/PlotUtil";
import * as pointconvert from './util/pointconvert'
import CPolygon from "./CPolygon";


export default class Lune extends CPolygon {
    headHeightFactor = 0.18;
    headWidthFactor = 0.3;
    neckHeightFactor = 0.85;
    neckWidthFactor = 0.15;
    headTailFactor = 0.8;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.LUNE;
        this.requirePointCount = 3;
    }


    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        this.coordinatesReal = this.getGeometry(positions)
    }

    getGeometry(positions: Cesium.Cartesian3[]): Cesium.Cartesian3[] {
        if (positions.length === 1) {
            return [positions[0], positions[0], positions[0]]
        }

        if (positions.length === 2) {
            return [positions[0], positions[1], positions[1]]
        }

        //@ts-ignore
        let pnts:Point[] = pointconvert.cartesians2mercators(positions);
        // 这儿用_ref干啥？
        // let _ref:(number | Point)[] = [pnts[0], pnts[1], pnts[2], 0, 0],
        //     pnt1 = _ref[0],
        //     pnt2 = _ref[1],
        //     pnt3 = _ref[2],
        //     startAngle = _ref[3],
        //     endAngle = _ref[4];
        let pnt1 = pnts[0];
        let pnt2 = pnts[1];
        let pnt3 = pnts[2];
        let startAngle = 0;
        let endAngle = 0;

        let center = plotUtil.getCircleCenterOfThreePoints(pnt1, pnt2, pnt3);
        let radius = plotUtil.MathDistance(pnt1, center);
        let angle1 = plotUtil.getAzimuth(pnt1, center);
        let angle2 = plotUtil.getAzimuth(pnt2, center);
        if (plotUtil.isClockWise(pnt1, pnt2, pnt3)) {
            startAngle = angle2;
            endAngle = angle1;
        } else {
            startAngle = angle1;
            endAngle = angle2;
        }
        pnts = plotUtil.getArcPoints(center, radius, startAngle, endAngle);
        pnts.push(pnts[0]);

        let returnArr = pointconvert.mercators2cartesians(pnts);
        return returnArr;
    }

}
