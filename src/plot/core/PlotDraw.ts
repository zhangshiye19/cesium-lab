import PlotType from "@/plot/core/PlotType";
import * as Cesium from "cesium";
import {Point} from "@/plot/utils/utils";

export default class PlotDraw {

    static instance: PlotDraw;  // 所有绘制接口

    private plottingEntity: Cesium.Entity | undefined;

    constructor() {
    }

    plot(plotType: PlotType,positions: Point[]) {
        if(plotType === PlotType.AttackArrow) {
            this.plottingEntity = this.createPolygon(Cesium.Cartesian3.fromDegreesArray(positions.flat()))
        }

        if(this.plottingEntity) {
            // @ts-ignore
            this.plottingEntity.anchor_points = positions;  // 锚点记录
        }
    }

    createPolygon(positions: Cesium.Cartesian3[]) {
        const entity = new Cesium.Entity({
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(positions)
            }
        })
        return entity;
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new PlotDraw()
        }
        return this.instance;
    }


}
