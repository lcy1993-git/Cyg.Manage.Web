import React, { useState } from 'react';
import { Tabs, Button, Modal, Form } from 'antd';
import styles from './index.less';
import CommonTitle from '@/components/common-title';
import Construction from './construction';
import { FileSearchOutlined } from '@ant-design/icons';
import ImportDirectory from './components/import-directory';
const { TabPane } = Tabs;

const ProjectList: React.FC = () => {
  const [importFormVisible, setImportFormVisible] = useState(false);
  const [importForm] = Form.useForm();
  const callback = (key: any) => {
    console.log(key);
  };
  // 编辑确认按钮
  const sureImportAuthorization = () => {
    importForm.validateFields().then(async (values: any) => {
      // TODO 上传接口

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
          <TabPane tab="建筑工程" key="1">
            <div className={styles.pannelTable}>
              <Construction />
            </div>
          </TabPane>
          <TabPane tab="安装工程" key="2">
            <div className={styles.pannelTable}>
              <Construction />
            </div>
          </TabPane>
          <TabPane tab="采出工程" key="3">
            <div className={styles.pannelTable}>
              <Construction />
            </div>
          </TabPane>
          <TabPane tab="余物工程" key="4">
            <div className={styles.pannelTable}>
              <Construction />
            </div>
          </TabPane>
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
      </div>
    </div>
  );
};

export default ProjectList;
