import * as Cesium from "cesium";


export type CEntityOption = Cesium.Entity.ConstructorOptions & {
    makeCallback?: boolean,
    makeSampled?: boolean,
    coordinates: Cesium.Cartesian3[]
}

export default class CEntity extends Cesium.Entity {

    children: CEntity[];
    protected coordinates: Cesium.Cartesian3[]; // 自定义位置坐标，统一类型

    constructor(options: CEntityOption) {
        super(options);
        this.children = [];
        this.coordinates = options.coordinates;
        options.makeCallback && this.makeCallback()
    }

    /**
     * 更新位置
     */
    updatePosition(positions: Cesium.Cartesian3[]) {
        if (this.position instanceof Cesium.ConstantPositionProperty) {
            this.position = new Cesium.ConstantPositionProperty(positions[0])
        } else if (this.position instanceof Cesium.CallbackProperty) {
            this.coordinates = positions;
        } else if (this.position instanceof Cesium.SampledPositionProperty) {
            this.position.addSample(Cesium.JulianDate.addSeconds(Cesium.JulianDate.now(), 1, new Cesium.JulianDate()), positions[0])
        }
    }

    makeCallback() {
        // @ts-ignore
        this.position = new Cesium.CallbackProperty(time => {
            return this.coordinates[0]
        }, false)
    }

    makeConstant() {
        this.position = new Cesium.ConstantPositionProperty(this.coordinates[0])
    }

    makeSampled() {
        this.position = new Cesium.SampledPositionProperty()
    }
}
