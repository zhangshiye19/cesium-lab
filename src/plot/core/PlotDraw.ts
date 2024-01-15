import PlotType from "@/plot/core/PlotType";
import * as Cesium from "cesium";
import CesiumMap from "@/CesiumMap/CesiumMap";
import ArrowAttack from "@/CesiumMap/entity/ArrowAttack";
import CEntity from "@/CesiumMap/entity/CEntity";
import * as PlotUtils from '@/plot/utils/utils';
import PlotEdit from "@/plot/core/PlotEdit";
import PositionType from "@/CesiumMap/entity/PositionType";

export default class PlotDraw {

    static instance: PlotDraw;  // 所有绘制接口

    private plottingEntity: CEntity | undefined;
    private viewer: Cesium.Viewer;
    private handleScreenSpaceEvent: Cesium.ScreenSpaceEventHandler | undefined;
    private positions: Cesium.Cartesian3[];

    // private handleLeftDoubleClick: Cesium.ScreenSpaceEventHandler | undefined;

    constructor(viewer: Cesium.Viewer) {
        this.viewer = viewer;
        this.positions = [];
        PlotEdit.getInstance(); // 随时准备edit
    }

    plot(plotType: PlotType, positions: Cesium.Cartesian3[]) {
        if (plotType === PlotType.AttackArrow) {
            this.plottingEntity = new ArrowAttack({
                coordinates: positions,
                positionType: PositionType.Callback
                // makeCallback: true
            })
            this.viewer.entities.add(this.plottingEntity)
            // this.plottingEntity = this.createPolygon(Cesium.Cartesian3.fromDegreesArray(positions.flat()))
        }
    }

    startPlot() {
        this.handleScreenSpaceEvent = new Cesium.ScreenSpaceEventHandler()
        this.handleScreenSpaceEvent.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const cartesian = PlotUtils.getCartesianFromScreen(this.viewer, event.position);
            if (!Cesium.defined(cartesian)) {
                return;
            }
            if (Cesium.Cartesian3.equals(this.positions.slice(-1)[0], cartesian)) {   // 如果相等，直接退出
                return;
            }
            this.positions.push(cartesian)
            if (this.plottingEntity) {
                this.plottingEntity.coordinatesVirtual = this.positions
                // this.plottingEntity.coordinatesVirtual = [...this.positions, cartesian]
                // this.plottingEntity?.updatePosition([...this.positions, cartesian])
            } else {
                this.positions.length >= 2 && this.plot(PlotType.AttackArrow, this.positions)
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        // 双击结束
        this.handleScreenSpaceEvent.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            const cartesian = PlotUtils.getCartesianFromScreen(this.viewer, event.position);
            if (!Cesium.defined(cartesian)) return;
            if (!Cesium.Cartesian3.equals(this.positions.slice(-1)[0], cartesian)) {   // 如果不相等才做处理
                this.positions.push(cartesian)
                if (this.plottingEntity) this.plottingEntity.coordinatesVirtual = this.positions
                // if (this.plottingEntity) this.plottingEntity.updatePosition([...this.positions, cartesian])
            }
            // console.log(this.plottingEntity?.coordinatesVirtual)
            this.stopPlot()
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
        // 移动更新
        this.handleScreenSpaceEvent.setInputAction((event: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
            const cartesian = PlotUtils.getCartesianFromScreen(this.viewer, event.endPosition);
            if (Cesium.defined(cartesian) && Cesium.defined(this.plottingEntity)) {
                this.plottingEntity.coordinatesVirtual = [...this.positions,cartesian]
                // this.plottingEntity?.updatePosition([...this.positions, cartesian])
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

    stopPlot() {
        this.handleScreenSpaceEvent?.destroy();
        this.plottingEntity = undefined;
        this.positions = [];
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new PlotDraw(CesiumMap.getViewer())
            const handle = new Cesium.ScreenSpaceEventHandler()
            handle.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
                const entity = CesiumMap.getViewer().scene.pick(event.position).id;
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
