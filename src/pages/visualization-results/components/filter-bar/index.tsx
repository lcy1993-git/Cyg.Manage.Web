import React, { FC } from 'react';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import UrlSelect from '@/components/url-select';
import { Button, Input, message, Modal } from 'antd';
import classNames from 'classnames';
import { useGetProjectEnum } from '@/utils/hooks';
import styles from './index.less';
import EnumSelect from '@/components/enum-select';
const { Search } = Input;
const FilterBar: FC = () => {
  const {
    projectCategory,
    projectPType,
    projectNature,
    projectConstructType,
    projectStage,
    projectKvLevel,
  } = useGetProjectEnum();

  return (
    <div className={styles.form}>
      <div className="flex">
        <div className=" flex1 flex">
          <TableSearch className="mr10" label="项目名称" width="178px">
            <Search placeholder="请输入项目名称" enterButton />
          </TableSearch>
          <TableSearch className="mr10" label="全部状态" width="178px">
            <UrlSelect
              valueKey="value"
              titleKey="text"
              defaultData={projectCategory}
              className="widthAll"
              placeholder="项目分类"
              needAll={true}
              allValue="-1"
            />
          </TableSearch>
          <TableSearch className="mr10" label="立项时间" width="178px">
            <UrlSelect
              valueKey="value"
              titleKey="text"
              defaultData={projectCategory}
              className="widthAll"
              placeholder="年"
              needAll={true}
              allValue="-1"
            />
          </TableSearch>
          <TableSearch className="mr2" label="更新时间" width="178px">
            <UrlSelect
              valueKey="value"
              titleKey="text"
              defaultData={projectCategory}
              className="widthAll"
              placeholder="年"
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
          <TableSearch className="mr22" width="111px">
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
        <div>
          <Button className="mr7" type="primary">
            查询
          </Button>
          <Button className="mr7">重置</Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
