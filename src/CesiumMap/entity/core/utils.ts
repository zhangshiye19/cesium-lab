import Cesium from "cesium";

function getCartesianFromScreen(viewer: Cesium.Viewer, wPosition: Cesium.Cartesian2) {
    let cartesian;

    // pickPosition不管用了
    const ray = viewer.camera.getPickRay(wPosition);
    if (ray) {
        cartesian = viewer.scene.globe.pick(ray, viewer.scene)
    }
    // console.log('事件结果',cartesian)
    return cartesian;
}

const utils = {
    getCartesianFromScreen
}

export default utils
