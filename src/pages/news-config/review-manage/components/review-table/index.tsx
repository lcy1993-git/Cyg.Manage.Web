import React, { FC, useState } from 'react';
import PageCommonWrap from '@/components/page-common-wrap';
import styles from './index.less';
import Filterbar from './components/filter-bar';
import SideMenu from './components/side-menu';
import TableSearch from '@/components/table-search';
import UrlSelect from '@/components/url-select';
import { Button, Input, DatePicker, Select } from 'antd';
import EnumSelect from '@/components/enum-select';
import { useContainer } from '../../store';
import classnames from 'classnames';
const { Option } = Select;

const layers = ['勘察图层', '方案图层', '设计图层', '拆除图层'];
interface ReviewProps {}
const { Search } = Input;
const ReviewTable: FC<ReviewProps> = (props) => {
  const [keyWord, setKeyWord] = useState<string>('');
  const [layer, setLayer] = useState<string>('');
  const sotre = useContainer();
  const search = () => {
    const condition = {
      keyWord,
      layer,
    };

    sotre.setFilterCondition(condition);
  };

  function onSelect(value: string | number) {
    setLayer(value as string);
  }
  return (
    <div className={styles.tableContainer}>
      <div className={classnames(styles.tableFilterbar, 'flex')}>
        <TableSearch className="mr10" label="项目名称" width="178px">
          <Search
            placeholder="请输入项目名称"
            value={keyWord}
            onSearch={() => search()}
            onChange={(e) => setKeyWord(e.target.value)}
            enterButton
          />
        </TableSearch>
        <TableSearch className="mr10" label="项目名称" width="178px">
          <Select placeholder="选择图层" style={{ width: '100%' }} onSelect={onSelect}>
            {layers.map((v: string,idx:number) => (
              <Option key={v}>{v}</Option>
            ))}
          </Select>
        </TableSearch>
      </div>
      <main style={styles.main}></main>
    </div>
  );
};

export default ReviewTable;
