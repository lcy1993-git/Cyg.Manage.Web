import React, { FC, useState } from 'react';
import TableSearch from '@/components/table-search';
import UrlSelect from '@/components/url-select';
import { Button, Input, Select } from 'antd';
import { useGetProjectEnum } from '@/utils/hooks';
import styles from './index.less';
import { Moment } from 'moment';
import { useContainer } from '../../result-page/mobx-store';
import EnumSelect from '@/components/enum-select';
import { observer } from 'mobx-react-lite';
import {
  ProjectIdentityType,
  ProjectSourceType,
  ProjectStatus,
} from '@/services/project-management/all-project';
import OverFlowHiddenComponent from '@/components/over-flow-hidden-component';
const { Search } = Input;
const { Option } = Select;
interface ProjectStatusOption {
  key: string;
  name: string;
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
  {
    width: 111,
  },
];

const FilterBar: FC = observer(() => {
  const [keyWord, setKeyWord] = useState<string>(); //搜索关键词
  const [category, setCategory] = useState<string>(); //项目分类
  const [pCategory, setPCategory] = useState<string>(); //项目类别
  const [comment, setComment] = useState<number>(); //审阅
  const [stage, setStage] = useState<string>(); //项目阶段
  const [constructType, setConstructType] = useState<string>(); //建设性质
  const [nature, setNature] = useState<string>(); //项目性质
  const [kvLevel, setKvLevel] = useState<string>(); //电压等级
  const [statuss, setStatuss] = useState<number[]>(); //状态
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
    setKeyWord(undefined);
    setCategory(undefined);
    setPCategory(undefined);
    setStage(undefined);
    setConstructType(undefined);
    setNature(undefined);
    setKvLevel(undefined);
    setStatuss(undefined);
    setSourceType(undefined);
    setIdentityType(undefined);
    setComment(undefined);

    const condition = {};

    store.setFilterCondition(condition);
  };

  const search = () => {
    const condition = {
      keyWord: keyWord ?? undefined,
      category: category && category !== '-1' ? [category] : undefined,
      pCategory: pCategory && pCategory !== '-1' ? [pCategory] : undefined,
      stage: stage && stage !== '-1' ? [stage] : undefined,
      constructType: constructType && constructType !== '-1' ? [constructType] : undefined,
      nature: nature && nature !== '-1' ? [nature] : undefined,
      kvLevel: kvLevel && kvLevel !== '-1' ? [kvLevel] : undefined,
      status: statuss ?? undefined,
      sourceType: sourceType && sourceType !== '-1' ? [sourceType] : undefined,
      identityType: identityType && identityType !== '-1' ? [identityType] : undefined,
      haveAnnotate: comment && comment !== -1 ? comment : undefined,
    };

    console.log(condition);

    store.setFilterCondition(condition);
  };

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
              valueKey="value"
              titleKey="text"
              defaultData={projectCategory}
              className="widthAll"
              value={category}
              onChange={(value) => setCategory(value as string)}
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
              value={pCategory}
              dropdownMatchSelectWidth={168}
              onChange={(value) => setPCategory(value as string)}
              className="widthAll"
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
              value={stage}
              className="widthAll"
              onChange={(value) => setStage(value as string)}
              placeholder="项目阶段"
              needAll={true}
              allValue="-1"
            />
          </TableSearch>
          <TableSearch className="mr2" width="111px">
            <UrlSelect
              valueKey="value"
              titleKey="text"
              defaultData={projectConstructType}
              value={constructType}
              className="widthAll"
              placeholder="建设类型"
              onChange={(value) => setConstructType(value as string)}
              needAll={true}
              allValue="-1"
            />
          </TableSearch>
          <TableSearch className="mr2" width="111px">
            <UrlSelect
              valueKey="value"
              titleKey="text"
              defaultData={projectKvLevel}
              value={kvLevel}
              onChange={(value) => setKvLevel(value as string)}
              className="widthAll"
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
              value={nature}
              dropdownMatchSelectWidth={168}
              onChange={(value) => setNature(value as string)}
              className="widthAll"
              placeholder="项目性质"
              needAll={true}
              allValue="-1"
            />
          </TableSearch>

          <TableSearch width="111px" className="mb10">
            <EnumSelect
              enumList={ProjectSourceType}
              value={sourceType}
              onChange={(value) => setSourceType(value as string)}
              className="widthAll"
              placeholder="项目来源"
              needAll={true}
              allValue="-1"
            />
          </TableSearch>
          <TableSearch width="111px" className="mb10">
            <EnumSelect
              enumList={ProjectIdentityType}
              value={identityType}
              onChange={(value) => setIdentityType(value as string)}
              className="widthAll"
              placeholder="项目身份"
              needAll={true}
              allValue="-1"
            />
          </TableSearch>
          <TableSearch className="mb10" width="111px">
            <Select
              allowClear
              value={comment}
              onChange={(value) => setComment(value)}
              style={{ width: '100%' }}
              placeholder="存在审阅"
            >
              <Select.Option value={-1} children={'全部'} />
              <Select.Option value={1} children={'是'} />
              <Select.Option value={0} children={'否'} />
            </Select>
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
  );
});

export default FilterBar;
