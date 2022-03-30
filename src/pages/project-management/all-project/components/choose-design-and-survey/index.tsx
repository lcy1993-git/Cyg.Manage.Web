import DataSelect from '@/components/data-select'
import { useGetSelectData } from '@/utils/hooks'
import { DownOutlined } from '@ant-design/icons'
import { useClickAway } from 'ahooks'
import { Radio, Select } from 'antd'
import React, {
  useRef,
  useState,
  forwardRef,
  Ref,
  useImperativeHandle,
  useMemo,
  useEffect,
} from 'react'
import styles from './index.less'
import login from '@/pages/login'

export interface ChooseDesignAndSurveyValue {
  survey: string
  logicRelation: number
  design: string
  cost: string
}

interface SelectProps {
  onChange?: (value: ChooseDesignAndSurveyValue) => void
  defaultValue?: ChooseDesignAndSurveyValue
}

type LogicRelation = 1 | 2

const ChooseDesignAndSurveySelect = (props: SelectProps, ref: Ref<any>) => {
  const [survey, setSurvey] = useState<string>('')
  const [logicRelation, setLogicRelation] = useState<number>(2)
  const [design, setDesign] = useState<string>('')
  const [cost, setCost] = useState<string>('')

  const { data: personData = [] } = useGetSelectData({
    url: '/CompanyUser/GetList',
    extraParams: { clientCategory: '0' },
  })

  const { onChange, defaultValue } = props

  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    reset: () => {
      setLogicRelation(2)
      setSurvey('')
      setDesign('')
      onChange?.({
        logicRelation: 2,
        survey: '',
        design: '',
        cost: '',
      })
    },
    setValue: (params: any) => {
      setLogicRelation(params?.logicRelation ?? 2)
      setSurvey(params?.survey ?? '')
      setDesign(params?.design ?? '')

      onChange?.({
        logicRelation: params?.logicRelation ?? 2,
        survey: params?.survey ?? '',
        design: params?.design ?? '',
        cost: params?.cost ?? '',
      })
    },
  }))

  useEffect(() => {
    onChange?.({
      survey: survey === '-1' ? '' : survey,
      logicRelation,
      design: design === '-1' ? '' : design,
      cost: cost === '-1' ? '' : cost,
    })
  }, [survey, logicRelation, design])

  useEffect(() => {
    if (defaultValue) {
      setDesign(defaultValue?.design)
      setLogicRelation(defaultValue?.logicRelation)
      setSurvey(defaultValue?.survey)
      setCost(defaultValue?.cost)
    }
  }, [JSON.stringify(defaultValue)])
  const options = [
    { label: '筛选同时符合以上条件的项', value: 1 },
    { label: '筛选符合以上任意条件的项', value: 2 },
  ]
  return (
    <div className={styles.chooseDesignAndSurveySelect}>
      <div className={styles.firstLine}>
        <div className={styles.popContentItem}>
          <div className={styles.popContentItemLabel}>勘察人</div>
          <div className={styles.popContentItemSelect}>
            <DataSelect
              value={survey}
              placeholder="请选择"
              onChange={(value) => setSurvey(value as string)}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              style={{ width: '100%' }}
              options={[{ label: '全部', value: '-1' }, ...personData]}
            />
          </div>
        </div>
        <div className={styles.popContentItem}>
          <span className={styles.popContentItemLabel}>设计人</span>
          <div className={styles.popContentItemSelect}>
            <DataSelect
              value={design}
              placeholder="请选择"
              onChange={(value) => setDesign(value as string)}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              style={{ width: '100%' }}
              options={[{ label: '全部', value: '-1' }, ...personData]}
            />
          </div>
        </div>
        <div className={styles.popContentItem}>
          <span className={styles.popContentItemLabel}>造价人</span>
          <div className={styles.popContentItemSelect}>
            <DataSelect
              value={cost}
              placeholder="请选择"
              onChange={(value) => setCost(value as string)}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              style={{ width: '100%' }}
              options={[{ label: '全部', value: '-1' }, ...personData]}
            />
          </div>
        </div>
      </div>
      <div className={styles.lastLine}>
        <Radio.Group
          options={options}
          value={logicRelation}
          onChange={(e) => setLogicRelation(e.target.value as LogicRelation)}
        />
      </div>
    </div>
  )
}

export default forwardRef(ChooseDesignAndSurveySelect)
