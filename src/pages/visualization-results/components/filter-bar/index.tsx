import React, { FC, useEffect, useState } from 'react';
import TableSearch from '@/components/table-search';
import UrlSelect from '@/components/url-select';
import { Button, Input, DatePicker, Select, Popover } from 'antd';
import { useGetProjectEnum } from '@/utils/hooks';
import styles from './index.less';
import { Moment } from 'moment';
import { useContainer } from '../../result-page/mobx-store';
import { ProjectStatus } from '@/services/project-management/all-project';
import { DownOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
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
  const [nature, setNature] = useState<number>();
  const [kvLevel, setKvLevel] = useState<number>(); //
  const [statuss, setStatuss] = useState<number[]>();
  const [createdOn, setCreatedOn] = useState<Moment | null>();
  const [modifyDate, setsModiyDate] = useState<Moment | null>();
  const store = useContainer();
  console.log('filter fresh');

  const {
    projectCategory,
    projectPType,
    projectNature,
    projectConstructType,
    projectStage,
    projectKvLevel,
  } = useGetProjectEnum();

  /**
   * 获取status的option子组件
   */
  const getProjectStatusOption = () => {
    const arrayProjectStatus: ProjectStatusOption[] = [];
    for (const [propertyKey, propertyValue] of Object.entries(ProjectStatus)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }
      arrayProjectStatus.push({ key: propertyValue.toString(), name: propertyKey });
    }

    return arrayProjectStatus.map((v: ProjectStatusOption) => {
      return <Option key={v.key}>{v.name}</Option>;
    });
  };

  /**
   * 重置筛选codition
   */

  const clear = () => {
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
    };

    store.setFilterCondition(condition);
  };

  /**
   * 根据条件搜索
   */

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
    };

    store.setFilterCondition(condition);
  };

  const ConditionBar = () => {
    return (
      <>
        <div className={styles.filterConditionContainer}>
          {/* <TableSearch className={styles.filterConditionItem} label="立项时间" width="250px">
            <DatePicker
              placeholder="年"
              value={createdOn}
              style={{width: "100%"}}
              onChange={(date: Moment | null) => setCreatedOn(date)}
              suffixIcon={<DownOutlined />}
              picker="year"
            />
          </TableSearch>
          <TableSearch className={styles.filterConditionItem} label="更新时间" width="250px">
            <DatePicker
              onChange={(date: Moment | null) => setsModiyDate(date)}
              placeholder="年"
              style={{width: "100%"}}
              value={modifyDate}
              suffixIcon={<DownOutlined />}
              picker="year"
            />
          </TableSearch> */}
          <div style={{ marginBottom: '16px' }}>
            <TableSearch label="项目状态" width="220px">
              <Select
                maxTagCount={1}
                maxTagTextLength={2}
                mode="multiple"
                suffixIcon={<DownOutlined />}
                allowClear
                value={statuss}
                onChange={(values: number[]) => setStatuss(values)}
                style={{ width: '100%' }}
                placeholder="项目状态"
              >
                {getProjectStatusOption()}
              </Select>
            </TableSearch>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <TableSearch className={styles.filterConditionItem} label="项目分类" width="220px">
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
          </div>
          <div style={{ marginBottom: '16px' }}>
            <TableSearch className={styles.filterConditionItem} label="项目类别" width="220px">
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
          </div>
          <div style={{ marginBottom: '16px' }}>
            <TableSearch className={styles.filterConditionItem} label="项目阶段" width="220px">
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
          </div>
          <div style={{ marginBottom: '16px' }}>
            <TableSearch className={styles.filterConditionItem} label="建设性质" width="220px">
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
          </div>
          <div style={{ marginBottom: '16px' }}>
            <TableSearch className={styles.filterConditionItem} label="电压等级" width="220px">
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
          </div>
          <div style={{ marginBottom: '16px' }}>
            <TableSearch className={styles.filterConditionItem} label="项目性质" width="220px">
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
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button className="mr2" onClick={() => search()} type="primary">
            查询
          </Button>
          <Button className="mr2" onClick={() => clear()}>
            重置
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className={styles.form}>
      <div className="flex">
        <TableSearch className="mr10" width="178px">
          <Search
            placeholder="请输入项目名称"
            value={keyWord}
            onSearch={() => search()}
            onChange={(e) => setKeyWord(e.target.value)}
            enterButton
          />
        </TableSearch>
        <Popover placement="topLeft" content={<ConditionBar />} trigger="click">
          <Button type="default">筛选</Button>
        </Popover>
      </div>
    </div>
  );
});

export default FilterBar;
