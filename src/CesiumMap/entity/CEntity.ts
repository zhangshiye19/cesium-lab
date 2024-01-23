import * as Cesium from "cesium";
import PositionType from "./PositionType";
import PlotType from "./PlotType";


export type CEntityOption = Cesium.Entity.ConstructorOptions & {
    positionType?: PositionType
    coordinates: Cesium.Cartesian3[]
    coordinatesActual?: Cesium.Cartesian3[]
}

export type CEntityUpdateCallbackType = (child: CEntity[], options: CEntityOption) => CEntity[]

export default class CEntity extends Cesium.Entity {

    plotType: PlotType;
    maxRequiredPointCount: number;
    minRequiredPointCount: number;
    geometryType: string;
    children: Map<string, { entities: CEntity[], updateCallback: CEntityUpdateCallbackType }>;
    protected _coordinatesReal: Cesium.Cartesian3[]; // 不能和options里面名字重名字，real可以，没有设置set属性
    protected _coordinatesVirtual: Cesium.Cartesian3[];
    protected positionType: PositionType;

    constructor(options: CEntityOption) {
        super(options);
        this.plotType = PlotType.ENTITY;
        this.maxRequiredPointCount = Infinity;  // 构成此实体最多能用多少个点
        this.minRequiredPointCount = 1; // 构成此实体最少要多少个点
        this.children = new Map();
        this._coordinatesVirtual = [];
        this._coordinatesReal = options.coordinatesActual ?? options.coordinates;
        this.positionType = options.positionType ?? PositionType.Constant;
        this.geometryType = 'Entity';

        this.makePositionType(this.positionType);   //默认没有任何映射关系
        if (options.coordinatesActual) this.coordinatesReal = options.coordinatesActual;    // 默认加载coordinatesActual，涉及一个映射
    }

    makePositionType(positionType: PositionType) {
        this.positionType = positionType;   // 再次赋值
        switch (positionType) {
            case PositionType.Callback: {
                this.makeCallback()
                break;
            }
            case PositionType.Sampled: {
                this.makeSampled()
                break;
            }
            case PositionType.Constant:
            default: {  // 默认行为 Constant
                this.makeConstant()
            }
        }
    }

    active() {
        this.updateChildren()
    }

    deactive() {
        this.updateChildren()
    }

    protected updateChildren() {
        this.children.forEach(({entities, updateCallback}, key) => {
            const updatedEntities = updateCallback(entities, {
                coordinates: this.coordinatesVirtual,
                coordinatesActual: this.coordinatesVirtual,
                positionType: this.positionType
            })
            const removedEntities: CEntity[] = [];
            const mergedEntities: CEntity[] = []

            // entity 比较
            let i = 0, j = 0;
            while (i < entities.length && j < updatedEntities.length) {  // 遍历共同部分
                if (entities[i].id !== updatedEntities[j].id) {  // 同一个entity，不做任何修改
                    removedEntities.push(entities[i])
                }
                mergedEntities.push(updatedEntities[j])
                i++;
                j++;
            }
            while (i < entities.length) {    // 锚点变少
                removedEntities.push(entities[i])
                i++;
            }
            while(j < updatedEntities.length) { // 锚点变多
                entities.push(updatedEntities[j])
                j++;
            }

            removedEntities.forEach(entity => {
                if(this.entityCollection && this.entityCollection.getById(entity.id)) {
                    this.entityCollection.removeById(entity.id)
                }
            })
            mergedEntities.forEach(entity => {
                entity.parent = this;   // parent关系赋予
                if(this.entityCollection && !this.entityCollection.getById(entity.id)) {    // 没有就加入
                    this.entityCollection.add(entity)
                }
            })
            this.children.get(key)  // 赋予新value
        })
    }

    set coordinatesVirtual(coordinates: Cesium.Cartesian3[]) {
        this._coordinatesVirtual = coordinates
        this.coordinatesReal = this.mapToCoordinates(coordinates)
        this.updateChildren()
    }

    get coordinatesVirtual() {
        return this._coordinatesVirtual;
    }

    get coordinatesReal() {
        return this._coordinatesReal;
    }

    protected set coordinatesReal(positions: Cesium.Cartesian3[]) {
        this._coordinatesReal = positions;
        switch (this.positionType) {
            case PositionType.Callback: {
                if (!(this.position instanceof Cesium.CallbackProperty)) {
                    // @ts-ignore
                    this.position = new Cesium.CallbackProperty(time => {
                        return this._coordinatesReal[0]
                    }, false)
                }
                break;
            }
            case PositionType.Sampled: {
                if (!(this.position instanceof Cesium.SampledPositionProperty)) {   // 样本位置
                    this.position = new Cesium.SampledPositionProperty()
                }
                //@ts-ignore
                this.position.addSample(Cesium.JulianDate.addSeconds(Cesium.JulianDate.now(), 1, new Cesium.JulianDate()), positions[0])
                break;
            }
            default: {
                this.position = new Cesium.ConstantPositionProperty(this._coordinatesReal[0])
            }
        }
    }

    /**
     * 更新位置
     */
    protected mapToCoordinates(positions: Cesium.Cartesian3[]): Cesium.Cartesian3[] {
        // this.coordinatesReal = positions;
        return positions;
    }

    setChildrenUpdateCallback(childGroup: string, callback: CEntityUpdateCallbackType) {
        let children = this.children.get(childGroup)
        if (!children) {
            children = {entities: [], updateCallback: callback}
        } else {
            children.updateCallback = callback
        }
        this.children.set(childGroup, children)
    }

    // 如果要可编辑，必须要实现此方法
    updateChildOfAnchor(entities: CEntity[], options: CEntityOption): CEntity[] {
        options.coordinates.forEach((position, index) => {
            if (entities[index]) {  // 没有child创建child 有child更新位置就行
                entities[index].coordinatesVirtual = [position]
            } else { //
                const entity = new CEntity({    // 递归引用了
                    point: {
                        pixelSize: 10,
                        disableDepthTestDistance: Number.MAX_VALUE
                    },
                    coordinates: [position],
                    positionType: options.positionType
                    // makeCallback: (this.polygon?.hierarchy instanceof Cesium.CallbackProperty)
                })
                entities.push(entity)
                // this.entityCollection.add(entity)
            }
        })

        return entities
    }

    makeCallback() {
        this.positionType = PositionType.Callback;
        this.children.forEach(({entities}) => entities.forEach(entity => entity.makeCallback()))
    }

    makeConstant() {
        this.positionType = PositionType.Constant;
        this.children.forEach(({entities}) => entities.forEach(entity => entity.makeConstant()))
    }

    makeSampled() {
        this.positionType = PositionType.Sampled
        this.children.forEach(({entities}) => entities.forEach(entity => entity.makeSampled()))
    }
}
