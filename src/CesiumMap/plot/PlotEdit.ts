import * as Cesium from 'cesium';
import CEntity from "@/CesiumMap/entity/CEntity";
import CesiumMap from "@/CesiumMap/CesiumMap";
import utils from "@/CesiumMap/entity/core/utils";

export default class PlotEdit {
    static instance: PlotEdit;

    private editingEntity: CEntity | undefined;
    private handle: Cesium.ScreenSpaceEventHandler | undefined;
    private viewer: Cesium.Viewer;
    private pressed: boolean;
    private selectedAnchorPoint: CEntity | undefined;

    constructor(viewer: Cesium.Viewer) {
        this.viewer = viewer;
        this.pressed = false;
    }

    active(entity: CEntity) {
        this.editingEntity && this.editingEntity.deactive()
        this.editingEntity = entity;
        this.editingEntity.active();
        this.startEdit();
        this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
        this.viewer.scene.screenSpaceCameraController.enableRotate = false;
    }

    deactive() {
        this.editingEntity?.deactive();
        !this.handle?.isDestroyed() && this.handle?.destroy();
        this.editingEntity = undefined;
        this.selectedAnchorPoint = undefined;
        this.viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;
        this.viewer.scene.screenSpaceCameraController.enableRotate = true;
    }

    startEdit() {
        // 拖拽事件
        this.handle = new Cesium.ScreenSpaceEventHandler()
        // 鼠标抬起
        this.handle.setInputAction(() => {
            this.pressed = false;
            // this.deactive()
        }, Cesium.ScreenSpaceEventType.LEFT_UP)
        // 鼠标按下
        this.handle.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            this.pressed = true;
            this.selectedAnchorPoint = this.viewer.scene.pick(event.position)?.id;
            if(!this.selectedAnchorPoint) {
                this.deactive()
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
        // 鼠标移动
        this.handle.setInputAction((event: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
            // console.log(this.pressed,this.selectedAnchorPoint,this.editingEntity)
            const cartesian = utils.getCartesianFromScreen(this.viewer, event.endPosition);
            if (this.pressed && cartesian && this.editingEntity && this.selectedAnchorPoint) {  // 鼠标按下
                const coordV = this.editingEntity.coordinatesVirtual;
                const index = this.editingEntity.children.findIndex(entity => entity.id === this.selectedAnchorPoint?.id);
                if(index !== -1) {
                    coordV[index] = cartesian;
                    this.editingEntity.coordinatesVirtual = coordV;
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new PlotEdit(CesiumMap.viewer);
        }
        return this.instance;
    }
}
