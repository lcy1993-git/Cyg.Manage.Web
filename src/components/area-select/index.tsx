import { DownOutlined } from "@ant-design/icons";
import { useClickAway } from "ahooks";
import { Select } from "antd";
import React, { useRef, useState } from "react"
import styles from "./index.less";

const AreaSelect: React.FC = () => {
    const [selectAreaVisible, setSelectAreaVisible] = useState<boolean>(false);

    const [provinceId, setProvinceId] = useState<string>();
    const [areaId, setAreaId] = useState<string>();
    const [cityId, setCityId] = useState<string>();

    const selectRef = useRef<HTMLDivElement>(null);
    const selectContentRef = useRef<HTMLDivElement>(null);

    const showSelectContent = () => [
        setSelectAreaVisible(true)
    ]

    useClickAway(() => {    
        setSelectAreaVisible(false)
    },[selectRef,selectContentRef])

    return (
        <div className={styles.areaSelect}>
            <div className={styles.areaSelectContent} onClick={() => showSelectContent()} ref={selectRef}>
                <div className={styles.selectPlaceholder}>
                    项目区域
                </div>
                <div className={styles.selectFold}>
                    <DownOutlined />
                </div>
            </div>
            <div className={`${styles.popContent} ${selectAreaVisible ? "show" : "hide"}`} ref={selectContentRef}>
                <div className={styles.popContentItem}>
                    <div className={styles.popContentItemLabel}>省级</div>
                    <div className={styles.popContentItemSelect}>
                        <Select placeholder="请选择省级" style={{ width: "100%" }} />
                    </div>
                </div>
                <div className={styles.popContentItem}>
                    <span className={styles.popContentItemLabel}>地级</span>
                    <div className={styles.popContentItemSelect}>
                        <Select placeholder="请选择地级" style={{ width: "100%" }} />
                    </div>
                </div>
                <div className={styles.popContentItem}>
                    <span className={styles.popContentItemLabel}>县级</span>
                    <div className={styles.popContentItemSelect}>
                        <Select placeholder="请选择县级" style={{ width: "100%" }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AreaSelect