import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import * as Cesium from "cesium";
import {Point} from "@/CesiumMap/entity/core/algorithm";
import * as pointconvert from '@/CesiumMap/entity/marsutils/pointconvert'
import CPolygon from "@/CesiumMap/entity/CPolygon";
import * as algorithm from '../core/algorithm'

export default class ArrowDouble extends CPolygon {

    headHeightFactor = 0.25;
    headWidthFactor = 0.3;
    neckHeightFactor = 0.85;
    neckWidthFactor = 0.15;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.DOUBLE_ARROW;
        this.requirePointCount = 5;
    }

    mapToCoordinates(positions: Cesium.Cartesian3[]) {
        // super.mapToCoordinates(positions);

        return this.getGeometry(positions)
    }


    getGeometry(positions: Cesium.Cartesian3[]): Cesium.Cartesian3[] {
        if (positions.length < 3) {
            return []
        }
        //@ts-ignore
        let pnts: Point[] = pointconvert.cartesians2mercators(positions);

        let _ref = [pnts[0], pnts[1], pnts[2]];
        let pnt1: Point = _ref[0];
        let pnt2 = _ref[1];
        let pnt3 = _ref[2];
        let count = positions.length;
        let tempPoint4;
        let connPoint;
        if (count === 3) {
            // @ts-ignore
            tempPoint4 = this.getTempPoint4(pnt1, pnt2, pnt3);
            connPoint = algorithm.Mid(pnt1, pnt2);
        } else if (count === 4) {
            tempPoint4 = pnts[3];
            connPoint = algorithm.Mid(pnt1, pnt2);
        } else {
            tempPoint4 = pnts[3];
            connPoint = pnts[4];
        }
        let leftArrowPnts: Point[] = [],
            rightArrowPnts: Point[] = [];

        if (algorithm.isClockWise(pnt1, pnt2, pnt3)) {
            // @ts-ignore
            leftArrowPnts = this.getArrowPoints(pnt1, connPoint, tempPoint4, false);
            // @ts-ignore
            rightArrowPnts = this.getArrowPoints(connPoint, pnt2, pnt3, true);
        } else {
            // @ts-ignore
            leftArrowPnts = this.getArrowPoints(pnt2, connPoint, pnt3, false);
            // @ts-ignore
            rightArrowPnts = this.getArrowPoints(connPoint, pnt1, tempPoint4, true);
        }
        // @ts-ignore
        let m = leftArrowPnts.length;
        let t = (m - 5) / 2;
        let llBodyPnts = leftArrowPnts.slice(0, t);
        let lArrowPnts = leftArrowPnts.slice(t, t + 5);
        let lrBodyPnts = leftArrowPnts.slice(t + 5, m);
        let rlBodyPnts = rightArrowPnts.slice(0, t);
        let rArrowPnts = rightArrowPnts.slice(t, t + 5);
        let rrBodyPnts = rightArrowPnts.slice(t + 5, m);
        rlBodyPnts = algorithm.getBezierPoints(rlBodyPnts);
        let bodyPnts = algorithm.getBezierPoints(rrBodyPnts.concat(llBodyPnts.slice(1)));
        lrBodyPnts = algorithm.getBezierPoints(lrBodyPnts);
        let newPnts = rlBodyPnts.concat(rArrowPnts, bodyPnts, lArrowPnts, lrBodyPnts);

        let returnArr = pointconvert.mercators2cartesians(newPnts);
        return returnArr;
    }

    getTempPoint4(linePnt1: Point, linePnt2: Point, point: Point) {
        let midPnt = algorithm.Mid(linePnt1, linePnt2);
        let len = algorithm.MathDistance(midPnt, point);
        let angle = algorithm.getAngleOfThreePoints(linePnt1, midPnt, point);
        let symPnt = undefined,
            distance1 = undefined,
            distance2 = undefined,
            mid = undefined;

        if (angle < Math.PI / 2) {
            distance1 = len * Math.sin(angle);
            distance2 = len * Math.cos(angle);
            mid = algorithm.getThirdPoint(linePnt1, midPnt, Math.PI / 2, distance1, false);
            symPnt = algorithm.getThirdPoint(midPnt, mid, Math.PI / 2, distance2, true);
        } else if (angle >= Math.PI / 2 && angle < Math.PI) {
            distance1 = len * Math.sin(Math.PI - angle);
            distance2 = len * Math.cos(Math.PI - angle);
            mid = algorithm.getThirdPoint(linePnt1, midPnt, Math.PI / 2, distance1, false);
            symPnt = algorithm.getThirdPoint(midPnt, mid, Math.PI / 2, distance2, false);
        } else if (angle >= Math.PI && angle < Math.PI * 1.5) {
            distance1 = len * Math.sin(angle - Math.PI);
            distance2 = len * Math.cos(angle - Math.PI);
            mid = algorithm.getThirdPoint(linePnt1, midPnt, Math.PI / 2, distance1, true);
            symPnt = algorithm.getThirdPoint(midPnt, mid, Math.PI / 2, distance2, true);
        } else {
            distance1 = len * Math.sin(Math.PI * 2 - angle);
            distance2 = len * Math.cos(Math.PI * 2 - angle);
            mid = algorithm.getThirdPoint(linePnt1, midPnt, Math.PI / 2, distance1, true);
            symPnt = algorithm.getThirdPoint(midPnt, mid, Math.PI / 2, distance2, false);
        }
        return symPnt;
    }

    getArrowPoints(pnt1: Point, pnt2: Point, pnt3: Point, clockWise: boolean) {
        let midPnt = algorithm.Mid(pnt1, pnt2);
        let len = algorithm.MathDistance(midPnt, pnt3);
        let midPnt1 = algorithm.getThirdPoint(pnt3, midPnt, 0, len * 0.3, true);
        let midPnt2 = algorithm.getThirdPoint(pnt3, midPnt, 0, len * 0.5, true);
        midPnt1 = algorithm.getThirdPoint(midPnt, midPnt1, Math.PI / 2, len / 5, clockWise);
        midPnt2 = algorithm.getThirdPoint(midPnt, midPnt2, Math.PI / 2, len / 4, clockWise);
        let points = [midPnt, midPnt1, midPnt2, pnt3];
        // @ts-ignore
        let arrowPnts = this.getArrowHeadPoints(points);
        if (arrowPnts && Array.isArray(arrowPnts) && arrowPnts.length > 0) {
            let _ref2 = [arrowPnts[0], arrowPnts[4]],
                neckLeftPoint = _ref2[0],
                neckRightPoint = _ref2[1];

            let tailWidthFactor =
                algorithm.MathDistance(pnt1, pnt2) / algorithm.getBaseLength(points) / 2;
            // @ts-ignore
            let bodyPnts = this.getArrowBodyPoints(
                // @ts-ignore
                points,
                neckLeftPoint,
                neckRightPoint,
                tailWidthFactor
            );
            if (bodyPnts) {
                let n = bodyPnts.length;
                let lPoints = bodyPnts.slice(0, n / 2);
                let rPoints = bodyPnts.slice(n / 2, n);
                lPoints.push(neckLeftPoint);
                rPoints.push(neckRightPoint);
                lPoints = lPoints.reverse();
                lPoints.push(pnt2);
                rPoints = rPoints.reverse();
                rPoints.push(pnt1);
                return lPoints.reverse().concat(arrowPnts, rPoints);
            }
        } else {
            throw new Error("插值出错");
        }
    }

    getArrowHeadPoints(points: Point[]) {
        let len = algorithm.getBaseLength(points);
        let headHeight = len * this.headHeightFactor;
        let headPnt = points[points.length - 1];
        let headWidth = headHeight * this.headWidthFactor;
        let neckWidth = headHeight * this.neckWidthFactor;
        let neckHeight = headHeight * this.neckHeightFactor;
        let headEndPnt = algorithm.getThirdPoint(
            points[points.length - 2],
            headPnt,
            0,
            headHeight,
            true
        );
        let neckEndPnt = algorithm.getThirdPoint(
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
        return [neckLeft, headLeft, headPnt, headRight, neckRight];
    }

    getArrowBodyPoints(points: Point[], neckLeft: Point, neckRight: Point, tailWidthFactor: number) {
        let allLen = algorithm.wholeDistance(points);
        let len = algorithm.getBaseLength(points);
        let tailWidth = len * tailWidthFactor;
        let neckWidth = algorithm.MathDistance(neckLeft, neckRight);
        let widthDif = (tailWidth - neckWidth) / 2;
        let tempLen = 0,
            leftBodyPnts = [],
            rightBodyPnts = [];

        for (let i = 1; i < points.length - 1; i++) {
            let angle = algorithm.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2;
            tempLen += algorithm.MathDistance(points[i - 1], points[i]);
            let w = (tailWidth / 2 - (tempLen / allLen) * widthDif) / Math.sin(angle);
            let left = algorithm.getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true);
            let right = algorithm.getThirdPoint(points[i - 1], points[i], angle, w, false);
            leftBodyPnts.push(left);
            rightBodyPnts.push(right);
        }
        return leftBodyPnts.concat(rightBodyPnts);
    }

}
