import * as Cesium from 'cesium';
import CesiumMap from "@/CesiumMap/CesiumMap";

class CesiumDS {
    static instance: CesiumDS;
    dss: Record<string, Cesium.DataSource>;
    viewer: Cesium.Viewer;

    constructor(viewer: Cesium.Viewer) {
        this.dss = {}
        this.viewer = viewer;
    }

    getDSById(name: string) {
        if (!this.dss.hasOwnProperty(name)) {
            this.dss[name] = new Cesium.DataSource()
            this.viewer.dataSources.add(this.dss[name]) //需要吗？
        }
        return this.dss[name];
    }

    hasDS(name: string) {
        return this.dss.hasOwnProperty(name)
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new CesiumDS(CesiumMap.viewer)
        }
        return this.instance
    }

}

export default CesiumDS.getInstance()

