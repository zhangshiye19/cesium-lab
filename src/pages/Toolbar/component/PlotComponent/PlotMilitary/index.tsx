import {Col, Row} from "antd";
import SvgAttackArrow from '@/static/svg/攻击箭头.svg'
import SvgRightArrow from '@/static/svg/细直箭头.svg'
import PlotItem from "@/pages/Toolbar/component/PlotComponent/PlotItem";
import PlotType from "@/CesiumMap/entity/PlotType";

export default function PlotMilitary() {

    return (
        <div>
            <Row justify={'space-between'} gutter={[16,16]} >
                <Col span={24/4}>
                    <PlotItem icon={<SvgAttackArrow/>} plotType={PlotType.AttackArrow} title={'AttackArrow'}/>
                </Col>
                <Col span={24/4}>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.DOUBLE_ARROW} title={'DoubleArrow'}/>
                </Col>
                <Col span={24/4}>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.FINE_ARROW} title={'FineArrow'}/>
                </Col>
                <Col span={24/4}>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.SQUAD_COMBAT} title={'nouse'}/>
                </Col>
                <Col span={24/4}>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.POLYLINE} title={'polyline'}/>
                </Col>
                <Col span={24/4}>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.STRAIGHT_ARROW} title={'StraightArrow'}/>
                </Col>
                <Col span={24/4}>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.CLOSED_CURVE} title={'CloseCurve'}/>
                </Col>
                <Col span={24/4}>
                    <PlotItem icon={<SvgRightArrow/>} plotType={PlotType.GATHERING_PLACE} title={'Gathering'}/>
                </Col>
            </Row>
        </div>
    )
}
