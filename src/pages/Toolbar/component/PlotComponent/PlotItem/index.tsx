import styles from './index.module.css'
import {Button} from "antd";
import React from "react";

type PlotItemProps = {
    icon: React.ReactNode,
    plotType: string,
    title: string
}

export default function PlotItem({icon, plotType, title}: PlotItemProps) {

    return (
        <div className={styles['plot-item-container']}>
            <Button size={'large'} title={title} icon={icon} onClick={e => console.log(plotType)}/>
            <div>{title}</div>
        </div>
    )
}
