import {CEntityOption} from "@/CesiumMap/entity/CEntity";
import PlotType from "@/CesiumMap/entity/PlotType";
import * as Cesium from "cesium";
import { Point} from "@/CesiumMap/entity/core/PlotUtils";
import * as pointconvert from '@/CesiumMap/entity/util/pointconvert'
import CPolygon from "@/CesiumMap/entity/CPolygon";
import * as plotUtil from '../core/PlotUtils'

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
        super.mapToCoordinates(positions);

        this.coordinatesReal = this.getGeometry(positions)
    }


    getGeometry(positions: Cesium.Cartesian3[]): Cesium.Cartesian3[] {
        if(positions.length < 3) {
            return []
        }
        //@ts-ignore
        var pnts:Point[] = pointconvert.cartesians2mercators(positions);

        var _ref = [pnts[0], pnts[1], pnts[2]];
        var pnt1:Point = _ref[0];
        var pnt2 = _ref[1];
        var pnt3 = _ref[2];
        var count = positions.length;
        var tempPoint4;
        var connPoint;
        if (count === 3) {
            // @ts-ignore
            tempPoint4 = this.getTempPoint4(pnt1, pnt2, pnt3);
            connPoint = plotUtil.Mid(pnt1, pnt2);
        } else if (count === 4) {
            tempPoint4 = pnts[3];
            connPoint = plotUtil.Mid(pnt1, pnt2);
        } else {
            tempPoint4 = pnts[3];
            connPoint = pnts[4];
        }
        var leftArrowPnts: Point[] = [],
            rightArrowPnts: Point[] = [];

        if (plotUtil.isClockWise(pnt1, pnt2, pnt3)) {
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
        var m = leftArrowPnts.length;
        var t = (m - 5) / 2;
        var llBodyPnts = leftArrowPnts.slice(0, t);
        var lArrowPnts = leftArrowPnts.slice(t, t + 5);
        var lrBodyPnts = leftArrowPnts.slice(t + 5, m);
        var rlBodyPnts = rightArrowPnts.slice(0, t);
        var rArrowPnts = rightArrowPnts.slice(t, t + 5);
        var rrBodyPnts = rightArrowPnts.slice(t + 5, m);
        rlBodyPnts = plotUtil.getBezierPoints(rlBodyPnts);
        var bodyPnts = plotUtil.getBezierPoints(rrBodyPnts.concat(llBodyPnts.slice(1)));
        lrBodyPnts = plotUtil.getBezierPoints(lrBodyPnts);
        var newPnts = rlBodyPnts.concat(rArrowPnts, bodyPnts, lArrowPnts, lrBodyPnts);

        var returnArr = pointconvert.mercators2cartesians(newPnts);
        return returnArr;
    }

    getTempPoint4(linePnt1: Point, linePnt2: Point, point: Point) {
        var midPnt = plotUtil.Mid(linePnt1, linePnt2);
        var len = plotUtil.MathDistance(midPnt, point);
        var angle = plotUtil.getAngleOfThreePoints(linePnt1, midPnt, point);
        var symPnt = undefined,
            distance1 = undefined,
            distance2 = undefined,
            mid = undefined;

        if (angle < Math.PI / 2) {
            distance1 = len * Math.sin(angle);
            distance2 = len * Math.cos(angle);
            mid = plotUtil.getThirdPoint(linePnt1, midPnt, Math.PI / 2, distance1, false);
            symPnt = plotUtil.getThirdPoint(midPnt, mid, Math.PI / 2, distance2, true);
        } else if (angle >= Math.PI / 2 && angle < Math.PI) {
            distance1 = len * Math.sin(Math.PI - angle);
            distance2 = len * Math.cos(Math.PI - angle);
            mid = plotUtil.getThirdPoint(linePnt1, midPnt, Math.PI / 2, distance1, false);
            symPnt = plotUtil.getThirdPoint(midPnt, mid, Math.PI / 2, distance2, false);
        } else if (angle >= Math.PI && angle < Math.PI * 1.5) {
            distance1 = len * Math.sin(angle - Math.PI);
            distance2 = len * Math.cos(angle - Math.PI);
            mid = plotUtil.getThirdPoint(linePnt1, midPnt, Math.PI / 2, distance1, true);
            symPnt = plotUtil.getThirdPoint(midPnt, mid, Math.PI / 2, distance2, true);
        } else {
            distance1 = len * Math.sin(Math.PI * 2 - angle);
            distance2 = len * Math.cos(Math.PI * 2 - angle);
            mid = plotUtil.getThirdPoint(linePnt1, midPnt, Math.PI / 2, distance1, true);
            symPnt = plotUtil.getThirdPoint(midPnt, mid, Math.PI / 2, distance2, false);
        }
        return symPnt;
    }
    getArrowPoints(pnt1: Point, pnt2: Point, pnt3: Point, clockWise: boolean) {
        var midPnt = plotUtil.Mid(pnt1, pnt2);
        var len = plotUtil.MathDistance(midPnt, pnt3);
        var midPnt1 = plotUtil.getThirdPoint(pnt3, midPnt, 0, len * 0.3, true);
        var midPnt2 = plotUtil.getThirdPoint(pnt3, midPnt, 0, len * 0.5, true);
        midPnt1 = plotUtil.getThirdPoint(midPnt, midPnt1, Math.PI / 2, len / 5, clockWise);
        midPnt2 = plotUtil.getThirdPoint(midPnt, midPnt2, Math.PI / 2, len / 4, clockWise);
        var points = [midPnt, midPnt1, midPnt2, pnt3];
        // @ts-ignore
        var arrowPnts = this.getArrowHeadPoints(points);
        if (arrowPnts && Array.isArray(arrowPnts) && arrowPnts.length > 0) {
            var _ref2 = [arrowPnts[0], arrowPnts[4]],
                neckLeftPoint = _ref2[0],
                neckRightPoint = _ref2[1];

            var tailWidthFactor =
                plotUtil.MathDistance(pnt1, pnt2) / plotUtil.getBaseLength(points) / 2;
            // @ts-ignore
            var bodyPnts = this.getArrowBodyPoints(
                // @ts-ignore
                points,
                neckLeftPoint,
                neckRightPoint,
                tailWidthFactor
            );
            if (bodyPnts) {
                var n = bodyPnts.length;
                var lPoints = bodyPnts.slice(0, n / 2);
                var rPoints = bodyPnts.slice(n / 2, n);
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
        var len = plotUtil.getBaseLength(points);
        var headHeight = len * this.headHeightFactor;
        var headPnt = points[points.length - 1];
        var headWidth = headHeight * this.headWidthFactor;
        var neckWidth = headHeight * this.neckWidthFactor;
        var neckHeight = headHeight * this.neckHeightFactor;
        var headEndPnt = plotUtil.getThirdPoint(
            points[points.length - 2],
            headPnt,
            0,
            headHeight,
            true
        );
        var neckEndPnt = plotUtil.getThirdPoint(
            points[points.length - 2],
            headPnt,
            0,
            neckHeight,
            true
        );
        var headLeft = plotUtil.getThirdPoint(headPnt, headEndPnt, Math.PI / 2, headWidth, false);
        var headRight = plotUtil.getThirdPoint(headPnt, headEndPnt, Math.PI / 2, headWidth, true);
        var neckLeft = plotUtil.getThirdPoint(headPnt, neckEndPnt, Math.PI / 2, neckWidth, false);
        var neckRight = plotUtil.getThirdPoint(headPnt, neckEndPnt, Math.PI / 2, neckWidth, true);
        return [neckLeft, headLeft, headPnt, headRight, neckRight];
    }

    getArrowBodyPoints(points: Point[], neckLeft: Point, neckRight: Point, tailWidthFactor: number) {
        var allLen = plotUtil.wholeDistance(points);
        var len = plotUtil.getBaseLength(points);
        var tailWidth = len * tailWidthFactor;
        var neckWidth = plotUtil.MathDistance(neckLeft, neckRight);
        var widthDif = (tailWidth - neckWidth) / 2;
        var tempLen = 0,
            leftBodyPnts = [],
            rightBodyPnts = [];

        for (var i = 1; i < points.length - 1; i++) {
            var angle = plotUtil.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2;
            tempLen += plotUtil.MathDistance(points[i - 1], points[i]);
            var w = (tailWidth / 2 - (tempLen / allLen) * widthDif) / Math.sin(angle);
            var left = plotUtil.getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true);
            var right = plotUtil.getThirdPoint(points[i - 1], points[i], angle, w, false);
            leftBodyPnts.push(left);
            rightBodyPnts.push(right);
        }
        return leftBodyPnts.concat(rightBodyPnts);
    }

}
