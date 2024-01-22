import CEntity, {CEntityOption} from "./CEntity";
import * as Cesium from "cesium";
import PlotType from "./PlotType";
import PositionType from "./PositionType";
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

        this.plotType = PlotType.POLYGON;
        this.maxRequiredPointCount = Infinity;
        this.minRequiredPointCount = 3;
        this.geometryType = 'Polygon';

        this.setChildrenUpdateCallback('anchor',this.updateChildOfAnchor);
    }

    active(): void {
        super.active()
        this.children.forEach(({entities}) => entities.forEach(entity => (entity.show = true)))
    }

    deactive(): void {
        super.deactive()
        this.children.forEach(({entities}) => entities.forEach(entity => (entity.show = false)))
    }

    makeConstant() {
        super.makeConstant();
    }

    get coordinatesReal() {
        return this._coordinatesReal;
    }

    protected set coordinatesReal(positions: Cesium.Cartesian3[]) {
        if(positions.length < this.minRequiredPointCount) return
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

}
