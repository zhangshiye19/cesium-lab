import * as Cesium from 'cesium';
import CEntity from "@/CesiumMap/entity/CEntity";
import CesiumMap from "@/CesiumMap/CesiumMap";
import utils from "@/CesiumMap/entity/core/utils";

export default class PlotEdit {
    static instance: PlotEdit;

    readonly eventStartEdit: Cesium.Event;
    readonly eventEndEdit: Cesium.Event;
    private editingEntity: CEntity | undefined;
    private handle: Cesium.ScreenSpaceEventHandler | undefined;
    private viewer: Cesium.Viewer;
    private pressed: boolean;
    private selectedAnchorPoint: CEntity | undefined;

    constructor(viewer: Cesium.Viewer) {
        this.viewer = viewer;
        this.pressed = false;

        this.eventStartEdit = new Cesium.Event()
        this.eventEndEdit = new Cesium.Event()
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
            if (this.editingEntity && this.selectedAnchorPoint) { // @ts-ignore
                this.eventEndEdit.raiseEvent(this.editingEntity)    // 鼠标释放事件
            }
            // this.deactive()
        }, Cesium.ScreenSpaceEventType.LEFT_UP)
        // 鼠标按下
        this.handle.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
            this.pressed = true;
            this.selectedAnchorPoint = this.viewer.scene.pick(event.position)?.id;
            if(!this.selectedAnchorPoint) {
                this.deactive()
            }else {
                // @ts-ignore
                this.eventStartEdit.raiseEvent(this.editingEntity)  // 正在编辑的Entity
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
        // 鼠标移动
        this.handle.setInputAction((event: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
            // console.log(this.pressed,this.selectedAnchorPoint,this.editingEntity)
            const cartesian = utils.getCartesianFromScreen(this.viewer, event.endPosition);
            if (this.pressed && cartesian && this.editingEntity && this.selectedAnchorPoint) {  // 鼠标按下
                const coordV = this.editingEntity.coordinatesVirtual;
                if(this.editingEntity.children.get('anchor')) {
                    const index = this.editingEntity.children.get('anchor')!.entities.findIndex(entity => entity.id === this.selectedAnchorPoint?.id);
                    if(index !== -1) {
                        coordV[index] = cartesian;
                        this.editingEntity.coordinatesVirtual = coordV;
                    }
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
