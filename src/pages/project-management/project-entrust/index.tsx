import CommonTitle from '@/components/common-title';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import EntrustTable from './components/entrust-table';
import { Button, Input, message } from 'antd';
import styles from './index.less';
import React, { useEffect, useRef, useState } from 'react';
import FilterEntrustModal from './components/filter-entrust-modal';
import { receiveProject } from '@/services/project-management/project-entrust';
import { TableItemCheckedInfo } from '@/pages/project-management/all-project-new/components/engineer-table/engineer-table-item';
import { useUpdateEffect } from 'ahooks';
const { Search } = Input;

const ProjectEntrust: React.FC = () => {
  const [keyWord, setKeyWord] = useState<string>();
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);
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
    attribute: [],
    sourceType: [],
    identityType: [],
    areaType: '-1',
    areaId: '',
    startTime: '',
    endTime: '',
  });

  const searchByParams = (params: any) => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.searchByParams(params);
    }
  };

  const searchEvent = () => {
    console.log(keyWord);

    searchByParams({
      ...searchParams,
      keyWord,
    });
  };

  //获取选择项目id
  const tableSelectEvent = (checkedValue: TableItemCheckedInfo[]) => {
    const projectIds = checkedValue.map((item) => item.checkedArray).flat(1);
    console.log(projectIds);

    setProjectIds(projectIds);
  };

  const screenClickEvent = (params: any) => {
    setSearchParams({ ...params, keyWord });
    searchByParams({ ...params, keyWord });
  };

  useUpdateEffect(() => {
    searchByParams({ ...searchParams, keyWord });
  }, [searchParams]);

  const refresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.refresh();
    }
  };

  //项目获取
  const receiveProjectEvent = async () => {
    await receiveProject(projectIds);
    message.success('项目获取成功');
    refresh();
  };

  return (
    <PageCommonWrap>
      <CommonTitle>待办项目</CommonTitle>
      <div style={{ color: 'red' }}>
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

        <Button
          className="mr7"
          type="primary"
          style={{ width: '70px', borderRadius: '5px' }}
          onClick={() => receiveProjectEvent()}
        >
          获取
        </Button>

        {/* )} */}
      </div>
      <div className={styles.entrustTableContent}>
        <EntrustTable
          ref={tableRef}
          extractParams={{ ...searchParams, keyWord }}
          onSelect={tableSelectEvent}
        />
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
