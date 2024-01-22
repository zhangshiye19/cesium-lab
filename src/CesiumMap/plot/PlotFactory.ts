import CEntity from "@/CesiumMap/entity/CEntity";
import {cartesians2lonlats, lonlats2cartesians} from "@/CesiumMap/entity/marsutils/pointconvert";
import {type Point} from "@/CesiumMap/entity/core/algorithm";
import {getEntityFromType} from "@/CesiumMap/entity/PlotType";
import PositionType from "@/CesiumMap/entity/PositionType";

export function loadEntityFromJsonObj(obj: any): CEntity | undefined {
    if (!obj.hasOwnProperty('properties') ||
        !obj.properties.hasOwnProperty("type") ||
        !obj.properties.hasOwnProperty('points')) {
        return;   //    没有值，无法转换
    }
    const points: Point[] = obj['properties']['points'];
    const pointsR: Point[] = obj['geometry']['coordinates'];
    return getEntityFromType(obj['properties']['type'],{
        coordinates: lonlats2cartesians(points),
        positionType: PositionType.Callback,
        coordinatesActual: lonlats2cartesians(pointsR)
    });
}

export function saveEntityToJsonObj(entity: CEntity) {
    const obj: any = {};
    obj['type'] = 'Feature';

    obj['geometry'] = {
        "type": entity.geometryType,
        "coordinates": cartesians2lonlats(entity.coordinatesReal)
    }
    obj['properties'] = {
        "type": entity.plotType,
        "points": cartesians2lonlats(entity.coordinatesVirtual)
    }

    return obj
}
