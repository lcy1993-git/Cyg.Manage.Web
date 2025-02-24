import React, { FC, useRef, useState } from 'react'
import TableSearch from '@/components/table-search'
import UrlSelect from '@/components/url-select'
import { Button, Input, Select } from 'antd'
import { useGetProjectEnum } from '@/utils/hooks'
import styles from './index.less'
import { Moment } from 'moment'
import { useContainer } from '../../store'
import EnumSelect from '@/components/enum-select'
import AreaSelect from '@/components/area-select'
import { observer } from 'mobx-react-lite'
import {
  ProjectIdentityType,
  ProjectSourceType,
  ProjectStatus,
} from '@/services/project-management/all-project'
import OverFlowHiddenComponent from '@/components/over-flow-hidden-component'
const { Search } = Input
const { Option } = Select
interface ProjectStatusOption {
  key: string
  name: string
}
const searchChildrenList = [
  {
    width: 300,
  },
  {
    width: 180,
  },
  {
    width: 111,
  },
  {
    width: 111,
  },
  {
    width: 111,
  },
  {
    width: 111,
  },
  {
    width: 111,
  },
  {
    width: 111,
  },
  {
    width: 111,
  },
  {
    width: 111,
  },
]
const FilterBar: FC = observer(() => {
  const [keyWord, setKeyWord] = useState<string>('') //搜索关键词
  const [category, setCategory] = useState<number>() //项目分类
  const [pCategory, setPCategory] = useState<number>() //项目类别
  const [stage, setStage] = useState<number>() //项目阶段
  const [constructType, setConstructType] = useState<number>() //建设性质
  const [nature, setNature] = useState<number>() //项目性质
  const [kvLevel, setKvLevel] = useState<number>() //电压等级
  const [statuss, setStatuss] = useState<number[]>() //状态
  const [createdOn, setCreatedOn] = useState<Moment | null>() //创建时间
  const [modifyDate, setsModiyDate] = useState<Moment | null>() //更新时间
  const [sourceType, setSourceType] = useState<string>() //项目来源
  const [identityType, setIdentityType] = useState<string>() //项目身份
  const [areaInfo, setAreaInfo] = useState({ areaType: '-1', areaId: '' })
  const areaRef = useRef<HTMLDivElement>(null)
  const store = useContainer()

  const {
    projectCategory,
    projectPType,
    projectNature,
    projectConstructType,
    projectStage,
    projectKvLevel,
  } = useGetProjectEnum()

  const getProjectStatusOption = () => {
    const arrayProjectStatus: ProjectStatusOption[] = []
    for (const [propertyKey, propertyValue] of Object.entries(ProjectStatus)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue
      }
      arrayProjectStatus.push({ key: propertyValue.toString(), name: propertyKey })
    }

    return arrayProjectStatus.map((v) => {
      return <Option key={v.key} children={v.name} value={v.key} />
    })
  }
  const areaChangeEvent = (params: any) => {
    const { provinceId, cityId, areaId } = params
    if (areaId) {
      setAreaInfo({
        areaType: '3',
        areaId: areaId,
      })
      return
    }
    if (cityId) {
      setAreaInfo({
        areaType: '2',
        areaId: cityId,
      })
      return
    }
    if (provinceId) {
      setAreaInfo({
        areaType: '1',
        areaId: provinceId,
      })
      return
    }
    if (!provinceId && !cityId && !areaId) {
      setAreaInfo({
        areaType: '-1',
        areaId: '',
      })
    }
  }

  const reset = () => {
    setKeyWord('')
    setCategory(undefined)
    setPCategory(undefined)
    setStage(undefined)
    setConstructType(undefined)
    setNature(undefined)
    setKvLevel(undefined)
    setStatuss(undefined)
    setCreatedOn(undefined)
    setsModiyDate(undefined)
    setSourceType(undefined)
    setIdentityType(undefined)
    setAreaInfo({
      areaType: '-1',
      areaId: '',
    })
    const condition = {
      keyWord: '',
      category: -1,
      pCategory: -1,
      stage: -1,
      constructType: -1,
      nature: -1,
      kvLevel: -1,
      statuss: [],
      createdOn: '',
      modifyDate: '',
      sourceType: '-1',
      identityType: '-1',
    }

    store.setFilterCondition(condition)
  }

  const search = () => {
    const condition = {
      keyWord,
      category: category ?? -1,
      pCategory: pCategory ?? -1,
      stage: stage ?? -1,
      constructType: constructType ?? -1,
      nature: nature ?? -1,
      kvLevel: kvLevel ?? -1,
      statuss: statuss ?? [],
      createdOn: createdOn?.year().toString() ?? '',
      modifyDate: modifyDate?.year().toString() ?? '',
      sourceType: sourceType ?? '-1',
      identityType: identityType ?? '-1',
      ...areaInfo,
    }

    store.setFilterCondition(condition)
  }

  return (
    <div className={styles.filterbar}>
      <div className="flex" style={{ width: '100%', overflow: 'hidden' }}>
        <OverFlowHiddenComponent childrenList={searchChildrenList}>
          <TableSearch className="mr22" label="项目名称" width="300px">
            <Search
              placeholder="请输入项目名称"
              enterButton
              value={keyWord}
              onChange={(e) => setKeyWord(e.target.value)}
              onSearch={() => search()}
            />
          </TableSearch>
          <TableSearch label="全部状态" className="mr2" width="180px">
            <Select
              maxTagCount={0}
              maxTagTextLength={2}
              mode="multiple"
              allowClear
              value={statuss}
              onChange={(values: number[]) => setStatuss(values)}
              style={{ width: '100%' }}
              placeholder="项目状态"
            >
              {getProjectStatusOption()}
            </Select>
          </TableSearch>
          <TableSearch className="mb10" width="111px">
            <UrlSelect
              valuekey="value"
              titlekey="text"
              defaultData={projectCategory}
              className="widthAll"
              value={category}
              onChange={(value) => setCategory(value as number)}
              placeholder="项目分类"
              needAll={true}
              allValue="-1"
            />
          </TableSearch>
          <TableSearch className="mr2" width="111px">
            <UrlSelect
              valuekey="value"
              titlekey="text"
              defaultData={projectPType}
              value={pCategory}
              dropdownMatchSelectWidth={168}
              onChange={(value) => setPCategory(value as number)}
              className="widthAll"
              placeholder="项目类别"
              needAll={true}
              allValue="-1"
            />
          </TableSearch>
          <TableSearch className="mr2" width="111px">
            <UrlSelect
              valuekey="value"
              titlekey="text"
              defaultData={projectStage}
              value={stage}
              className="widthAll"
              onChange={(value) => setStage(value as number)}
              placeholder="项目阶段"
              needAll={true}
              allValue="-1"
            />
          </TableSearch>
          <TableSearch className="mr2" width="111px">
            <UrlSelect
              valuekey="value"
              titlekey="text"
              defaultData={projectConstructType}
              value={constructType}
              className="widthAll"
              placeholder="建设类型"
              onChange={(value) => setConstructType(value as number)}
              needAll={true}
              allValue="-1"
            />
          </TableSearch>
          <TableSearch className="mr2" width="111px">
            <UrlSelect
              valuekey="value"
              titlekey="text"
              defaultData={projectKvLevel}
              value={kvLevel}
              onChange={(value) => setKvLevel(value as number)}
              className="widthAll"
              placeholder="电压等级"
              needAll={true}
              allValue="-1"
            />
          </TableSearch>
          <TableSearch className="mr2" width="111px">
            <UrlSelect
              valuekey="value"
              titlekey="text"
              defaultData={projectNature}
              value={nature}
              dropdownMatchSelectWidth={168}
              onChange={(value) => setNature(value as number)}
              className="widthAll"
              placeholder="项目性质"
              needAll={true}
              allValue="-1"
            />
          </TableSearch>
          <TableSearch className="mb10" width="111px">
            <AreaSelect ref={areaRef} onChange={areaChangeEvent} />
          </TableSearch>
          <TableSearch width="111px" className="mb10">
            <EnumSelect
              enumList={ProjectSourceType}
              value={sourceType}
              onChange={(value) => setSourceType(String(value))}
              className="widthAll"
              placeholder="项目来源"
              needAll={true}
              allValue="-1"
            />
          </TableSearch>
          <TableSearch width="111px">
            <EnumSelect
              enumList={ProjectIdentityType}
              value={identityType}
              onChange={(value) => setIdentityType(String(value))}
              className="widthAll"
              placeholder="项目身份"
              needAll={true}
              allValue="-1"
            />
          </TableSearch>
        </OverFlowHiddenComponent>
      </div>

      <div className="flex">
        <Button className="mr2" onClick={() => search()} type="primary">
          查询
        </Button>
        <Button className="mr2" onClick={() => reset()}>
          重置
        </Button>
      </div>
    </div>
  )
})

export default FilterBar
