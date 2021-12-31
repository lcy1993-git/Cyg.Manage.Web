import { DownOutlined } from '@ant-design/icons'
import { useClickAway, useRequest } from 'ahooks'
import { Select } from 'antd'
import { useRef, useState } from 'react'
import styles from './index.less'
import { useMemo } from 'react'
import { forwardRef } from 'react'
import { Ref } from 'react'
import { useImperativeHandle } from 'react'
import { flatten } from '@/utils/utils'
import { getCityAreas } from '@/services/project-management/all-project'

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

const AreaSelect = (props: AreaSelectProps, ref: Ref<any>) => {
  const [selectAreaVisible, setSelectAreaVisible] = useState<boolean>(false)

  const { onChange } = props

  const [provinceInfo, setProvinceInfo] = useState<AreaItem>()
  const [cityInfo, setCityInfo] = useState<AreaItem>()
  const [areaInfo, setAreaInfo] = useState<AreaItem>()
  const [citySelectData, setCitySelectData] = useState<AreaItem[]>()
  const [areaSelectData, setAreaSelectData] = useState<AreaItem[]>()
  const [areaData, setAreaData] = useState<any[]>([])
  const selectRef = useRef<HTMLDivElement>(null)
  const selectContentRef = useRef<HTMLDivElement>(null)

  const showSelectContent = (e: any) => {
    if (selectContentRef && selectContentRef.current) {
      const windowWidth = document.body.clientWidth

      const offsetInfo = e.currentTarget.getBoundingClientRect()
      let xOffsetLeft = offsetInfo.left + 260 > windowWidth ? windowWidth - 260 : offsetInfo.left

      selectContentRef.current.style.left = `${xOffsetLeft - 8}px`
      selectContentRef.current.style.top = `${offsetInfo.top + 32}px`
    }
    setSelectAreaVisible(true)
  }

  //获取区域
  const { data: cityData } = useRequest(() => getCityAreas(), {
    onSuccess: () => {
      if (cityData) {
        setAreaData(cityData.data)
      }
    },
  })

  useClickAway(() => {
    setSelectAreaVisible(false)
  }, [selectRef, selectContentRef])

  // 省级就是第一层级
  const provinceData = useMemo(() => {
    const newProvinceData = areaData.map((item) => {
      return {
        label: item.text,
        value: item.id,
        children: item.children,
      }
    })
    return [{ label: '-全部-', value: '', children: [] }, ...newProvinceData]
  }, [JSON.stringify(areaData)])
  // 省级变化事件
  const provinceChangeEvent = (value: string, option: any) => {
    setProvinceInfo(option)

    const newCityData = option.children?.map((item: any) => {
      return {
        label: item.parentId === '-1' ? item.text : item.shortName,
        value: item.id,
        children: item.children,
      }
    })
    setCitySelectData([{ label: '-全部-', value: '', children: [] }, ...newCityData])
    setCityInfo(undefined)
    setAreaInfo(undefined)
    onChange?.({
      provinceId: option.value,
      cityId: '',
      areaId: '',
      cityData: [{ label: '-全部-', value: '', children: [] }, ...newCityData],
      areaData: [],
      provinceInfo: option,
      cityInfo: undefined,
      areaInfo: undefined,
    })
  }
  // 市级变化事件
  const cityChangeEvent = (value: string, option: any) => {
    setCityInfo(option)
    const newAreaData = option.children?.map((item: any) => {
      return {
        label: item.parentId === '-1' ? item.text : item.shortName,
        value: item.id,
        children: item.children,
      }
    })
    setAreaSelectData([{ label: '-全部-', value: '', children: [] }, ...newAreaData])
    setAreaInfo(undefined)
    onChange?.({
      provinceId: provinceInfo?.value,
      cityId: option.value,
      areaId: '',
      cityData: citySelectData,
      areaData: [{ label: '-全部-', value: '', children: [] }, ...newAreaData],
      provinceInfo,
      cityInfo: option,
      areaInfo: undefined,
    })
  }
  // 地区变化事件
  const areaChangeEvent = (value: string, option: any) => {
    setAreaInfo(option)
    onChange?.({
      provinceId: provinceInfo?.value,
      cityId: cityInfo?.value,
      areaId: option.value,
      cityData: citySelectData,
      areaData: areaSelectData,
      provinceInfo,
      cityInfo,
      areaInfo: option,
    })
  }

  const hasSelectTipInfo = useMemo(() => {
    return `${provinceInfo?.label}${cityInfo?.label ? '/' + cityInfo?.label : ''}${
      areaInfo?.label ? '/' + areaInfo?.label : ''
    }`
  }, [JSON.stringify(provinceInfo), JSON.stringify(cityInfo), JSON.stringify(areaInfo)])

  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    reset: () => {
      setProvinceInfo(undefined)
      setCitySelectData([])
      setCityInfo(undefined)
      setAreaSelectData([])
      setAreaInfo(undefined)
    },
    initComponentData: (params: any) => {
      if (params) {
        setProvinceInfo(params.provinceInfo)
        setCitySelectData(params.cityData)
        setCityInfo(params.cityInfo)
        setAreaSelectData(params.areaData)
        setAreaInfo(params.areaInfo)
      }
    },
    initComponentById: (params: any) => {
      const handleAreaData = flatten<any>(areaData)
      const { areaType, areaId } = params
      if (areaType === '-1') {
        return
      }
      if (areaType === '1') {
        // 代表到的省级
        const provinceInfo = handleAreaData.find((item) => item.id === areaId)
        const citySelectData = provinceInfo?.children
        const provinceName = provinceInfo?.text

        setProvinceInfo({
          label: provinceName!,
          value: areaId,
        })

        if (citySelectData) {
          const handleCityInfo = citySelectData.map((item: any) => {
            return {
              label: item.text,
              value: item.id,
              children: item.children,
            }
          })
          setCitySelectData([{ label: '-全部-', value: '', children: [] }, ...handleCityInfo])
        }
        setCityInfo(undefined)
        setAreaSelectData([])
        setAreaInfo(undefined)
      }
      if (areaType === '2') {
        // 代表是市级
        const cityInfo = handleAreaData.find((item) => item.id === areaId)
        const areaSelectData = cityInfo?.children
        const provinceInfo = handleAreaData.find((item) => item.id === cityInfo?.parentId)

        setProvinceInfo({
          label: provinceInfo?.text,
          value: provinceInfo?.id,
        })

        const handleCitySelectData = provinceInfo?.children.map((item: any) => {
          return {
            label: item.text,
            value: item.id,
            children: item.children,
          }
        })

        setCitySelectData([{ label: '-全部-', value: '', children: [] }, ...handleCitySelectData])
        setCityInfo({
          label: cityInfo?.text,
          value: cityInfo?.id,
        })
        if (areaSelectData) {
          const handleAreaSelectData = areaSelectData.map((item: any) => {
            return {
              label: item.text,
              value: item.id,
              children: item.children,
            }
          })
          setAreaSelectData(handleAreaSelectData)
          setAreaInfo(undefined)
        }
      }
      if (areaType === '3') {
        // 代表是县级
        const areaInfo = handleAreaData.find((item) => item.id === areaId)
        const cityInfo = handleAreaData.find((item) => item.id === areaInfo?.parentId)
        const provinceInfo = handleAreaData.find((item) => item.id === cityInfo?.parentId)

        const handleCitySelectData = provinceInfo?.children.map((item: any) => {
          return {
            label: item.text,
            value: item.id,
            children: item.children,
          }
        })

        const handleAreaSelectData = cityInfo?.children.map((item: any) => {
          return {
            label: item.text,
            value: item.id,
            children: item.children,
          }
        })

        setProvinceInfo({
          label: provinceInfo?.text,
          value: provinceInfo?.id,
        })
        setCitySelectData([{ label: '-全部-', value: '', children: [] }, ...handleCitySelectData])
        setCityInfo({
          label: cityInfo?.text,
          value: cityInfo?.id,
        })
        setAreaSelectData([{ label: '-全部-', value: '', children: [] }, ...handleAreaSelectData])
        setAreaInfo({
          label: areaInfo?.text,
          value: areaInfo?.id,
        })
      }
    },
  }))

  return (
    <div className={styles.areaSelect}>
      <div className={styles.areaSelectContent} onClick={showSelectContent} ref={selectRef}>
        {!provinceInfo && <div className={styles.selectPlaceholder}>项目区域</div>}
        {provinceInfo && <div className={styles.hasSelectTip}>{hasSelectTipInfo}</div>}
        <div className={styles.selectFold}>
          <DownOutlined />
        </div>
      </div>
      <div
        className={`${styles.popContent} ${selectAreaVisible ? 'show' : 'hide'}`}
        ref={selectContentRef}
      >
        <div className={styles.popContentItem}>
          <div className={styles.popContentItemLabel}>省级</div>
          <div className={styles.popContentItemSelect}>
            <Select
              value={provinceInfo?.value}
              onChange={provinceChangeEvent}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              options={provinceData}
              placeholder="请选择省级"
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <div className={styles.popContentItem}>
          <span className={styles.popContentItemLabel}>地级</span>
          <div className={styles.popContentItemSelect}>
            <Select
              value={cityInfo?.value}
              onChange={cityChangeEvent}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              options={provinceInfo?.value ? citySelectData : []}
              placeholder="请选择地级"
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <div className={styles.popContentItem}>
          <span className={styles.popContentItemLabel}>县级</span>
          <div className={styles.popContentItemSelect}>
            <Select
              value={areaInfo?.value}
              onChange={areaChangeEvent}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              options={cityInfo?.value ? areaSelectData : []}
              placeholder="请选择县级"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default forwardRef(AreaSelect)
