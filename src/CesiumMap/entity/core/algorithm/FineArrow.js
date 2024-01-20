import * as Cesium from 'cesium/Build/Cesium/Cesium';
import { plotUtil } from "../PlotUtils";
import * as pointconvert from "../../../util/pointconvert";

//计算粗单尖直箭头坐标
export class FineArrow {
  constructor(opt) {
    if (!opt) opt = {};
    //影响因素
    this.headAngle = opt.headAngle || Math.PI / 8.5;
    this.neckAngle = opt.neckAngle || Math.PI / 13;
    this.tailWidthFactor = opt.tailWidthFactor || 0.1;
    this.neckWidthFactor = opt.neckWidthFactor || 0.2;
    this.headWidthFactor = opt.headWidthFactor || 0.25;
    this.neckHeightFactor = opt.neckHeightFactor || 0.85;
    this.positions = null;
    this.plotUtil = plotUtil;
  }

  startCompute(positions) {
    if (!positions) return;
    this.positions = positions;

    var pnts = pointconvert.cartesians2mercators(positions);

    var _ref = [pnts[0], pnts[1]],
      pnt1 = _ref[0],
      pnt2 = _ref[1];
    var len = this.plotUtil.getBaseLength(pnts);
    var tailWidth = len * this.tailWidthFactor;
    var neckWidth = len * this.neckWidthFactor;
    var headWidth = len * this.headWidthFactor;
    var tailLeft = this.plotUtil.getThirdPoint(pnt2, pnt1, Math.PI / 2, tailWidth, true);
    var tailRight = this.plotUtil.getThirdPoint(pnt2, pnt1, Math.PI / 2, tailWidth, false);
    var headLeft = this.plotUtil.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, false);
    var headRight = this.plotUtil.getThirdPoint(pnt1, pnt2, this.headAngle, headWidth, true);
    var neckLeft = this.plotUtil.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, false);
    var neckRight = this.plotUtil.getThirdPoint(pnt1, pnt2, this.neckAngle, neckWidth, true);
    var pList = [tailLeft, neckLeft, headLeft, pnt2, headRight, neckRight, tailRight];

    var returnArr = pointconvert.mercators2cartesians(pList);
    return returnArr;
  }
}
