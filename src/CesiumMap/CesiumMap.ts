import * as Cesium from 'cesium';

export default class CesiumMap {

    static instance: CesiumMap;

    private readonly viewer: Cesium.Viewer;

    constructor() {
        this.viewer = new Cesium.Viewer('cesium-container',{
            infoBox: false,
            msaaSamples: 8  // 抗锯齿
        });

        (this.viewer.cesiumWidget.creditContainer as HTMLElement).style.display = "none";
        // UTC时间+8校准
        this.viewer.clock.currentTime = Cesium.JulianDate.addHours(this.viewer.clock.currentTime, 8, new Cesium.JulianDate());

        // 地形高度检测
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer.terrainShadows = Cesium.ShadowMode.ENABLED;

        Cesium.createWorldTerrainAsync({
            requestVertexNormals: true,
            requestWaterMask: true
        }).then(terrainProvider => {
            this.viewer.terrainProvider = terrainProvider
        })

        // 抗锯齿
        this.viewer.postProcessStages.fxaa.enabled = true

        // 默认双击事件
        this.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

        // console.log(this.viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK))
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
