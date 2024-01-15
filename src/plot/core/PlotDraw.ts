import PlotType from "@/plot/core/PlotType";
import * as Cesium from "cesium";
import CesiumMap from "@/CesiumMap/CesiumMap";
import ArrowAttack from "@/CesiumMap/entity/ArrowAttack";
import CEntity from "@/CesiumMap/entity/CEntity";
import * as PlotUtils from '@/plot/utils/utils';
import PlotEdit from "@/plot/core/PlotEdit";
import PositionType from "@/CesiumMap/entity/PositionType";
import ArrowDouble from "@/CesiumMap/entity/ArrowDouble";
import ArrowFine from "@/CesiumMap/entity/ArrowFine";
import SquadCombat from "@/CesiumMap/entity/SquadCombat";
import StraightArrow from "@/CesiumMap/entity/StraightArrow";
import CPolyline from "@/CesiumMap/entity/CPolyline";

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
        let required_point_count = 1;
        if (plotType === PlotType.AttackArrow) {
            this.plottingEntity = new ArrowAttack({
                coordinates: positions,
                positionType: PositionType.Callback
                // makeCallback: true
            })
            required_point_count = Infinity;  // 可以有无限多个点
            // this.plottingEntity = this.createPolygon(Cesium.Cartesian3.fromDegreesArray(positions.flat()))
        }else if(plotType === PlotType.DoubleArrow){
            this.plottingEntity = new ArrowDouble({
                coordinates: positions,
                positionType: PositionType.Callback
                // makeCallback: true
            })
            required_point_count = 5;
        }else if(plotType === PlotType.FineArrow) {
            this.plottingEntity = new ArrowFine({
                coordinates: positions,
                positionType: PositionType.Callback
            })
            required_point_count = 2;
        }else if(plotType === PlotType.SquadCombat) {
            this.plottingEntity = new SquadCombat({
                coordinates: positions,
                positionType: PositionType.Callback
            })
            required_point_count = Infinity;
        }else if(plotType === PlotType.SwallowArrow) {
            this.plottingEntity = new StraightArrow({
                coordinates: positions,
                positionType: PositionType.Callback
            })
            required_point_count = 2;
        }else if(plotType === PlotType.CommonPolyline){
            this.plottingEntity = new CPolyline({
                coordinates: positions,
                positionType: PositionType.Callback
            })
            required_point_count = Infinity;
        }

        if(this.plottingEntity) {
            this.viewer.entities.add(this.plottingEntity)
            this.plottingEntity.active()
        }
        return required_point_count;
    }

    startPlot(plotType: PlotType) {
        this.handleScreenSpaceEvent = new Cesium.ScreenSpaceEventHandler()
        let required_point_count = 1;
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
                required_point_count = this.plot(plotType, this.positions)
            }
            if(required_point_count === this.positions.length || required_point_count === -1) {    // 直接通过单机结束
                this.stopPlot()
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
        this.plottingEntity?.deactive()
        this.handleScreenSpaceEvent?.destroy();
        this.plottingEntity = undefined;
        this.positions = [];
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new PlotDraw(CesiumMap.getViewer())
            const handle = new Cesium.ScreenSpaceEventHandler()
            handle.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
                const entity = CesiumMap.getViewer().scene.pick(event.position)?.id;
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
