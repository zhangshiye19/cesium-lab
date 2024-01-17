import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import * as Cesium from "cesium";
import CPolygon from "./CPolygon";
import PlotType from "@/CesiumMap/entity/PlotType";
import {plotUtil, Point} from "@/CesiumMap/entity/core/PlotUtil";


export default class ArrowParent extends CPolygon {
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
    }


    getArrowHeadPoints(points: Point[], tailLeft: Point, tailRight: Point): Point[] {
        let len = plotUtil.getBaseLength(points);
        let headHeight = len * this.headHeightFactor;
        let headPnt = points[points.length - 1];
        len = plotUtil.MathDistance(headPnt, points[points.length - 2]);
        let tailWidth = plotUtil.MathDistance(tailLeft, tailRight);
        if (headHeight > tailWidth * this.headTailFactor) {
            headHeight = tailWidth * this.headTailFactor;
        }
        let headWidth = headHeight * this.headWidthFactor;
        let neckWidth = headHeight * this.neckWidthFactor;
        headHeight = headHeight > len ? len : headHeight;
        let neckHeight = headHeight * this.neckHeightFactor;
        let headEndPnt: Point = plotUtil.getThirdPoint(
            points[points.length - 2],
            headPnt,
            0,
            headHeight,
            true
        );
        let neckEndPnt: Point = plotUtil.getThirdPoint(
            points[points.length - 2],
            headPnt,
            0,
            neckHeight,
            true
        );
        let headLeft = plotUtil.getThirdPoint(headPnt, headEndPnt, Math.PI / 2, headWidth, false);
        let headRight = plotUtil.getThirdPoint(headPnt, headEndPnt, Math.PI / 2, headWidth, true);
        let neckLeft = plotUtil.getThirdPoint(headPnt, neckEndPnt, Math.PI / 2, neckWidth, false);
        let neckRight = plotUtil.getThirdPoint(headPnt, neckEndPnt, Math.PI / 2, neckWidth, true);

        // @ts-ignore
        return [neckLeft, headLeft, headPnt, headRight, neckRight];
    }

    getArrowBodyPoints(points: Point[], neckLeft: Point, neckRight: Point, tailWidthFactor: number): Point[] {
        let allLen = plotUtil.wholeDistance(points);
        let len = plotUtil.getBaseLength(points);
        let tailWidth = len * tailWidthFactor;
        let neckWidth = plotUtil.MathDistance(neckLeft, neckRight);
        let widthDif = (tailWidth - neckWidth) / 2;
        let tempLen = 0,
            leftBodyPnts: Point[] = [],
            rightBodyPnts: Point[] = [];

        for (let i = 1; i < points.length - 1; i++) {
            let angle = plotUtil.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2;
            tempLen += plotUtil.MathDistance(points[i - 1], points[i]);
            let w = (tailWidth / 2 - (tempLen / allLen) * widthDif) / Math.sin(angle);
            // @ts-ignore
            let left: Point = plotUtil.getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true);
            // @ts-ignore
            let right: Point = plotUtil.getThirdPoint(points[i - 1], points[i], angle, w, false);
            leftBodyPnts.push(left);
            rightBodyPnts.push(right);
        }
        return leftBodyPnts.concat(rightBodyPnts);
    }
}
