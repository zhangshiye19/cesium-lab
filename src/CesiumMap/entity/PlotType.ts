import CEntity, {CEntityOption} from "@/CesiumMap/entity/CEntity";
import ArrowAttack from "@/CesiumMap/entity/Arrow/ArrowAttack";
import ArrowDouble from "@/CesiumMap/entity/Arrow/ArrowDouble";
import ArrowFine from "@/CesiumMap/entity/Arrow/ArrowFine";
import SquadCombat from "@/CesiumMap/entity/Arrow/SquadCombat";
import StraightArrow from "@/CesiumMap/entity/Arrow/StraightArrow";
import CPolyline from "@/CesiumMap/entity/CPolyline";
import GatheringPlace from "@/CesiumMap/entity/Polygon/GatheringPlace";
import CloseCurve from "@/CesiumMap/entity/Polygon/CloseCurve";
import Lune from "@/CesiumMap/entity/Polygon/Lune";
import Sector from "@/CesiumMap/entity/Polygon/Sector";
import SquadCombatSwallowTailed from "@/CesiumMap/entity/Arrow/SquadCombatSwallowTailed";
import ArrowAttackSwallowTailed from "@/CesiumMap/entity/Arrow/ArrowAttackSwallowTailed";
import AssaultDirection from "@/CesiumMap/entity/Arrow/AssaultDirection";
import {Arc} from "@/CesiumMap/entity/Arc/Arc";
import Circle from "@/CesiumMap/entity/Circle/Circle";
import Ellipse from "@/CesiumMap/entity/Circle/Ellipse";
import Curve from "@/CesiumMap/entity/Polyline/Curve";
import FreeHandLine from "@/CesiumMap/entity/Polyline/FreeHandLine";
import Rectinclined1 from "@/CesiumMap/entity/Polygon/Rectinclined";
import Rectinclined2 from "@/CesiumMap/entity/Polygon/Rectinclined2";
import Rectangle from "@/CesiumMap/entity/Polygon/Rectangle";
import CPoint from "@/CesiumMap/entity/CPoint";
import RectFlag from "@/CesiumMap/entity/Flag/RectFlag";
import CPolygon from "@/CesiumMap/entity/CPolygon";

enum PlotType {
    AttackArrow = "AttackArrow",
    TEXTAREA = 'TextArea', // 文本标绘（特殊）
    RECTINCLINED1 = 'RectInclined1',
    RECTINCLINED2 = 'RectInclined2',
    ARC = 'Arc',
    CURVE = 'Curve',
    GATHERING_PLACE = 'GatheringPlace',
    POLYLINE = 'Polyline',
    FREEHANDLINE = 'FreeHandLine',
    POINT = 'Point',
    PENNANT = 'Pennant',
    RECTANGLE = 'RectAngle',
    CIRCLE = 'Circle',
    ELLIPSE = 'Ellipse',
    LUNE = 'Lune',
    SECTOR = 'Sector',
    CLOSED_CURVE = 'ClosedCurve',
    POLYGON = 'Polygon',
    FREE_POLYGON = 'FreePolygon',
    DOUBLE_ARROW = 'DoubleArrow',
    STRAIGHT_ARROW = 'StraightArrow',
    FINE_ARROW = 'FineArrow',
    ASSAULT_DIRECTION = 'AssaultDirection',
    TAILED_ATTACK_ARROW = 'TailedAttackArrow',
    SQUAD_COMBAT = 'SquadCombat',
    TAILED_SQUAD_COMBAT = 'TailedSquadCombat',
    RECTFLAG = 'RectFlag',
    TRIANGLEFLAG = 'TriangleFlag',
    CURVEFLAG = 'CurveFlag',
    LOCATION = 'Location',
    TEXTLABEL = 'TextLabel',
    ENTITY = 'Entity'
}

export function getEntityFromType(plotType: PlotType,options: CEntityOption) {
    let plottingEntity: CEntity | undefined;
    if (plotType === PlotType.AttackArrow) {
        plottingEntity = new ArrowAttack(options)
    } else if (plotType === PlotType.DOUBLE_ARROW) {
        plottingEntity = new ArrowDouble(options)
    } else if (plotType === PlotType.FINE_ARROW) {
        plottingEntity = new ArrowFine(options)
    } else if (plotType === PlotType.SQUAD_COMBAT) {
        plottingEntity = new SquadCombat(options)
    } else if (plotType === PlotType.STRAIGHT_ARROW) {
        plottingEntity = new StraightArrow(options)
    } else if (plotType === PlotType.POLYLINE) {
        plottingEntity = new CPolyline(options)
    }else if (plotType === PlotType.GATHERING_PLACE) {
        plottingEntity = new GatheringPlace(options)
    }else if(plotType === PlotType.CLOSED_CURVE) {
        plottingEntity = new CloseCurve(options)
    }else if(plotType === PlotType.LUNE) {
        plottingEntity = new Lune(options)
    }else if(plotType === PlotType.SECTOR) {
        plottingEntity = new Sector(options)
    }else if(plotType === PlotType.TAILED_SQUAD_COMBAT) {
        plottingEntity = new SquadCombatSwallowTailed(options)
    }else if(plotType === PlotType.TAILED_ATTACK_ARROW) {
        plottingEntity = new ArrowAttackSwallowTailed(options)
    }else if(plotType === PlotType.ASSAULT_DIRECTION) {
        plottingEntity = new AssaultDirection(options)
    }else if(plotType === PlotType.ARC) {
        plottingEntity = new Arc(options)
    }else if(plotType === PlotType.CIRCLE) {
        plottingEntity = new Circle(options)
    }else if(plotType === PlotType.ELLIPSE) {
        plottingEntity = new Ellipse(options)
    }else if(plotType === PlotType.CURVE) {
        plottingEntity = new Curve(options)
    }else if(plotType === PlotType.FREEHANDLINE) {
        plottingEntity = new FreeHandLine(options)
    }else if(plotType === PlotType.RECTINCLINED1) {
        plottingEntity = new Rectinclined1(options)
    }else if(plotType === PlotType.RECTINCLINED2) {
        plottingEntity = new Rectinclined2(options)
    }else if(plotType === PlotType.RECTANGLE) {
        plottingEntity = new Rectangle(options)
    }else if(plotType === PlotType.POINT) {
        plottingEntity = new CPoint(options)
    }else if (plotType === PlotType.RECTFLAG) {
        plottingEntity = new RectFlag(options)
    }else if(plotType === PlotType.POLYGON) {
        plottingEntity = new CPolygon(options)
    }
    return plottingEntity;
}

export function getDescriptionFromType(plotType: PlotType) {
    switch (plotType) {
        case PlotType.ARC: return '曲线'
        case PlotType.ASSAULT_DIRECTION: return '不知道'
    }
}

export default PlotType;
