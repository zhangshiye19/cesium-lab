import {CEntityOption} from "./CEntity";
import ArrowAttack from "./ArrowAttack";
import PlotType from "./PlotType";
import * as Cesium from "cesium";
import * as pointconvert from './util/pointconvert'
import {plotUtil, Point} from "./core/PlotUtil";



export default class SquadCombat extends ArrowAttack {
    headHeightFactor = 0.18;
    headWidthFactor = 0.3;
    neckHeightFactor = 0.85;
    neckWidthFactor = 0.15;
    tailWidthFactor = 0.1;
    swallowTailFactor = 1;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.SQUAD_COMBAT;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        super.mapToCoordinates(positions);
        this.coordinatesReal = this.getGeometry(positions)
    }

    getGeometry(positions: Cesium.Cartesian3[]):Cesium.Cartesian3[] {
        if (positions.length < 2) return [];

        //@ts-ignore
        let pnts:Point[] = pointconvert.cartesians2mercators(positions);

        let tailPnts = this.getTailPoints(pnts);
        let headPnts = this.getArrowHeadPoints(pnts, tailPnts[0], tailPnts[1]);
        let neckLeft = headPnts[0];
        let neckRight = headPnts[4];
        let bodyPnts = this.getArrowBodyPoints(pnts, neckLeft, neckRight, this.tailWidthFactor);
        let _count = bodyPnts.length;
        let leftPnts = [tailPnts[0]].concat(bodyPnts.slice(0, _count / 2));
        leftPnts.push(neckLeft);
        let rightPnts = [tailPnts[1]].concat(bodyPnts.slice(_count / 2, _count));
        rightPnts.push(neckRight);
        leftPnts = plotUtil.getQBSplinePoints(leftPnts);
        rightPnts = plotUtil.getQBSplinePoints(rightPnts);
        let pList = leftPnts.concat(headPnts, rightPnts.reverse());

        let returnArr = pointconvert.mercators2cartesians(pList);
        return returnArr;
    }

    getTailPoints(points:Point[]) {
        let allLen = plotUtil.getBaseLength(points);
        let tailWidth = allLen * this.tailWidthFactor;
        let tailLeft = plotUtil.getThirdPoint(points[1], points[0], Math.PI / 2, tailWidth, false);
        let tailRight = plotUtil.getThirdPoint(points[1], points[0], Math.PI / 2, tailWidth, true);
        return [tailLeft, tailRight];
    }
}
