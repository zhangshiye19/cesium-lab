import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import * as Cesium from "cesium";
import PlotType from "@/CesiumMap/entity/PlotType";
import {plotUtil, Point} from "@/CesiumMap/entity/core/PlotUtil";
import * as pointconvert from './util/pointconvert'
import ArrowParent from "@/CesiumMap/entity/ArrowParent";


export default class ArrowAttack extends ArrowParent {
    headHeightFactor = 0.18;
    headWidthFactor = 0.3;
    neckHeightFactor = 0.85;
    neckWidthFactor = 0.15;
    headTailFactor = 0.8;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.AttackArrow;
    }


    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        this.coordinatesReal = this.getGeometry(positions)
    }

    getGeometry(positions: Cesium.Cartesian3[]): Cesium.Cartesian3[] {
        let pnts = pointconvert.cartesians2mercators(positions);

        if (positions.length === 1) {
            return [positions[0], positions[0], positions[0]]
        }

        if (positions.length === 2) {
            return [positions[0], positions[1], positions[1]]
        }

        let _ref = [pnts[0], pnts[1]],
            tailLeft = _ref[0],
            tailRight = _ref[1];

        //@ts-ignore
        if (plotUtil.isClockWise(pnts[0], pnts[1], pnts[2])) {
            tailLeft = pnts[1];
            tailRight = pnts[0];
        }
        //@ts-ignore
        let midTail = plotUtil.Mid(tailLeft, tailRight);
        //@ts-ignore
        let bonePnts = [midTail].concat(pnts.slice(2));
        // @ts-ignore
        let headPnts = this.getArrowHeadPoints(bonePnts, tailLeft, tailRight);
        let _ref2 = [headPnts[0], headPnts[4]],
            neckLeft = _ref2[0],
            neckRight = _ref2[1];

        //@ts-ignore
        let tailWidthFactor = plotUtil.MathDistance(tailLeft, tailRight) / plotUtil.getBaseLength(bonePnts);
        // @ts-ignore
        let bodyPnts = this.getArrowBodyPoints(bonePnts, neckLeft, neckRight, tailWidthFactor);
        let count = bodyPnts.length;
        // @ts-ignore
        let leftPnts:Point[] = [tailLeft].concat(bodyPnts.slice(0, count / 2));
        leftPnts.push(neckLeft);
        // @ts-ignore
        let rightPnts:Point[] = [tailRight].concat(bodyPnts.slice(count / 2, count));
        rightPnts.push(neckRight);
        leftPnts = plotUtil.getQBSplinePoints(leftPnts);
        rightPnts = plotUtil.getQBSplinePoints(rightPnts);
        let pList = leftPnts.concat(headPnts, rightPnts.reverse());

        let returnArr = pointconvert.mercators2cartesians(pList);
        return returnArr;
    }

}
