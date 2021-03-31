import { MinusSquareOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { useBoolean } from "ahooks";
import uuid from "node-uuid";
import React, { ReactNode } from "react"
import styles from "./index.less"

interface CockpitMenuItemChildrenItem {
    name: string
    value: string
}

interface CockpitMenuItemProps {
    name: string
    buttonSlot: ReactNode
    childrenData: CockpitMenuItemChildrenItem[]
}

const CockpitMenuItem: React.FC<CockpitMenuItemProps> = (props) => {
    const [fold, { toggle }] = useBoolean(false);
    const { name = "", buttonSlot, childrenData = [] } = props;

    const childElement = childrenData.map((item) => {
        return (
            <div key={uuid.v1()} className={styles.cockpitMenuChildrenItem}>{item.name}</div>
        )
    })

    return (
        <div className={styles.cockpitMenuItem}>
            <div className={styles.cockpitMenuItemTitle}>
                <div className={styles.cockpitMenuItemFoldIcon} onClick={() => toggle()}>
                    {
                        fold &&
                        <PlusSquareOutlined />
                    }
                    {
                        !fold &&
                        <MinusSquareOutlined />
                    }
                </div>
                <div className={styles.cockpitMenuTitleContent}>
                    {
                        name
                    }
                </div>
                <div className={styles.cockpitMenuAddButtonSlot}>
                    {
                        buttonSlot
                    }
                </div>
            </div>
            {
                !fold &&
                <div className={styles.cockpitMenuItemContent}>
                    {childElement}
                </div>
            }

        </div>
    )
}

export default CockpitMenuItem