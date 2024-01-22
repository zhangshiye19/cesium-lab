import {Col, Row} from "antd";
import SvgRightArrow from '@/static/svg/细直箭头.svg'
import PlotItem from "@/pages/Toolbar/component/PlotComponent/PlotItem";
import PlotType from "@/CesiumMap/entity/PlotType";

export default function PlotMilitary() {

    return (
        <div>
            <Row justify={'space-between'} gutter={[16,16]} >
                {
                    Object.entries(PlotType).map(([key,value]:[string, PlotType])=>{

                        return (
                            <Col span={24/4} key={key}>
                                <PlotItem icon={<SvgRightArrow/>} plotType={value} title={value}/>
                            </Col>
                        )
                    })
                }
            </Row>
        </div>
    )
}
