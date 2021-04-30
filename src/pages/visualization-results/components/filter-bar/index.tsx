import React, { FC, useState } from 'react';
import TableSearch from '@/components/table-search';
import UrlSelect from '@/components/url-select';
import { Button, Input, Select, Popover, DatePicker } from 'antd';
import { useGetProjectEnum } from '@/utils/hooks';
import styles from './index.less';
import { Moment } from 'moment';
import { useContainer } from '../../result-page/mobx-store';
import EnumSelect from '@/components/enum-select';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import useCollapse from 'react-collapsed';
import {
  ProjectIdentityType,
  ProjectSourceType,
  ProjectStatus,
} from '@/services/project-management/all-project';
const { Search } = Input;
const { Option } = Select;
interface ProjectStatusOption {
  key: string;
  name: string;
}

const FilterBar: FC = observer(() => {
  const [keyWord, setKeyWord] = useState<string>(''); //搜索关键词
  const [category, setCategory] = useState<number>(); //项目分类
  const [pCategory, setPCategory] = useState<number>(); //项目类别
  const [stage, setStage] = useState<number>(); //项目阶段
  const [constructType, setConstructType] = useState<number>(); //建设性质
  const [nature, setNature] = useState<number>(); //项目性质
  const [kvLevel, setKvLevel] = useState<number>(); //电压等级
  const [statuss, setStatuss] = useState<number[]>(); //状态
  const [createdOn, setCreatedOn] = useState<Moment | null>(); //创建时间
  const [modifyDate, setsModiyDate] = useState<Moment | null>(); //更新时间
  const [sourceType, setSourceType] = useState<string>(); //项目来源
  const [identityType, setIdentityType] = useState<string>(); //项目身份

  const store = useContainer();

  const {
    projectCategory,
    projectPType,
    projectNature,
    projectConstructType,
    projectStage,
    projectKvLevel,
  } = useGetProjectEnum();

  const getProjectStatusOption = () => {
    const arrayProjectStatus: ProjectStatusOption[] = [];
    for (const [propertyKey, propertyValue] of Object.entries(ProjectStatus)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }
      arrayProjectStatus.push({ key: propertyValue.toString(), name: propertyKey });
    }

    return arrayProjectStatus.map((v) => {
      return <Option key={v.key} children={v.name} value={v.key} />;
    });
  };

  const reset = () => {
    setKeyWord('');
    setCategory(undefined);
    setPCategory(undefined);
    setStage(undefined);
    setConstructType(undefined);
    setNature(undefined);
    setKvLevel(undefined);
    setStatuss(undefined);
    setCreatedOn(undefined);
    setsModiyDate(undefined);
    setSourceType(undefined);
    setIdentityType(undefined);
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
    };

    store.setFilterCondition(condition);
  };

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
    };

    store.setFilterCondition(condition);
  };

  return (
    <div className={styles.filterbar}>
      <div className="flex">
        <TableSearch className="mr10" label="项目名称" width="178px">
          <Search
            placeholder="请输入项目名称"
            value={keyWord}
            onSearch={() => search()}
            onChange={(e) => setKeyWord(e.target.value)}
            enterButton
          />
        </TableSearch>
        <TableSearch className="mr10" label="立项时间" width="151px">
          <DatePicker
            placeholder="年"
            value={createdOn}
            onChange={(date: Moment | null) => setCreatedOn(date)}
            suffixIcon={<DownOutlined />}
            picker="year"
          />
        </TableSearch>
        <TableSearch className="mr10" label="更新时间" width="151px">
          <DatePicker
            onChange={(date: Moment | null) => setsModiyDate(date)}
            placeholder="年"
            value={modifyDate}
            suffixIcon={<DownOutlined />}
            picker="year"
          />
        </TableSearch>

        <TableSearch className="mr2" label="全部状态" width="151px">
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
        <TableSearch className="mr2" width="111px">
          <UrlSelect
            valueKey="value"
            titleKey="text"
            defaultData={projectCategory}
            dropdownMatchSelectWidth={168}
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
            valueKey="value"
            titleKey="text"
            defaultData={projectPType}
            dropdownMatchSelectWidth={168}
            value={pCategory}
            className="widthAll"
            onChange={(value) => setPCategory(value as number)}
            placeholder="项目类别"
            needAll={true}
            allValue="-1"
          />
        </TableSearch>
        <TableSearch className="mr2" width="111px">
          <UrlSelect
            valueKey="value"
            titleKey="text"
            defaultData={projectStage}
            className="widthAll"
            value={stage}
            onChange={(value) => setStage(value as number)}
            placeholder="项目阶段"
            needAll={true}
            allValue="-1"
          />
        </TableSearch>
        <TableSearch className="mr2" width="111px">
          <UrlSelect
            valueKey="value"
            titleKey="text"
            value={constructType}
            defaultData={projectConstructType}
            onChange={(value) => setConstructType(value as number)}
            className="widthAll"
            placeholder="建设性质"
            needAll={true}
            allValue="-1"
          />
        </TableSearch>
        <TableSearch className="mr2" width="111px">
          <UrlSelect
            valueKey="value"
            titleKey="text"
            defaultData={projectKvLevel}
            className="widthAll"
            value={kvLevel}
            onChange={(value) => setKvLevel(value as number)}
            placeholder="电压等级"
            needAll={true}
            allValue="-1"
          />
        </TableSearch>
        <TableSearch className="mr2" width="111px">
          <UrlSelect
            valueKey="value"
            titleKey="text"
            defaultData={projectNature}
            dropdownMatchSelectWidth={168}
            value={nature}
            onChange={(value) => setNature(value as number)}
            className="widthAll"
            placeholder="项目性质"
            needAll={true}
            allValue="-1"
          />
        </TableSearch>
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
  );
});

export default FilterBar;
