import IconDraw from '@/static/svg/绘制 .svg'
import {Button, Collapse, CollapseProps, Popover} from 'antd'
import styles from './index.module.css'
import PlotMilitary from "@/pages/Toolbar/component/PlotComponent/PlotMilitary";

const plottingPanelItems:CollapseProps['items'] = [
    {
        key: 'military',
        label: '军事标绘',
        children: <PlotMilitary />
    }
]

function PlottingPanel() {

    return (
        <div className={styles['draw-container']}>
            <Collapse size={'small'} defaultActiveKey={'military'} items={plottingPanelItems}></Collapse>
        </div>
    )
}

const PlottingPopoverTitle = () => {

    return (
        <div className={styles['draw-popover-header']}>
            标绘工具栏
        </div>
    )
}

export default function PlottingComponent() {

    return (
        <Popover trigger={'click'} placement={'leftTop'} title={<PlottingPopoverTitle />} content={<PlottingPanel />}>
            <Button title={'标绘工具'} type='default' size='large' icon={<IconDraw />}></Button>
        </Popover>
    )
}
