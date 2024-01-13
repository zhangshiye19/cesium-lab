// import { Popover,Button } from "@arco-design/web-react";
// import { IconPlus, IconDelete } from '@arco-design/web-react/icon';
import IconDraw from '@/static/svg/绘制 .svg'
import { Button, Popover } from 'antd'

function DarwPanel() {

    return (
        <div>

        </div>
    )
}

export default function DrawComponent() {

    return (
        <Popover title='Title' content={<DarwPanel />}>
            <Button title='标绘' type='default' size='large' icon={<IconDraw />}></Button>
        </Popover>
    )
}