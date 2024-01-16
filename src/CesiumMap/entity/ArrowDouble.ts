import * as PlotUtils from "@/plot/utils/utils";
import * as Constants from '@/plot/utils/constant';
import type { Point } from "@/plot/utils/utils";
import CPolygon from "./CPolygon";
import { CEntityOption } from "./CEntity";
import * as Cesium from 'cesium';
import PositionType from "./PositionType";
import PlotType from "@/plot/core/PlotType";

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

    updatePosition(positions: Cesium.Cartesian3[]) {
        super.updatePosition(positions);

        const anchorPoints = positions.map(value => {
            return PlotUtils.cartesian2point(value)
        })
        const geometry = this.getGeometry(anchorPoints).flat();
        if (geometry.some(value => isNaN(value))) {
            return
        }
        this.coordinatesReal = Cesium.Cartesian3.fromDegreesArray(geometry)
    }

    getGeometry(anchor_points: Point[]): Point[] {
        const count = anchor_points.length;
        if (count === 0) {
            return [];
        }
        if(count === 1) {
            return new Array(3).fill(anchor_points[0])
        }else if (count === 2) {
            return [...anchor_points,anchor_points[1]];
            // this.setCoordinates([this.points]);
        }
        if (count > 2) {
            let tempPoint4: Point;
            let connPoint: Point;
            const [pnt1, pnt2, pnt3] = [anchor_points[0], anchor_points[1], anchor_points[2]];
            if (count === 3) {
                tempPoint4 = this.getTempPoint4(pnt1, pnt2, pnt3);
                connPoint = PlotUtils.Mid(pnt1, pnt2);
            } else if (count === 4) {
                tempPoint4 = anchor_points[3];
                connPoint = PlotUtils.Mid(pnt1, pnt2);
            } else {
                tempPoint4 = anchor_points[3];
                connPoint = anchor_points[4];
            }
            let leftArrowPnts: Point[];
            let rightArrowPnts: Point[];
            if (PlotUtils.isClockWise(pnt1, pnt2, pnt3)) {
                leftArrowPnts = this.getArrowPoints(pnt1, connPoint, tempPoint4, false);
                rightArrowPnts = this.getArrowPoints(connPoint, pnt2, pnt3, true);
            } else {
                leftArrowPnts = this.getArrowPoints(pnt2, connPoint, pnt3, false);
                rightArrowPnts = this.getArrowPoints(connPoint, pnt1, tempPoint4, true);
            }
            const m = leftArrowPnts.length;
            const t = (m - 5) / 2;
            const llBodyPnts = leftArrowPnts.slice(0, t);
            const lArrowPnts = leftArrowPnts.slice(t, t + 5);
            let lrBodyPnts = leftArrowPnts.slice(t + 5, m);
            let rlBodyPnts = rightArrowPnts.slice(0, t);
            const rArrowPnts = rightArrowPnts.slice(t, t + 5);
            const rrBodyPnts = rightArrowPnts.slice(t + 5, m);
            rlBodyPnts = PlotUtils.getBezierPoints(rlBodyPnts);
            const bodyPnts = PlotUtils.getBezierPoints(rrBodyPnts.concat(llBodyPnts.slice(1)));
            lrBodyPnts = PlotUtils.getBezierPoints(lrBodyPnts);
            const pnts = rlBodyPnts.concat(rArrowPnts, bodyPnts, lArrowPnts, lrBodyPnts);

            return pnts;
            // this.setCoordinates([pnts]);
        }
        return []
    }

    /**
     * 插值箭形上的点
     * @param pnt1
     * @param pnt2
     * @param pnt3
     * @param clockWise
     * @returns {Array.<T>}
     */
    getArrowPoints(pnt1: Point, pnt2: Point, pnt3: Point, clockWise: boolean): Point[] {
        const midPnt = PlotUtils.Mid(pnt1, pnt2);
        const len = PlotUtils.MathDistance(midPnt, pnt3);
        let midPnt1 = PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.3, true);
        let midPnt2 = PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.5, true);
        midPnt1 = PlotUtils.getThirdPoint(midPnt, midPnt1, Constants.HALF_PI, len / 5, clockWise);
        midPnt2 = PlotUtils.getThirdPoint(midPnt, midPnt2, Constants.HALF_PI, len / 4, clockWise);
        const points = [midPnt, midPnt1, midPnt2, pnt3];
        const arrowPnts = this.getArrowHeadPoints(points);
        if (arrowPnts && Array.isArray(arrowPnts) && arrowPnts.length > 0) {
            const [neckLeftPoint, neckRightPoint] = [arrowPnts[0], arrowPnts[4]];
            const tailWidthFactor = PlotUtils.MathDistance(pnt1, pnt2) / PlotUtils.getBaseLength(points) / 2;
            const bodyPnts = this.getArrowBodyPoints(points, neckLeftPoint, neckRightPoint, tailWidthFactor);
            if (bodyPnts) {
                const n = bodyPnts.length;
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
        }
        return []
    }

    /**
     * 插值头部点
     * @param points
     * @returns {[*,*,*,*,*]}
     */
    getArrowHeadPoints(points: Point[]): Point[] {
        const len = PlotUtils.getBaseLength(points);
        const headHeight = len * this.headHeightFactor;
        const headPnt = points[points.length - 1];
        const headWidth = headHeight * this.headWidthFactor;
        const neckWidth = headHeight * this.neckWidthFactor;
        const neckHeight = headHeight * this.neckHeightFactor;
        const headEndPnt = PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, headHeight, true);
        const neckEndPnt = PlotUtils.getThirdPoint(points[points.length - 2], headPnt, 0, neckHeight, true);
        const headLeft = PlotUtils.getThirdPoint(headPnt, headEndPnt, Constants.HALF_PI, headWidth, false);
        const headRight = PlotUtils.getThirdPoint(headPnt, headEndPnt, Constants.HALF_PI, headWidth, true);
        const neckLeft = PlotUtils.getThirdPoint(headPnt, neckEndPnt, Constants.HALF_PI, neckWidth, false);
        const neckRight = PlotUtils.getThirdPoint(headPnt, neckEndPnt, Constants.HALF_PI, neckWidth, true);
        return [neckLeft, headLeft, headPnt, headRight, neckRight];
    }

    /**
     * 插值面部分数据
     * @param points
     * @param neckLeft
     * @param neckRight
     * @param tailWidthFactor
     * @returns {Array.<*>}
     */
    getArrowBodyPoints(points: Point[], neckLeft: Point, neckRight: Point, tailWidthFactor: number): Point[] {
        const allLen = PlotUtils.wholeDistance(points);
        const len = PlotUtils.getBaseLength(points);
        const tailWidth = len * tailWidthFactor;
        const neckWidth = PlotUtils.MathDistance(neckLeft, neckRight);
        const widthDif = (tailWidth - neckWidth) / 2;
        // eslint-disable-next-line
        let tempLen = 0;
        const leftBodyPnts: Point[] = [];
        const rightBodyPnts: Point[] = [];
        for (let i = 1; i < points.length - 1; i++) {
            const angle = PlotUtils.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2;
            tempLen += PlotUtils.MathDistance(points[i - 1], points[i]);
            const w = (tailWidth / 2 - (tempLen / allLen) * widthDif) / Math.sin(angle);
            const left = PlotUtils.getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true);
            const right = PlotUtils.getThirdPoint(points[i - 1], points[i], angle, w, false);
            leftBodyPnts.push(left);
            rightBodyPnts.push(right);
        }
        return leftBodyPnts.concat(rightBodyPnts);
    }

    /**
     * 获取对称点
     * @param linePnt1
     * @param linePnt2
     * @param point
     * @returns {Point}
     */
    getTempPoint4(linePnt1: Point, linePnt2: Point, point: Point): Point {
        const midPnt = PlotUtils.Mid(linePnt1, linePnt2);
        const len = PlotUtils.MathDistance(midPnt, point);
        const angle = PlotUtils.getAngleOfThreePoints(linePnt1, midPnt, point);
        let symPnt;
        let distance1 = 0;
        let distance2 = 0;
        let mid: Point;
        if (angle < Constants.HALF_PI) {
            distance1 = len * Math.sin(angle);
            distance2 = len * Math.cos(angle);
            mid = PlotUtils.getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, false);
            symPnt = PlotUtils.getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, true);
        } else if (angle >= Constants.HALF_PI && angle < Math.PI) {
            distance1 = len * Math.sin(Math.PI - angle);
            distance2 = len * Math.cos(Math.PI - angle);
            mid = PlotUtils.getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, false);
            symPnt = PlotUtils.getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, false);
        } else if (angle >= Math.PI && angle < Math.PI * 1.5) {
            distance1 = len * Math.sin(angle - Math.PI);
            distance2 = len * Math.cos(angle - Math.PI);
            mid = PlotUtils.getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, true);
            symPnt = PlotUtils.getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, true);
        } else {
            distance1 = len * Math.sin(Math.PI * 2 - angle);
            distance2 = len * Math.cos(Math.PI * 2 - angle);
            mid = PlotUtils.getThirdPoint(linePnt1, midPnt, Constants.HALF_PI, distance1, true);
            symPnt = PlotUtils.getThirdPoint(midPnt, mid, Constants.HALF_PI, distance2, false);
        }
        return symPnt;

    }
}