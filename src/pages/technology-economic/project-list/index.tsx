import CommonTitle from '@/components/common-title'
import {
  getEngineeringTemplateTreeData,
  importProject,
} from '@/services/technology-economic/project-list'
import { FileSearchOutlined } from '@ant-design/icons'
import { Button, Form, message, Modal, Tabs } from 'antd'
import qs from 'qs'
import React, { useEffect, useState } from 'react'
import { getEnums } from '../utils'
import ImportDirectory from './components/import-directory'
import Construction from './construction'
import styles from './index.less'
const { TabPane } = Tabs
type DataSource = {
  id: string
  [key: string]: string
}
const ProjectList: React.FC = () => {
  const [importFormVisible, setImportFormVisible] = useState(false)
  const engineeringTemplateId = (qs.parse(window.location.href.split('?')[1]).id as string) || ''
  const ProjectTypeList = getEnums('ProjectType')!
  const [dataSource, setDataSource] = useState<DataSource[] | Object>([])
  const [projectType, setProjectType] = useState<number>(1)
  // const [projectType, setProjectType] = useState<number>(
  //   ProjectTypeList && ProjectTypeList.length ? ProjectTypeList[0].value : 1
  // );
  const [importForm] = Form.useForm()
  // 切换tab
  const callback = (key: any) => {
    setProjectType(key as number)
    getList(key)
  }
  useEffect(() => {
    getList(projectType)
  }, [])
  // 刷新
  const refresh = () => {
    getList(projectType)
  }
  // 获取树状列表
  const getList = async (projectType: number) => {
    const value: DataSource[] = await getEngineeringTemplateTreeData(
      engineeringTemplateId,
      projectType
    )
    const list = []
    list.push(value)
    value ? setDataSource(list) : setDataSource([])
  }

  // 确认按钮
  const sureImportAuthorization = () => {
    importForm.validateFields().then(async (values: any) => {
      const { file } = values
      if (file == undefined) {
        message.warning('您还未上传模板文件')
        return
      }
      const value: { file: File; engineeringTemplateId: string } = {
        file,
        engineeringTemplateId,
      }
      await importProject(
        { file: value.file },
        { engineeringTemplateId: value.engineeringTemplateId }
      )
      // if (res.code === 5000) {
      //   message.error(res.message);
      //   return;
      // }
      message.success('上传成功')
      refresh()
      setImportFormVisible(false)
    })
  }

  return (
    <div className={styles.resourceManage}>
      <div className={styles.moduleTitle}>
        <CommonTitle>定额计价（安装乙供设备计入设备购置费）-工程量目录</CommonTitle>
        <Button
          className="mr7"
          type="primary"
          onClick={() => {
            setImportFormVisible(true)
          }}
        >
          <FileSearchOutlined />
          导入目录
        </Button>
      </div>

      <div className={styles.moduleTabs}>
        <Tabs onChange={callback} type="card">
          {ProjectTypeList.map((item: any) => {
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
            )
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
      </div>
    </div>
  )
}

export default ProjectList
