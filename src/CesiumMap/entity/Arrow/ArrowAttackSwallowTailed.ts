

import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import * as Cesium from "cesium";
import { Point} from "@/CesiumMap/entity/core/algorithm";
import * as pointconvert from '@/CesiumMap/entity/marsutils/pointconvert'
import ArrowParent from "@/CesiumMap/entity/Arrow/ArrowParent";
import * as algorithms from '../core/algorithm'


export default class ArrowAttackSwallowTailed extends ArrowParent {
    headHeightFactor = 0.18;
    headWidthFactor = 0.3;
    neckHeightFactor = 0.85;
    neckWidthFactor = 0.15;
    headTailFactor = 0.8;
    tailWidthFactor =  0.1;
    swallowTailFactor = 1;


    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.TAILED_ATTACK_ARROW;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        // super.mapToCoordinates(positions);
        return this.getGeometry(positions)
    }

    getGeometry(positions: Cesium.Cartesian3[]): Cesium.Cartesian3[] {
        if(positions.length < 3) return []
        //@ts-ignore
        let pnts:Point[] = pointconvert.cartesians2mercators(positions);

        let _ref = [pnts[0], pnts[1]],
            tailLeft = _ref[0],
            tailRight = _ref[1];

        if (algorithms.isClockWise(pnts[0], pnts[1], pnts[2])) {
            tailLeft = pnts[1];
            tailRight = pnts[0];
        }
        let midTail = algorithms.Mid(tailLeft, tailRight);
        let bonePnts = [midTail].concat(pnts.slice(2));
        let headPnts = this.getArrowHeadPoints(bonePnts, tailLeft, tailRight);
        let _ref2 = [headPnts[0], headPnts[4]],
            neckLeft = _ref2[0],
            neckRight = _ref2[1];

        let tailWidth = algorithms.MathDistance(tailLeft, tailRight);
        let allLen = algorithms.getBaseLength(bonePnts);
        let len = allLen * this.tailWidthFactor * this.swallowTailFactor;
        let swallowTailPnt = algorithms.getThirdPoint(bonePnts[1], bonePnts[0], 0, len, true);
        let factor = tailWidth / allLen;
        let bodyPnts = this.getArrowBodyPoints(bonePnts, neckLeft, neckRight, factor);
        let count = bodyPnts.length;
        let leftPnts = [tailLeft].concat(bodyPnts.slice(0, count / 2));
        leftPnts.push(neckLeft);
        let rightPnts = [tailRight].concat(bodyPnts.slice(count / 2, count));
        rightPnts.push(neckRight);
        leftPnts = algorithms.getQBSplinePoints(leftPnts);
        rightPnts = algorithms.getQBSplinePoints(rightPnts);
        let pList = leftPnts.concat(headPnts, rightPnts.reverse(), [swallowTailPnt, leftPnts[0]]);

        let returnArr = pointconvert.mercators2cartesians(pList);
        return returnArr;
    }

}
