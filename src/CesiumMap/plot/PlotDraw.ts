import PlotType from "@/CesiumMap/entity/PlotType";
import * as Cesium from "cesium";
import CesiumMap from "@/CesiumMap/CesiumMap";
import CEntity from "@/CesiumMap/entity/CEntity";
import PlotEdit from "@/CesiumMap/plot/PlotEdit";
import {getEntityFromType} from "@/CesiumMap/plot/PlotFactory";
import PositionType from "@/CesiumMap/entity/PositionType";
import * as plotUtil from "@/CesiumMap/entity/core/PlotUtils";

export default class PlotDraw {

    static instance: PlotDraw;  // 所有绘制接口

    readonly eventDrawStart: Cesium.Event;
    readonly eventDrawEnd: Cesium.Event;
    private plottingEntity: CEntity | undefined;
    private viewer: Cesium.Viewer;
    private handleScreenSpaceEvent: Cesium.ScreenSpaceEventHandler | undefined;
    private positions: Cesium.Cartesian3[];

    // private handleLeftDoubleClick: Cesium.ScreenSpaceEventHandler | undefined;

    constructor(viewer: Cesium.Viewer) {
        this.viewer = viewer;
        this.positions = [];
        this.eventDrawEnd = new Cesium.Event();
        this.eventDrawStart = new Cesium.Event();
        PlotEdit.getInstance(); // 随时准备edit
    }

    startPlot(plotType: PlotType) {
        console.log('开始绘制')
        this.handleScreenSpaceEvent = new Cesium.ScreenSpaceEventHandler()
        let required_point_count = -1;
        this.handleScreenSpaceEvent.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const cartesian = plotUtil.getCartesianFromScreen(this.viewer, event.position);
            if (!Cesium.defined(cartesian)) {
                return;
            }
            if (Cesium.Cartesian3.equals(this.positions.slice(-1)[0], cartesian)) {   // 如果相等，直接退出
                return;
            }
            this.positions.push(cartesian)
            if (this.plottingEntity) {
                this.plottingEntity.coordinatesVirtual = this.positions
            } else {
                // required_point_count = this.plot(plotType, this.positions)
                this.plottingEntity = getEntityFromType(plotType,this.positions,PositionType.Callback);
                if(this.plottingEntity) {
                    required_point_count = this.plottingEntity.requirePointCount;    // 没有值就赋予-1，代表找不到这种类型
                    CesiumMap.viewer.entities.add(this.plottingEntity)
                    //@ts-ignore
                    this.eventDrawStart.raiseEvent(this.plottingEntity)
                }
            }
            if(required_point_count === this.positions.length || required_point_count === -1) {    // 直接通过单机结束
                this.stopPlot() // 点数足够了，直接退出
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        // 双击结束
        this.handleScreenSpaceEvent.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const cartesian = plotUtil.getCartesianFromScreen(this.viewer, event.position);
            if (!Cesium.defined(cartesian)) return;
            if (!Cesium.Cartesian3.equals(this.positions.slice(-1)[0], cartesian)) {   // 如果不相等才做处理
                this.positions.push(cartesian)
                if (this.plottingEntity) this.plottingEntity.coordinatesVirtual = this.positions
            }
            this.stopPlot()
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
        // 移动更新
        this.handleScreenSpaceEvent.setInputAction((event: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
            const cartesian = plotUtil.getCartesianFromScreen(this.viewer, event.endPosition);
            if (Cesium.defined(cartesian) && Cesium.defined(this.plottingEntity)) {
                this.plottingEntity.coordinatesVirtual = [...this.positions,cartesian]
                // this.plottingEntity?.updatePosition([...this.positions, cartesian])
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

    stopPlot() {
        console.log('结束绘制')
        //@ts-ignore
        this.eventDrawEnd.raiseEvent(this.plottingEntity)
        this.plottingEntity?.deactive()
        this.handleScreenSpaceEvent?.destroy();
        this.plottingEntity = undefined;
        this.positions = [];
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new PlotDraw(CesiumMap.viewer)
            const handle = new Cesium.ScreenSpaceEventHandler()
            handle.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
                const entity = CesiumMap.viewer.scene.pick(event.position)?.id;
                // console.log(entity.parent)
                // const cartesian = PlotUtils.getCartesianFromScreen(CesiumMap.getViewer(),event.endPosition)
                if(entity instanceof CEntity) {
                    // @ts-ignore
                    PlotEdit.getInstance().active(entity.parent || entity)
                }
            },Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
        }
        return this.instance;
    }
}
