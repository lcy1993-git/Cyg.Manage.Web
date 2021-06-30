import React, { useEffect, useMemo, useState } from 'react';
import { Tabs, Button, Modal, Form, Pagination } from 'antd';
import styles from './index.less';
import CommonTitle from '@/components/common-title';
import Construction from './construction';
import { FileSearchOutlined } from '@ant-design/icons';
import ImportDirectory from './components/import-directory';
import qs from 'qs';
import { getEnums } from '../utils';
import {
  getEngineeringTemplateTreeData,
  importProject,
} from '@/services/technology-economic/project-list';
const { TabPane } = Tabs;
type DataSource = {
  id: string;
  [key: string]: string;
};
type Data = {
  pageIndex: number;
  total: number;
  items: any;
  pageSize: number;
};
const ProjectList: React.FC = () => {
  const [importFormVisible, setImportFormVisible] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [engineeringTemplateId, setEngineeringTemplateId] = useState<string>(
    (qs.parse(window.location.href.split('?')[1]).id as string) || '',
  );
  const ProjectTypeList = getEnums('ProjectType');
  const [dataSource, setDataSource] = useState<DataSource[] | Object>([]);
  const [data, setData] = useState<Data>();
  const tableResultData = useMemo(() => {
    if (data) {
      const { items, pageIndex, pageSize, total } = data;
      return {
        items: items ?? [],
        pageIndex,
        pageSize,
        total,
        dataStartIndex: Math.floor((pageIndex - 1) * pageSize + 1),
        dataEndIndex: Math.floor((pageIndex - 1) * pageSize + (items ?? []).length),
      };
    }
    return {
      items: [],
      pageIndex: 1,
      pageSize: 20,
      total: 0,
      dataStartIndex: 0,
      dataEndIndex: 0,
    };
  }, [JSON.stringify(data)]);
  const [projectType, setProjectType] = useState<number>(
    ProjectTypeList.length ? ProjectTypeList[0].value : 1,
  );
  const [importForm] = Form.useForm();
  // 切换tab
  const callback = (key: any) => {
    setProjectType(key as number);
    console.log(key);

    getList(key);
  };
  useEffect(() => {
    getList(projectType);
  }, []);
  const refresh = () => {
    getList(projectType);
  };
  // 获取树状列表
  const getList = async (projectType: number) => {
    const value: DataSource[] = await getEngineeringTemplateTreeData(
      engineeringTemplateId,
      projectType,
    );
    console.log(value);

    // TODO
    // const { items, pageIndex, pageSize, total } = data;
    const list = [];
    list.push(value);
    value ? setDataSource(list) : setDataSource([]);
  };

  // // 列显示处理
  // const currentPageChange = (page: any, size: any) => {
  //   // 判断当前page是否改变, 没有改变代表是change页面触发
  //   if (pageSize === size) {
  //     setCurrentPage(page === 0 ? 1 : page);
  //   }
  // };

  // const pageSizeChange = (page: any, size: any) => {
  //   setCurrentPage(1);
  //   setPageSize(size);
  // };

  // 确认按钮
  const sureImportAuthorization = () => {
    importForm.validateFields().then(async (values: any) => {
      // TODO 上传接口
      let value = values;
      value.engineeringTemplateId = engineeringTemplateId;
      await importProject(value);
      refresh();
      setImportFormVisible(false);
    });
  };

  return (
    <div className={styles.resourceManage}>
      <div className={styles.moduleTitle}>
        <CommonTitle>定额计价（安装乙供设备计入设备购置费）-工程量目录</CommonTitle>
        <Button
          className="mr7"
          type="primary"
          onClick={() => {
            setImportFormVisible(true);
          }}
        >
          <FileSearchOutlined />
          导入目录
        </Button>
      </div>

      <div className={styles.moduleTabs}>
        <Tabs onChange={callback} type="card">
          {ProjectTypeList.map((item: any, index: number) => {
            return (
              <TabPane tab={item.text} key={item.value}>
                <div className={styles.pannelTable}>
                  <Construction
                    // engineeringTemplateId={engineeringTemplateId}
                    // projectType={item.value}
                    dataSource={dataSource}
                  />
                </div>
              </TabPane>
            );
          })}
        </Tabs>
        <Modal
          maskClosable={false}
          title="导入目录"
          width="880px"
          visible={importFormVisible}
          okText="确认"
          onOk={() => sureImportAuthorization()}
          onCancel={() => setImportFormVisible(false)}
          cancelText="取消"
          destroyOnClose
        >
          <Form form={importForm} preserve={false}>
            <ImportDirectory />
          </Form>
        </Modal>
        {/* <div className={styles.cyGeneralTablePaging}>
          <div className={styles.cyGeneralTablePagingLeft}>
            <span>显示第</span>
            <span className={styles.importantTip}>{dataSource.dataStartIndex}</span>
            <span>到第</span>
            <span className={styles.importantTip}>{dataSource.dataEndIndex}</span>
            <span>条记录,总共</span>
            <span className={styles.importantTip}>{dataSource.total}</span>
            <span>条记录</span>
          </div>
          <div className={styles.cyGeneralTablePagingRight}>
            <Pagination
              pageSize={pageSize}
              onChange={currentPageChange}
              size="small"
              total={tableResultData.total}
              current={currentPage}
              // hideOnSinglePage={true}
              showSizeChanger
              showQuickJumper
              onShowSizeChange={pageSizeChange}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProjectList;
