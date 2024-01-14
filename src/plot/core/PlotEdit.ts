import * as Cesium from 'cesium';
import CEntity from "@/CesiumMap/entity/CEntity";
import CesiumMap from "@/CesiumMap/CesiumMap";
import ArrowAttack from "@/CesiumMap/entity/ArrowAttack";

export default class PlotEdit {
    static instance: PlotEdit;

    private editingEntity: CEntity | undefined;
    private handle: Cesium.ScreenSpaceEventHandler | undefined;
    private viewer: Cesium.Viewer;

    constructor(viewer: Cesium.Viewer) {
        this.viewer = viewer;
    }

    active(entity: CEntity) {
        if(entity instanceof ArrowAttack) {

        }
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new PlotEdit(CesiumMap.getViewer());
        }
        return this.instance;
    }
}
