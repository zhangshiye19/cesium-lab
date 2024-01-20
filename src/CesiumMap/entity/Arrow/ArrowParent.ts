import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import * as Cesium from "cesium";
import {type Point} from "@/CesiumMap/entity/core/algorithm";
import CPolygon from "@/CesiumMap/entity/CPolygon";
import * as algorithm from '../core/algorithm'


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
        let len = algorithm.getBaseLength(points);
        let headHeight = len * this.headHeightFactor;
        let headPnt = points[points.length - 1];
        len = algorithm.MathDistance(headPnt, points[points.length - 2]);
        let tailWidth = algorithm.MathDistance(tailLeft, tailRight);
        if (headHeight > tailWidth * this.headTailFactor) {
            headHeight = tailWidth * this.headTailFactor;
        }
        let headWidth = headHeight * this.headWidthFactor;
        let neckWidth = headHeight * this.neckWidthFactor;
        headHeight = headHeight > len ? len : headHeight;
        let neckHeight = headHeight * this.neckHeightFactor;
        let headEndPnt: Point = algorithm.getThirdPoint(
            points[points.length - 2],
            headPnt,
            0,
            headHeight,
            true
        );
        let neckEndPnt: Point = algorithm.getThirdPoint(
            points[points.length - 2],
            headPnt,
            0,
            neckHeight,
            true
        );
        let headLeft = algorithm.getThirdPoint(headPnt, headEndPnt, Math.PI / 2, headWidth, false);
        let headRight = algorithm.getThirdPoint(headPnt, headEndPnt, Math.PI / 2, headWidth, true);
        let neckLeft = algorithm.getThirdPoint(headPnt, neckEndPnt, Math.PI / 2, neckWidth, false);
        let neckRight = algorithm.getThirdPoint(headPnt, neckEndPnt, Math.PI / 2, neckWidth, true);

        // @ts-ignore
        return [neckLeft, headLeft, headPnt, headRight, neckRight];
    }

    getArrowBodyPoints(points: Point[], neckLeft: Point, neckRight: Point, tailWidthFactor: number): Point[] {
        let allLen = algorithm.wholeDistance(points);
        let len = algorithm.getBaseLength(points);
        let tailWidth = len * tailWidthFactor;
        let neckWidth = algorithm.MathDistance(neckLeft, neckRight);
        let widthDif = (tailWidth - neckWidth) / 2;
        let tempLen = 0,
            leftBodyPnts: Point[] = [],
            rightBodyPnts: Point[] = [];

        for (let i = 1; i < points.length - 1; i++) {
            let angle = algorithm.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2;
            tempLen += algorithm.MathDistance(points[i - 1], points[i]);
            let w = (tailWidth / 2 - (tempLen / allLen) * widthDif) / Math.sin(angle);
            // @ts-ignore
            let left: Point = algorithm.getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true);
            // @ts-ignore
            let right: Point = algorithm.getThirdPoint(points[i - 1], points[i], angle, w, false);
            leftBodyPnts.push(left);
            rightBodyPnts.push(right);
        }
        return leftBodyPnts.concat(rightBodyPnts);
    }
}
