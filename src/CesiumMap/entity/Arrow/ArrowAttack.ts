import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import * as Cesium from "cesium";
import { Point} from "@/CesiumMap/entity/core/algorithm";
import * as pointconvert from '@/CesiumMap/entity/marsutils/pointconvert'
import ArrowParent from "@/CesiumMap/entity/Arrow/ArrowParent";
import * as algorithm from '../core/algorithm'

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
        if(positions.length < 3) return []
        let pnts = pointconvert.cartesians2mercators(positions);
        let _ref = [pnts[0], pnts[1]],
            tailLeft = _ref[0],
            tailRight = _ref[1];

        //@ts-ignore
        if (algorithm.isClockWise(pnts[0], pnts[1], pnts[2])) {
            tailLeft = pnts[1];
            tailRight = pnts[0];
        }
        //@ts-ignore
        let midTail = algorithm.Mid(tailLeft, tailRight);
        //@ts-ignore
        let bonePnts = [midTail].concat(pnts.slice(2));
        // @ts-ignore
        let headPnts = this.getArrowHeadPoints(bonePnts, tailLeft, tailRight);
        let _ref2 = [headPnts[0], headPnts[4]],
            neckLeft = _ref2[0],
            neckRight = _ref2[1];

        //@ts-ignore
        let tailWidthFactor = algorithm.MathDistance(tailLeft, tailRight) / algorithm.getBaseLength(bonePnts);
        // @ts-ignore
        let bodyPnts = this.getArrowBodyPoints(bonePnts, neckLeft, neckRight, tailWidthFactor);
        let count = bodyPnts.length;
        // @ts-ignore
        let leftPnts:Point[] = [tailLeft].concat(bodyPnts.slice(0, count / 2));
        leftPnts.push(neckLeft);
        // @ts-ignore
        let rightPnts:Point[] = [tailRight].concat(bodyPnts.slice(count / 2, count));
        rightPnts.push(neckRight);
        leftPnts = algorithm.getQBSplinePoints(leftPnts);
        rightPnts = algorithm.getQBSplinePoints(rightPnts);
        let pList = leftPnts.concat(headPnts, rightPnts.reverse());

        let returnArr = pointconvert.mercators2cartesians(pList);
        return returnArr;
    }

}
