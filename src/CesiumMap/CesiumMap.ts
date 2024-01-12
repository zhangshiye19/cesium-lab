import * as Cesium from 'cesium';

export default class CesiumMap {

    static instance: CesiumMap;

    viewer: Cesium.Viewer;

    constructor() {
        this.viewer = new Cesium.Viewer('cesium-container');

        this.viewer.clock.currentTime = Cesium.JulianDate.addHours(this.viewer.clock.currentTime,8,new Cesium.JulianDate())
    }

    static getViewer() {
        return this.getInstance().viewer;
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new CesiumMap()
        }

        return this.instance;
    }
}