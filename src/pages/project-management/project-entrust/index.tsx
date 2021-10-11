import CommonTitle from '@/components/common-title';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import EntrustTable from './components/entrust-table';
import { Button, Input } from 'antd';
import styles from './index.less';
import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import FilterEntrustModal from './components/filter-entrust-modal';
const { Search } = Input;
const ProjectEntrust: React.FC = () => {
  const [keyWord, setKeyWord] = useState<string>();
  const [screenModalVisible, setScreenModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({
    category: [],
    stage: [],
    constructType: [],
    nature: [],
    kvLevel: [],
    status: [],
    majorCategory: [],
    pType: [],
    reformAim: [],
    classification: [],
    attribute: [],
    sourceType: [],
    identityType: [],
    areaType: '-1',
    areaId: '',
    dataSourceType: [],
    logicRelation: 2,
    startTime: '',
    endTime: '',
    designUser: '',
    surveyUser: '',
  });
  const searchEvent = () => {};

  const screenClickEvent = (params: any) => {
    // setSearchParams({ ...params, keyWord, statisticalCategory });
    // searchByParams({ ...params, engineerFavoritesId: selectedFavId, keyWord, statisticalCategory });
  };

  return (
    <PageCommonWrap>
      <CommonTitle>待办项目</CommonTitle>
      <div>
        在当前列表中可以查看所属公司被其他单位委托的项目，并且可以将该项目获取至当前个人账号，获取后的项目在【我的工作台】模块中查看。
      </div>
      <div className={styles.searchAndButton}>
        <div className={styles.searchProject}>
          <TableSearch className="mr22" label="" width="300px">
            <Search
              placeholder="请输入工程/项目名称"
              enterButton
              value={keyWord}
              onChange={(e) => setKeyWord(e.target.value)}
              onSearch={() => searchEvent()}
            />
          </TableSearch>
          <Button onClick={() => setScreenModalVisible(true)}>筛选</Button>
        </div>

        {/* {(buttonJurisdictionArray?.includes('all-project-project-approval')  */}

        <Button className="mr7" type="primary" style={{ width: '70px', borderRadius: '5px' }}>
          获取
        </Button>

        {/* )} */}
      </div>
      <div>
        <EntrustTable />
      </div>

      <FilterEntrustModal
        visible={screenModalVisible}
        onChange={setScreenModalVisible}
        finishEvent={screenClickEvent}
        searchParams={searchParams}
      />
    </PageCommonWrap>
  );
};

export default ProjectEntrust;
