import CEntity, {CEntityOption} from "./CEntity";
import * as Cesium from "cesium";
import PlotType from "./PlotType";
import PositionType from "./PositionType";
import CPoint from "@/CesiumMap/entity/CPoint";
// import PositionType from "./PositionType";


export default class CPolygon extends CEntity {

    constructor(options: CEntityOption) {
        options = {
            polygon: {
                // hierarchy: new Cesium.PolygonHierarchy(options.coordinates),
                material: new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString('#84C9EF').withAlpha(0.8)),
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
        // this.coordinatesVirtual = options.coordinates;
        // if(options.coordinatesR) this.coordinatesReal = options.coordinatesR;
        this.plotType = PlotType.POLYGON;
    }

    get geometryType() {
        return 'Polygon'
    }

    active(): void {
        super.active()
        this.children.forEach(child => child.show = true)
    }

    deactive(): void {
        super.deactive()
        this.children.forEach(child => child.show = false)
    }

    makeConstant() {
        super.makeConstant();
    }

    get coordinatesReal() {
        return this._coordinatesReal;
    }

    protected set coordinatesReal(positions: Cesium.Cartesian3[]) {
        if(positions.length < 2) return
        this._coordinatesReal = positions;
        switch(this.positionType) {
            case PositionType.Callback: {
                if (!(this.polygon!.hierarchy instanceof Cesium.CallbackProperty)) {
                    // @ts-ignore
                    this.polygon!.hierarchy = new Cesium.CallbackProperty(time => {
                        return new Cesium.PolygonHierarchy(this._coordinatesReal)
                    }, false)
                }
                break;
            }
            default: {
                this.polygon!.hierarchy = new Cesium.ConstantProperty(new Cesium.PolygonHierarchy(this._coordinatesReal));
            }
        }
    }

    updateChildren(positions: Cesium.Cartesian3[]) {    // 更新 children
        positions.forEach((position,index) => {
            if(this.children[index]) {  // 没有child创建child 有child更新位置就行
                this.children[index].coordinatesVirtual = [position]
            }else { //
                const entity = new CPoint({
                    coordinates: [position],
                    parent: this,
                    positionType: this.positionType
                    // makeCallback: (this.polygon?.hierarchy instanceof Cesium.CallbackProperty)
                })
                this.children.push(entity)
                // this.entityCollection.add(entity)
            }
            if(this.entityCollection && !this.entityCollection.getById(this.children[index].id)) {
                this.entityCollection.add(this.children[index])
            }
        })
    }

}
