import { Button, Cascader, Table } from 'antd';
import { Form, message, Modal } from 'antd';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import CyFormItem from '@/components/cy-form-item';
import { useGetSelectData } from '@/utils/hooks';
import DataSelect from '@/components/data-select';
import city from '@/assets/local-data/area';
import styles from './index.less';
import EmptyTip from '@/components/empty-tip';
import { editEngineer } from '@/services/project-management/all-project';
import { useCallback } from 'react';

interface BulkImportProjectProps {
  excelModalData: any;
}

const BulkImportProject: React.FC<BulkImportProjectProps> = (props) => {
  const { excelModalData } = props;

  const { content } = excelModalData;
  console.log(JSON.stringify(content));

  const engineerData = content.map((item: any) => {
    return item.engineer;
  });
  console.log(engineerData);

  const [requestLoading, setRequestLoading] = useState(false);

  const [libId, setLibId] = useState<string>('');
  const [areaId, setAreaId] = useState<string>('');
  const [selectedProjectData, setSelectedProjectData] = useState<any>([]);
  const [currentEngineerTitle, setCurrentEngineerTitle] = useState<string>('');
  const [editEngineerModalVisible, setEditEngineerModalVisble] = useState<boolean>(false);
  const [canChange, setCanChange] = useState<boolean>(true);
  const [company, setCompany] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');

  const [batchAddForm] = Form.useForm();

  const mapHandleCityData = (data: any) => {
    return {
      label: data.text,
      value: data.id,
      children: data.children
        ? [
            { label: '无', value: `${data.id}_null`, children: undefined },
            ...data.children.map(mapHandleCityData),
          ]
        : undefined,
    };
  };

  const afterHandleData = useMemo(() => {
    return city.map(mapHandleCityData);
  }, [JSON.stringify(city)]);

  const { data: libSelectData = [] } = useGetSelectData({
    url: '/ResourceLibrary/GetList',
    extraParams: { pId: '-1' },
  });
  const { data: inventoryOverviewSelectData = [] } = useGetSelectData(
    { url: '/InventoryOverview/GetList', extraParams: { libId: libId } },
    { ready: !!libId, refreshDeps: [libId] },
  );

  const { data: warehouseSelectData = [] } = useGetSelectData(
    { url: '/WarehouseOverview/GetList', extraParams: { areaId: areaId } },
    { ready: !!areaId, refreshDeps: [areaId] },
  );
  const { data: companySelectData = [] } = useGetSelectData(
    {
      url: '/ElectricityCompany/GetListByAreaId',
      extraParams: { areaId: areaId },
      titleKey: 'text',
      valueKey: 'text',
    },
    { ready: !!areaId, refreshDeps: [areaId] },
  );
  const saveBatchAddProjectEvent = () => {};

  const editEngineer = () => {
    setEditEngineerModalVisble(true);
  };

  const exportDataChange = (data: any) => {
    setAreaId(data.areaId);
    setCompany(data.company);
    setCompanyName(data.companyName);
    resetCompanyDep();
  };

  const resetCompanyDep = () => {
    const nowData = batchAddForm.getFieldValue('projects');
    const newData = nowData.map((item: any) => {
      return {
        ...item,
        powerSupply: undefined,
      };
    });
    batchAddForm.setFieldsValue({ projects: newData });
  };

  const valueChangeEvent = useCallback(
    (prevValues: any, curValues: any) => {
      if (prevValues.province !== curValues.province) {
        const [currentAreaId = ''] = curValues.province;
        setAreaId(currentAreaId);
        exportDataChange?.({
          areaId: currentAreaId,
          company: curValues.company,
          companyName:
            companySelectData?.find((item: any) => item.value == curValues.company)?.label ?? '',
        });
        // 因为发生了改变，所以之前选择的应该重置
        if (batchAddForm && canChange) {
          batchAddForm.setFieldsValue({
            warehouseId: undefined,
          });
          batchAddForm.setFieldsValue({
            company: undefined,
          });
        }
      }
      if (prevValues.libId !== curValues.libId) {
        setLibId(curValues.libId);
        if (batchAddForm && canChange) {
          batchAddForm.setFieldsValue({
            inventoryOverviewId: undefined,
          });
        }
      }
      if (prevValues.company !== curValues.company) {
        const [currentAreaId = ''] = curValues.province;
        exportDataChange?.({
          areaId: currentAreaId,
          company: curValues.company,
          companyName:
            companySelectData?.find((item: any) => item.value == curValues.company)?.label ?? '',
        });
      }
      return false;
    },
    [canChange],
  );

  const columns = [
    {
      title: '工程名称',
      dataIndex: 'name',
      index: 'name',
      width: 180,
    },
    {
      title: '区域',
      dataIndex: 'area',
      index: 'area',
      width: 180,
      render: () => {
        return <Cascader options={afterHandleData} />;
      },
    },
    {
      title: '资源库',
      dataIndex: 'libId',
      index: 'libId',
      width: 180,
      render: () => {
        return <DataSelect options={libSelectData} placeholder="-资源库-" />;
      },
    },
    {
      title: '协议库',
      dataIndex: 'inventoryOverviewId',
      index: 'inventoryOverviewId',
      width: 200,
      render: () => {
        return <DataSelect options={inventoryOverviewSelectData} placeholder="请先选择资源库" />;
      },
    },
    {
      title: '利旧库存协议',
      dataIndex: 'warehouseId',
      index: 'warehouseId',
      width: 160,
      render: () => {
        return <DataSelect options={warehouseSelectData} placeholder="请先选择区域" />;
      },
    },
    {
      title: '所属公司',
      dataIndex: 'company',
      index: 'company',
      width: 160,
      render: () => {
        return <DataSelect options={companySelectData} placeholder="请先选择区域" />;
      },
    },
    {
      title: '已录入信息',
      width: 180,
      render: (record: any) => {
        return (
          <span style={{ cursor: 'pointer' }} onClick={() => editEngineer()}>
            编辑
          </span>
        );
      },
    },
  ];

  const projectColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      index: 'name',
      //   render: () => {},
    },
    {
      title: '供电公司/班组',
      dataIndex: 'powerSupply',
      index: 'powerSupply',
      //   render: () => {},
    },
    {
      title: '已录入信息',
      dataIndex: '',
      index: '',
      render: () => {
        return (
          <span style={{ cursor: 'pointer' }} onClick={() => editEngineer()}>
            编辑
          </span>
        );
      },
    },
  ];

  return (
    <>
      {/* <Form form={batchAddForm}>
        <CyFormItem
          shouldUpdate={valueChangeEvent}
          required
          labelWidth={720}
          label="立项批量导入模板中的工程/项目信息已经录入，但是还需要您对其他一些选项进行补充选择，请完善一下所有工程以及项目的信息，确认无误后点击【保存】按钮，随后会为您创建好所有项目"
        />
        <div className={styles.engineerAndProjectTable}>
          <div className={styles.engineerTable}>
            <Table
              size="middle"
              dataSource={engineerData}
              columns={columns}
              bordered={true}
              pagination={false}
              locale={{
                emptyText: <EmptyTip className="pt20 pb20" />,
              }}
              rowKey="name"
              rowSelection={{
                type: 'radio',
                columnWidth: '38px',
                onSelect: (record) => {
                  console.log(record);
                  const projectData = content
                    .map((item: any) => {
                      if (item.engineer.grade === record.grade) {
                        return item.projects;
                      }
                    })
                    .flat()
                    .filter((item: any) => item != undefined);
                  console.log(projectData);
                  setCurrentEngineerTitle(record.name);
                  setSelectedProjectData(projectData);
                },
              }}
            />
          </div>
          <div className={styles.projectTable}>
            <Table
              size="middle"
              locale={{
                emptyText: <EmptyTip className="pt20 pb20" />,
              }}
              dataSource={selectedProjectData}
              bordered={true}
              rowKey="name"
              pagination={false}
              columns={projectColumns}
              title={() => currentEngineerTitle}
            />
          </div>
        </div>
      </Form>
      <Modal
        visible={editEngineerModalVisible}
        title="编辑-工程"
        onCancel={() => setEditEngineerModalVisble(false)}
      >
        111
      </Modal> */}

    </>
  );
};

export default BulkImportProject;
