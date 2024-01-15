import CEntity, {CEntityOption} from "@/CesiumMap/entity/CEntity";
import * as Cesium from "cesium";
// import PositionType from "./PositionType";


export default class CPolygon extends CEntity {

    constructor(options: CEntityOption) {
        options = {
            polygon: {
                // hierarchy: new Cesium.PolygonHierarchy(options.coordinates),
                material: new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString('#91caff').withAlpha(0.8)),
                // outline: true,
                // outlineColor: Cesium.Color.fromCssColorString('#91caff'),
                // outlineWidth: 10,
                // height: 0,
                // classificationType: ClassificationType.CESIUM_3D_TILE
            },
            ...options
        }
        super(options);
        // this.updatePosition(options.coordinates)
        this.coordinatesVirtual = options.coordinates;
    }

    active(): void {
        this.children.forEach(child => child.show = true)
    }

    deactive(): void {
        this.children.forEach(child => child.show = false)
    }

    makeCallback() {
        super.makeCallback()
        this.polygon!.hierarchy = new Cesium.CallbackProperty(time => {
            return new Cesium.PolygonHierarchy(this.coordinatesReal)
        }, false)
        // this.children.forEach(child => child.makeCallback())

        // super.makeCallback();
    }

    updateChildren(positions: Cesium.Cartesian3[]) {    // 更新 children
        // super.updateChildren(positions);
        if (Cesium.defined(this.entityCollection)) { // 需要更新
            positions.forEach((position,index) => {
                if(this.children[index]) {  // 没有child创建child 有child更新位置就行
                    this.children[index].coordinatesVirtual = [position]
                }else { //
                    const entity = new CEntity({
                        coordinates: [position],
                        parent: this,
                        point: {
                            disableDepthTestDistance: Number.MAX_VALUE,
                            pixelSize: 10
                        },
                        positionType: this.positionType
                        // makeCallback: (this.polygon?.hierarchy instanceof Cesium.CallbackProperty)
                    })
                    this.children.push(entity)
                    this.entityCollection.add(entity)
                }
            })
        }
    }

    updatePosition(positions: Cesium.Cartesian3[]) {
        super.updatePosition(positions);

        this.coordinatesReal = positions;
        if (this.polygon!.hierarchy instanceof Cesium.ConstantProperty) {
            this.polygon!.hierarchy = new Cesium.ConstantProperty(new Cesium.PolygonHierarchy(this.coordinatesReal))
        }
    }
}
