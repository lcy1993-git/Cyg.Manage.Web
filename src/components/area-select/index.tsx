import { DownOutlined } from "@ant-design/icons";
import { useClickAway } from "ahooks";
import { Select } from "antd";
import React, { useRef, useState } from "react"
import styles from "./index.less";
import areaData from "@/assets/local-data/area"
import { useMemo } from "react";
import { forwardRef } from "react";
import { Ref } from "react";
import { useImperativeHandle } from "react";

interface AreaItem {
    label: string
    value: string
    children?: AreaItem[]
}

interface ValueType {
    provinceId?: string
    cityId?: string
    areaId?: string
    cityData?: any
    areaData?: any
    provinceInfo?: any
    cityInfo?: any
    areaInfo?: any
}

interface AreaSelectProps {
    onChange?: (value: ValueType) => void
}

const AreaSelect = (props: AreaSelectProps, ref: Ref<any>,) => {
    const [selectAreaVisible, setSelectAreaVisible] = useState<boolean>(false);

    const { onChange } = props;

    const [provinceInfo, setProvinceInfo] = useState<AreaItem>();
    const [cityInfo, setCityInfo] = useState<AreaItem>();
    const [areaInfo, setAreaInfo] = useState<AreaItem>();
    const [citySelectData, setCitySelectData] = useState<AreaItem[]>();
    const [areaSelectData, setAreaSelectData] = useState<AreaItem[]>();

    const selectRef = useRef<HTMLDivElement>(null);
    const selectContentRef = useRef<HTMLDivElement>(null);

    const showSelectContent = (e) => {
        if (selectContentRef && selectContentRef.current) {
            const windowWidth = document.body.clientWidth;

            const offsetInfo = e.currentTarget.getBoundingClientRect();
            let xOffsetLeft = offsetInfo.left + 260 > windowWidth ? windowWidth - 260 : offsetInfo.left;

            selectContentRef.current.style.left = `${xOffsetLeft - 8}px`;
            selectContentRef.current.style.top = `${offsetInfo.top + 32}px`;
        }
        setSelectAreaVisible(true)
    }

    useClickAway(() => {
        setSelectAreaVisible(false)
    }, [selectRef, selectContentRef])

    // 省级就是第一层级
    const provinceData = useMemo(() => {
        const newProvinceData = areaData.map((item) => {
            return {
                label: item.text,
                value: item.id,
                children: item.children
            }
        })
        return [{label: "-全部-", value: "", children: []},...newProvinceData]
    }, [JSON.stringify(areaData)])
    // 省级变化事件
    const provinceChangeEvent = (value: string, option: any) => {
        setProvinceInfo(option)
  
        const newCityData = option.children?.map((item: any) => {
            return {
                label: item.text,
                value: item.id,
                children: item.children
            }
        })
        setCitySelectData([{label: "-全部-", value: "", children: []},...newCityData])
        setCityInfo(undefined)
        setAreaInfo(undefined)
        onChange?.({ provinceId: option.value, cityId: "", areaId: "", cityData: [], areaData: [], provinceInfo: option, cityInfo, areaInfo})
    }
    // 市级变化事件
    const cityChangeEvent = (value: string, option: any) => {
        setCityInfo(option)
        const newAreaData = option.children?.map((item: any) => {
            return {
                label: item.text,
                value: item.id,
                children: item.children
            }
        })
        setAreaSelectData([{label: "-全部-", value: "", children: []},...newAreaData])
        setAreaInfo(undefined)
        onChange?.({ provinceId: provinceInfo?.value, cityId: option.value, areaId: "" , cityData: citySelectData, areaData: [], provinceInfo, cityInfo: option, areaInfo})
    }
    // 地区变化事件
    const areaChangeEvent = (value: string, option: any) => {
        setAreaInfo(option)
        onChange?.({ provinceId: provinceInfo?.value, cityId: cityInfo?.value, areaId: option.value,cityData: citySelectData, areaData: areaSelectData,provinceInfo, cityInfo, areaInfo: option})
    }

    const hasSelectTipInfo = useMemo(() => {
        return `${provinceInfo?.label}${cityInfo?.label ? "/" + cityInfo?.label : ""}${areaInfo?.label ? "/" + areaInfo?.label : ""}`

    }, [JSON.stringify(provinceInfo), JSON.stringify(cityInfo), JSON.stringify(areaInfo)])

    useImperativeHandle(ref, () => ({
        // changeVal 就是暴露给父组件的方法
        reset: () => {
            setProvinceInfo(undefined);
            setCitySelectData([]);
            setCityInfo(undefined);
            setAreaSelectData([]);
            setAreaInfo(undefined)
        },
        initComponentData: (params: any) => {
            if(params) {
                setProvinceInfo(params.provinceInfo);
                setCitySelectData(params.cityData);
                setCityInfo(params.cityInfo);
                setAreaSelectData(params.areaData);
                setAreaInfo(params.areaInfo)
            }
        }
    }));

    return (
        <div className={styles.areaSelect}>
            <div className={styles.areaSelectContent} onClick={showSelectContent} ref={selectRef}>
                {
                    !provinceInfo &&
                    <div className={styles.selectPlaceholder}>
                        项目区域
                    </div>
                }
                {
                    provinceInfo &&
                    <div className={styles.hasSelectTip}>
                        {hasSelectTipInfo}
                    </div>
                }
                <div className={styles.selectFold}>
                    <DownOutlined />
                </div>
            </div>
            <div className={`${styles.popContent} ${selectAreaVisible ? "show" : "hide"}`} ref={selectContentRef}>
                <div className={styles.popContentItem}>
                    <div className={styles.popContentItemLabel}>省级</div>
                    <div className={styles.popContentItemSelect}>
                        <Select value={provinceInfo?.value} onChange={provinceChangeEvent} getPopupContainer={triggerNode => triggerNode.parentElement} options={provinceData} placeholder="请选择省级" style={{ width: "100%" }} />
                    </div>
                </div>
                <div className={styles.popContentItem}>
                    <span className={styles.popContentItemLabel}>地级</span>
                    <div className={styles.popContentItemSelect}>
                        <Select value={cityInfo?.value} onChange={cityChangeEvent} getPopupContainer={triggerNode => triggerNode.parentElement} options={provinceInfo?.value ? citySelectData : []} placeholder="请选择地级" style={{ width: "100%" }} />
                    </div>
                </div>
                <div className={styles.popContentItem}>
                    <span className={styles.popContentItemLabel}>县级</span>
                    <div className={styles.popContentItemSelect}>
                        <Select value={areaInfo?.value} onChange={areaChangeEvent} getPopupContainer={triggerNode => triggerNode.parentElement} options={cityInfo?.value ? areaSelectData : []} placeholder="请选择县级" style={{ width: "100%" }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default forwardRef(AreaSelect)