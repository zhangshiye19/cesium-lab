//基本计算方法
import * as Cesium from "cesium";

class PlotUtilClass {

    HALF_PI: number;
    ZERO_TOLERANCE: number;

    constructor() {
        this.HALF_PI = Math.PI / 2;
        this.ZERO_TOLERANCE = 0.0001;
    }

    //获取第三点
    getThirdPoint(startPnt: Point, endPnt: Point, angle: number, distance: number, clockWise: boolean):Point {
        let azimuth = this.getAzimuth(startPnt, endPnt);
        let alpha = clockWise ? azimuth + angle : azimuth - angle;
        let dx = distance * Math.cos(alpha);
        let dy = distance * Math.sin(alpha);
        return [endPnt[0] + dx, endPnt[1] + dy];
    }

    //计算夹角
    getAzimuth(startPoint: Point, endPoint: Point) {
        let azimuth =  0;
        let angle = Math.asin(
            Math.abs(endPoint[1] - startPoint[1]) / this.MathDistance(startPoint, endPoint)
        );
        if (endPoint[1] >= startPoint[1] && endPoint[0] >= startPoint[0]) {
            azimuth = angle + Math.PI;
        } else if (endPoint[1] >= startPoint[1] && endPoint[0] < startPoint[0]) {
            azimuth = Math.PI * 2 - angle;
        } else if (endPoint[1] < startPoint[1] && endPoint[0] < startPoint[0]) {
            azimuth = angle;
        } else if (endPoint[1] < startPoint[1] && endPoint[0] >= startPoint[0]) {
            azimuth = Math.PI - angle;
        }
        return azimuth;
    }

    MathDistance(pnt1: Point, pnt2: Point): number {
        return Math.sqrt(Math.pow(pnt1[0] - pnt2[0], 2) + Math.pow(pnt1[1] - pnt2[1], 2));
    }

    //计算闭合曲面上的点
    isClockWise(pnt1: Point, pnt2: Point, pnt3: Point) {
        return (pnt3[1] - pnt1[1]) * (pnt2[0] - pnt1[0]) > (pnt2[1] - pnt1[1]) * (pnt3[0] - pnt1[0]);
    }

    getBisectorNormals(t: number, pnt1: Point, pnt2: Point, pnt3: Point) {
        let normal = this.getNormal(pnt1, pnt2, pnt3);
        let bisectorNormalRight: Point,
            bisectorNormalLeft: Point,
            dt: number,
            x: number,
            y: number;

        let dist = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1]);
        let uX = normal[0] / dist;
        let uY = normal[1] / dist;
        let d1 = this.MathDistance(pnt1, pnt2);
        let d2 = this.MathDistance(pnt2, pnt3);
        if (dist > this.ZERO_TOLERANCE) {
            if (this.isClockWise(pnt1, pnt2, pnt3)) {
                dt = t * d1;
                x = pnt2[0] - dt * uY;
                y = pnt2[1] + dt * uX;
                bisectorNormalRight = [x, y];
                dt = t * d2;
                x = pnt2[0] + dt * uY;
                y = pnt2[1] - dt * uX;
                bisectorNormalLeft = [x, y];
            } else {
                dt = t * d1;
                x = pnt2[0] + dt * uY;
                y = pnt2[1] - dt * uX;
                bisectorNormalRight = [x, y];
                dt = t * d2;
                x = pnt2[0] - dt * uY;
                y = pnt2[1] + dt * uX;
                bisectorNormalLeft = [x, y];
            }
        } else {
            x = pnt2[0] + t * (pnt1[0] - pnt2[0]);
            y = pnt2[1] + t * (pnt1[1] - pnt2[1]);
            bisectorNormalRight = [x, y];
            x = pnt2[0] + t * (pnt3[0] - pnt2[0]);
            y = pnt2[1] + t * (pnt3[1] - pnt2[1]);
            bisectorNormalLeft = [x, y];
        }
        return [bisectorNormalRight, bisectorNormalLeft];
    }

    getCubicValue(t: number, startPnt: Point, cPnt1: Point, cPnt2: Point, endPnt: Point) {
        t = Math.max(Math.min(t, 1), 0);
        let tp = 1 - t,
            t2 = t * t;

        let t3 = t2 * t;
        let tp2 = tp * tp;
        let tp3 = tp2 * tp;
        let x = tp3 * startPnt[0] + 3 * tp2 * t * cPnt1[0] + 3 * tp * t2 * cPnt2[0] + t3 * endPnt[0];
        let y = tp3 * startPnt[1] + 3 * tp2 * t * cPnt1[1] + 3 * tp * t2 * cPnt2[1] + t3 * endPnt[1];
        return [x, y];
    }

    getNormal(pnt1: Point, pnt2: Point, pnt3: Point) {
        let dX1 = pnt1[0] - pnt2[0];
        let dY1 = pnt1[1] - pnt2[1];
        let d1 = Math.sqrt(dX1 * dX1 + dY1 * dY1);
        dX1 /= d1;
        dY1 /= d1;
        let dX2 = pnt3[0] - pnt2[0];
        let dY2 = pnt3[1] - pnt2[1];
        let d2 = Math.sqrt(dX2 * dX2 + dY2 * dY2);
        dX2 /= d2;
        dY2 /= d2;
        let uX = dX1 + dX2;
        let uY = dY1 + dY2;
        return [uX, uY];
    }

    getArcPoints(center: Point, radius: number, startAngle: number, endAngle: number): Point[] {
        let x = null,
            y = null,
            pnts: Point[] = [],
            angleDiff = endAngle - startAngle;
        angleDiff = angleDiff < 0 ? angleDiff + Math.PI * 2 : angleDiff;
        for (let i = 0; i <= 100; i++) {
            let angle = startAngle + (angleDiff * i) / 100;
            x = center[0] + radius * Math.cos(angle);
            y = center[1] + radius * Math.sin(angle);
            pnts.push([x, y]);
        }
        return pnts;
    }

    getBaseLength(points: Point[]) {
        return Math.pow(this.wholeDistance(points), 0.99);
    }

    wholeDistance(points: Point[]) {
        let distance = 0;
        let that = this;
        if (points && Array.isArray(points) && points.length > 0) {
            points.forEach(function (item, index) {
                if (index < points.length - 1) {
                    distance += that.MathDistance(item, points[index + 1]);
                }
            });
        }
        return distance;
    }

    // getArrowHeadPoints(obj) {
    //     if (!obj) return [];
    //     let points = obj.points;
    //     let tailLeft = obj.tailLeft;
    //     let tailRight = obj.tailRight;
    //     let headTailFactor = obj.headTailFactor;
    //     let neckWidthFactor = obj.neckWidthFactor;
    //     let neckHeightFactor = obj.neckHeightFactor;
    //     let headWidthFactor = obj.headWidthFactor;
    //     let headHeightFactor = obj.headHeightFactor;
    //     let len = this.getBaseLength(points);
    //     let headHeight = len * headHeightFactor;
    //     let headPnt = points[points.length - 1];
    //     len = this.MathDistance(headPnt, points[points.length - 2]);
    //     let tailWidth = this.MathDistance(tailLeft, tailRight);
    //     if (headHeight > tailWidth * headTailFactor) {
    //         headHeight = tailWidth * headTailFactor;
    //     }
    //     let headWidth = headHeight * headWidthFactor;
    //     let neckWidth = headHeight * neckWidthFactor;
    //     headHeight = headHeight > len ? len : headHeight;
    //     let neckHeight = headHeight * neckHeightFactor;
    //     let headEndPnt = this.getThirdPoint(points[points.length - 2], headPnt, 0, headHeight, true);
    //     let neckEndPnt = this.getThirdPoint(points[points.length - 2], headPnt, 0, neckHeight, true);
    //     let headLeft = this.getThirdPoint(headPnt, headEndPnt, this.HALF_PI, headWidth, false);
    //     let headRight = this.getThirdPoint(headPnt, headEndPnt, this.HALF_PI, headWidth, true);
    //     let neckLeft = this.getThirdPoint(headPnt, neckEndPnt, this.HALF_PI, neckWidth, false);
    //     let neckRight = this.getThirdPoint(headPnt, neckEndPnt, this.HALF_PI, neckWidth, true);
    //     return [neckLeft, headLeft, headPnt, headRight, neckRight];
    // }
    //
    // getTailPoints(obj) {
    //     if (!obj) return;
    //     let points = obj.points;
    //     let tailWidthFactor = obj.tailWidthFactor;
    //     let swallowTailFactor = obj.swallowTailFactor;
    //     let allLen = this.getBaseLength(points);
    //     let tailWidth = allLen * tailWidthFactor;
    //     let tailLeft = this.getThirdPoint(points[1], points[0], this.HALF_PI, tailWidth, false);
    //     let tailRight = this.getThirdPoint(points[1], points[0], this.HALF_PI, tailWidth, true);
    //     let len = tailWidth * swallowTailFactor;
    //     let swallowTailPnt = this.getThirdPoint(points[1], points[0], 0, len, true);
    //     return [tailLeft, swallowTailPnt, tailRight];
    // }
    //
    // getArrowBodyPoints(points, neckLeft, neckRight, tailWidthFactor) {
    //     let allLen = this.wholeDistance(points);
    //     let len = this.getBaseLength(points);
    //     let tailWidth = len * tailWidthFactor;
    //     let neckWidth = this.MathDistance(neckLeft, neckRight);
    //     let widthDif = (tailWidth - neckWidth) / 2;
    //     let tempLen = 0,
    //         leftBodyPnts = [],
    //         rightBodyPnts = [];
    //
    //     for (let i = 1; i < points.length - 1; i++) {
    //         let angle = this.getAngleOfThreePoints(points[i - 1], points[i], points[i + 1]) / 2;
    //         tempLen += this.MathDistance(points[i - 1], points[i]);
    //         let w = (tailWidth / 2 - (tempLen / allLen) * widthDif) / Math.sin(angle);
    //         let left = this.getThirdPoint(points[i - 1], points[i], Math.PI - angle, w, true);
    //         let right = this.getThirdPoint(points[i - 1], points[i], angle, w, false);
    //         leftBodyPnts.push(left);
    //         rightBodyPnts.push(right);
    //     }
    //     return leftBodyPnts.concat(rightBodyPnts);
    // }

    getAngleOfThreePoints(pntA: Point, pntB: Point, pntC: Point) {
        let angle = this.getAzimuth(pntB, pntA) - this.getAzimuth(pntB, pntC);
        return angle < 0 ? angle + Math.PI * 2 : angle;
    }

    getQBSplinePoints(points: Point[]): Point[] {
        if (points.length <= 2) {
            return points;
        } else {
            let n = 2,
                bSplinePoints: Point[] = [];

            let m = points.length - n - 1;
            bSplinePoints.push(points[0]);
            for (let i = 0; i <= m; i++) {
                for (let t = 0; t <= 1; t += 0.05) {
                    let x = 0,
                        y = 0;

                    for (let k = 0; k <= n; k++) {
                        let factor = this.getQuadricBSplineFactor(k, t);
                        x += factor * points[i + k][0];
                        y += factor * points[i + k][1];
                    }
                    bSplinePoints.push([x, y]);
                }
            }
            bSplinePoints.push(points[points.length - 1]);
            return bSplinePoints;
        }
    }

    getQuadricBSplineFactor(k: number, t: number) {
        let res = 0;
        if (k === 0) {
            res = Math.pow(t - 1, 2) / 2;
        } else if (k === 1) {
            res = (-2 * Math.pow(t, 2) + 2 * t + 1) / 2;
        } else if (k === 2) {
            res = Math.pow(t, 2) / 2;
        }
        return res;
    }

    Mid(point1: Point, point2: Point): Point {
        return [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2];
    }

    getCircleCenterOfThreePoints(point1: Point, point2: Point, point3: Point) {
        let pntA: Point = [(point1[0] + point2[0]) / 2, (point1[1] + point2[1]) / 2];
        let pntB: Point = [pntA[0] - point1[1] + point2[1], pntA[1] + point1[0] - point2[0]];
        let pntC: Point = [(point1[0] + point3[0]) / 2, (point1[1] + point3[1]) / 2];
        let pntD: Point = [pntC[0] - point1[1] + point3[1], pntC[1] + point1[0] - point3[0]];
        return this.getIntersectPoint(pntA, pntB, pntC, pntD);
    }

    getIntersectPoint(pntA: Point, pntB: Point, pntC: Point, pntD: Point): Point {
        if (pntA[1] === pntB[1]) {
            let _f = (pntD[0] - pntC[0]) / (pntD[1] - pntC[1]);
            let _x = _f * (pntA[1] - pntC[1]) + pntC[0];
            let _y = pntA[1];
            return [_x, _y];
        }
        if (pntC[1] === pntD[1]) {
            let _e = (pntB[0] - pntA[0]) / (pntB[1] - pntA[1]);
            let _x2 = _e * (pntC[1] - pntA[1]) + pntA[0];
            let _y2 = pntC[1];
            return [_x2, _y2];
        }
        let e = (pntB[0] - pntA[0]) / (pntB[1] - pntA[1]);
        let f = (pntD[0] - pntC[0]) / (pntD[1] - pntC[1]);
        let y = (e * pntA[1] - pntA[0] - f * pntC[1] + pntC[0]) / (e - f);
        let x = e * y - e * pntA[1] + pntA[0];
        return [x, y];
    }

    getBezierPoints(points: Point[]):Point[] {
        if (points.length <= 2) {
            return points;
        } else {
            let bezierPoints:Point[] = [];
            let n = points.length - 1;
            for (let t = 0; t <= 1; t += 0.01) {
                let x = 0,
                    y = 0;

                for (let index = 0; index <= n; index++) {
                    let factor = this.getBinomialFactor(n, index);
                    let a = Math.pow(t, index);
                    let b = Math.pow(1 - t, n - index);
                    x += factor * a * b * points[index][0];
                    y += factor * a * b * points[index][1];
                }
                bezierPoints.push([x, y]);
            }
            // bezierPoints.push(points[n]);
            return bezierPoints;
        }
    }

    getFactorial(n: number) {
        let result = 1;
        switch (n) {
            case 0:
            case  1:
                result = 1;
                break;
            case 2:
                result = 2;
                break;
            case 3:
                result = 6;
                break;
            case 24:
                result = 24;
                break;
            case 5:
                result = 120;
                break;
            default:
                for (let i = 1; i <= n; i++) {
                    result *= i;
                }
                break;
        }
        return result;
    }

    getBinomialFactor(n: number, index: number) {
        return this.getFactorial(n) / (this.getFactorial(index) * this.getFactorial(n - index));
    }



    getCartesianFromScreen(viewer: Cesium.Viewer,wPosition: Cesium.Cartesian2)  {
        let cartesian;
        // if(viewer.scene.pickPositionSupported) {
        //     cartesian = viewer.scene.pickPosition(wPosition)
        // }else {
        //     if(Cesium.defined(viewer.terrainProvider)) {
        //         const ray = viewer.camera.getPickRay(wPosition);
        //         if(ray) {
        //             cartesian = viewer.scene.globe.pick(ray,viewer.scene)
        //         }
        //     }else {
        //         cartesian = viewer.camera.pickEllipsoid(wPosition)
        //     }
        // }

        // pickPosition不管用了
        const ray = viewer.camera.getPickRay(wPosition);
        if(ray) {
            cartesian = viewer.scene.globe.pick(ray,viewer.scene)
        }
        // console.log('事件结果',cartesian)
        return cartesian;
    }
}

//外部使用，单例模式
export let plotUtil = new PlotUtilClass();
export type Point = [number, number] | [number, number, number]