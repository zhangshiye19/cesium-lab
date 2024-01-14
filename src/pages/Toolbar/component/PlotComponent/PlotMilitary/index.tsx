import {Flex} from "antd";
import SvgAttackArrow from '@/static/svg/攻击箭头.svg'
import SvgRightArrow from '@/static/svg/细直箭头.svg'
import PlotItem from "@/pages/Toolbar/component/PlotComponent/PlotItem";

export default function PlotMilitary() {

    return (
        <div>
            <Flex wrap={'wrap'} gap={'large'}>
                <PlotItem icon={<SvgAttackArrow/>} plotType={''} title={'攻击箭头'}/>
                <PlotItem icon={<SvgRightArrow/>} plotType={''} title={'直角箭头'}/>
            </Flex>
        </div>
    )
}
