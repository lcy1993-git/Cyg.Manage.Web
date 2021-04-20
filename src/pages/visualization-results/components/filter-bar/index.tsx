import React, { FC, useState } from 'react';
import TableSearch from '@/components/table-search';
import UrlSelect from '@/components/url-select';
import { Button, Input, DatePicker, Select, Menu } from 'antd';
import { useGetProjectEnum } from '@/utils/hooks';
import styles from './index.less';
import EnumSelect from '@/components/enum-select';
import classnames from 'classnames';
import { ProjectStatus } from '@/services/project-management/all-project';
import { DownOutlined } from '@ant-design/icons';
const { Search } = Input;
const { Option } = Select;
interface ProjectStatusOption {
  key: string;
  name: string;
}

//把project status转换成数组方面使用

const FilterBar: FC = () => {
  const [keyWord, setKeyWord] = useState<string>(''); //搜索关键词
  const [category, setCategory] = useState<string>(); //项目分类
  const [pCategory, setPCategory] = useState<string>(); //项目类别
  const [stage, setStage] = useState<string>(); //项目阶段
  const [constructType, setConstructType] = useState<string>(); //建设性质
  const [nature, setNature] = useState<string>();
  const [kvLevel, setKvLevel] = useState<string>(); //
  const [status, setStatus] = useState<string>();
  const [establishYear, setEstablishYear] = useState<number>();
  const [updateYear, setUpdateYear] = useState<number>();
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

  return (
    <div className={styles.form}>
      <div className="flex">
        <TableSearch className="mr10" label="项目名称" width="178px">
          <Search placeholder="请输入项目名称" enterButton />
        </TableSearch>
        <TableSearch className="mr10" label="立项时间" width="151px">
          <DatePicker placeholder="年" suffixIcon={<DownOutlined />} picker="year" />
        </TableSearch>
        <TableSearch className="mr10" label="更新时间" width="151px">
          <DatePicker placeholder="年" suffixIcon={<DownOutlined />} picker="year" />
        </TableSearch>
        <TableSearch className="mr2" label="全部状态" width="151px">
          <Select
            maxTagCount={1}
            maxTagTextLength={3}
            mode="multiple"
            allowClear
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
            defaultData={projectPType}
            dropdownMatchSelectWidth={168}
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
            className="widthAll"
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
            className="widthAll"
            placeholder="项目性质"
            needAll={true}
            allValue="-1"
          />
        </TableSearch>
      </div>

      <div className="flex">
        <Button className="mr2" type="primary">
          查询
        </Button>
        <Button className="mr2">重置</Button>
      </div>
    </div>
  );
};

export default FilterBar;
