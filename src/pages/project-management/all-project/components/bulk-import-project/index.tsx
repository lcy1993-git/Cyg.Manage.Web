import { Button, Cascader, Table } from 'antd';
import { Form, Modal } from 'antd';
import React, { useMemo, useState } from 'react';
import CyFormItem from '@/components/cy-form-item';
import { useGetSelectData } from '@/utils/hooks';
import DataSelect from '@/components/data-select';
import city from '@/assets/local-data/area';
import styles from './index.less';
import EmptyTip from '@/components/empty-tip';
// import { editEngineer } from '@/services/project-management/all-project';
import { useCallback } from 'react';
import EditBulkEngineer from './edit-bulk-engineer';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { getCommonSelectData } from '@/services/common';
import { cloneDeep } from 'lodash';
import uuid from 'node-uuid';

interface BulkImportProjectProps {
  excelModalData: any;
  batchAddForm: any;
}

const BulkImportProject: React.FC<BulkImportProjectProps> = (props) => {
  const { excelModalData, batchAddForm } = props;

  const { content } = excelModalData;
  console.log(JSON.stringify(content));

  const engineerData = content.map((item: any) => {
    return item.engineer;
  });

  const [requestLoading, setRequestLoading] = useState(false);

  const [libId, setLibId] = useState<string>('');
  const [areaId, setAreaId] = useState<string>('');
  const [selectedProjectData, setSelectedProjectData] = useState<any>([]);
  const [currentEngineerTitle, setCurrentEngineerTitle] = useState<string>('');

  const [editEngineerModalVisible, setEditEngineerModalVisble] = useState<boolean>(false);
  const [canChange, setCanChange] = useState<boolean>(true);
  const [company, setCompany] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');

  const [engineerInfo, setEngineerInfo] = useState<any[]>([]);

  const [editEngineerForm] = Form.useForm();
  const [editProjectForm] = Form.useForm();

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

  const { run: getInventoryOverviewSelectData } = useRequest(getCommonSelectData, { manual: true });

  const { run: getWarehouseSelectData } = useRequest(getCommonSelectData, { manual: true });
  const { run: getCompanySelectData } = useRequest(getCommonSelectData, { manual: true });

  const afterHandleData = useMemo(() => {
    return city.map(mapHandleCityData);
  }, [JSON.stringify(city)]);

  const { data: libSelectData = [] } = useGetSelectData({
    url: '/ResourceLibrary/GetList',
    extraParams: { pId: '-1' },
  });

  //编辑行工程信息
  const editEngineer = (record: any) => {
    editEngineerForm.setFieldsValue({
      ...record,
      compileTime: record?.compileTime ? moment(record?.compileTime) : null,
      startTime: record?.startTime ? moment(record?.startTime) : null,
      endTime: record?.endTime ? moment(record?.endTime) : null,
      importance: String(record?.importance),
      grade: String(record?.grade),
    });
    setEditEngineerModalVisble(true);
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

  const areaChangeEvent = async (value: any, numberIndex: number) => {
    const [province, city, area] = value;
    const copyEngineerInfo = cloneDeep(engineerInfo);

    const warehouseSelectData = await getWarehouseSelectData({
      url: '/WarehouseOverview/GetList',
      method: 'get',
      params: { areaId: province },
      requestSource: 'project',
    });

    const companySelectData = await getCompanySelectData({
      url: '/ElectricityCompany/GetListByAreaId',
      method: 'get',
      params: { areaId: province },
      requestSource: 'project',
    });

    const handleWarehouseSelectData = warehouseSelectData.map((item: any) => {
      return {
        label: item.text,
        value: item.value,
      };
    });

    const handleCompanySelectData = companySelectData.map((item: any) => {
      return {
        label: item.text,
        value: item.value,
      };
    });

    const handleData = copyEngineerInfo.map((item, index) => {
      if (index === numberIndex) {
        return {
          ...item,
          engineer: {
            ...item.engineer,
            province,
            city,
            area,
            warehouseId: '',
            company: '',
          },
          selectData: {
            ...item.selectData,
            warehouseSelectData: handleWarehouseSelectData,
            companySelectData: handleCompanySelectData,
          },
        };
      }
      return item;
    });

    setEngineerInfo(handleData);
  };

  const libChangeEvent = async (value: any, numberIndex: number) => {
    const copyEngineerInfo = cloneDeep(engineerInfo);
    const inventoryOverviewSelectData = await getInventoryOverviewSelectData({
      url: '/InventoryOverview/GetList',
      method: 'get',
      params: { libId: value },
      requestSource: 'project',
    });

    const handleInventoryOverviewSelectData = inventoryOverviewSelectData.map((item: any) => {
      return {
        label: item.text,
        value: item.value,
      };
    });

    const handleData = copyEngineerInfo.map((item, index) => {
      if (index === numberIndex) {
        return {
          ...item,
          engineer: {
            ...item.engineer,
            libId: value,
            inventoryOverviewId: '',
          },
          selectData: {
            ...item.selectData,
            inventoryOverviewSelectData: handleInventoryOverviewSelectData,
          },
        };
      }
      return item;
    });

    setEngineerInfo(handleData);
  };

  const wareHouseChangeEvent = (value: any, numberIndex: number) => {
    const copyEngineerInfo = cloneDeep(engineerInfo);

    const handleData = copyEngineerInfo.map((item, index) => {
      if (index === numberIndex) {
        return {
          ...item,
          engineer: {
            ...item.engineer,
            warehouseId: value,
          },
        };
      }
      return item;
    });

    setEngineerInfo(handleData);
  };

  const companyChangeEvent = (value: any, numberIndex: number) => {
    const copyEngineerInfo = cloneDeep(engineerInfo);

    const handleData = copyEngineerInfo.map((item, index) => {
      if (index === numberIndex) {
        return {
          ...item,
          engineer: {
            ...item.engineer,
            company: value,
          },
        };
      }
      return item;
    });

    setEngineerInfo(handleData);
  };

  
  const inventoryOverviewChange = (value: any, numberIndex: number) => {
    const copyEngineerInfo = cloneDeep(engineerInfo);

    const handleData = copyEngineerInfo.map((item,index) => {
        if(index === numberIndex) {
            return {
                ...item,
                engineer: {
                    ...item.engineer,
                    inventoryOverviewId: value
                }
            }
        }
        return item
    })

    setEngineerInfo(handleData)
}

  const engineerTrElement = engineerInfo.map((item, index) => {
    let provinceValue = [
      item?.engineer.province,
      item?.engineer.city
        ? item?.engineer.city
        : item?.engineer.province
        ? `${item?.engineer.province}_null`
        : undefined,
      item?.engineer.area
        ? item?.engineer.area
        : item?.engineer.city
        ? `${item?.engineer.city}_null`
        : undefined,
    ];
    if (!item?.engineer.province) {
      provinceValue = [];
    }

    if (index === 0) {
      return (
        <tr key={uuid.v1()}>
          <td>{item.engineer.name}</td>
          <td>
            <Cascader
              value={provinceValue}
              onChange={(value) => areaChangeEvent(value, index)}
              options={afterHandleData}
            />
          </td>
          <td>
            <DataSelect
              value={item.engineer.libId}
              onChange={(value) => libChangeEvent(value, index)}
              options={libSelectData}
              placeholder="-资源库-"
            />
          </td>
          <td>
            <DataSelect
              value={item.engineer.inventoryOverviewId}
              onChange={(value) => inventoryOverviewChange(value, index)}
              options={item.selectData.inventoryOverviewSelectData}
              placeholder="请先选择资源库"
            />
          </td>
          <td>
            <DataSelect
              value={item.engineer.warehouseId}
              onChange={(value) => wareHouseChangeEvent(value, index)}
              options={item.selectData.warehouseSelectData}
              placeholder="请先选择区域"
            />
          </td>
          <td>
            <DataSelect
              value={item.engineer.company}
              onChange={(value) => companyChangeEvent(value, index)}
              options={item.selectData.companySelectData}
              placeholder="请先选择区域"
            />
          </td>
          <td>
            <Button type="text">编辑</Button>
          </td>
        </tr>
      );
    }
    return (
      <tr key={uuid.v1()}>
        <td>{item.engineer.name}</td>
        <td>
          <Cascader
            value={provinceValue}
            onChange={(value) => areaChangeEvent(value, index)}
            options={afterHandleData}
            placeholder="同上"
          />
        </td>
        <td>
          <DataSelect
            value={item.engineer.libId}
            onChange={(value) => libChangeEvent(value, index)}
            options={libSelectData}
            placeholder="同上"
          />
        </td>
        <td>
          <DataSelect
            value={item.engineer.inventoryOverviewId}
            onChange={(value) => inventoryOverviewChange(value, index)}
            options={item.selectData.inventoryOverviewSelectData}
            placeholder="同上"
          />
        </td>
        <td>
          <DataSelect
            value={item.engineer.warehouseId}
            onChange={(value) => wareHouseChangeEvent(value, index)}
            options={item.selectData.warehouseSelectData}
            placeholder="同上"
          />
        </td>
        <td>
          <DataSelect
            value={item.engineer.company}
            onChange={(value) => companyChangeEvent(value, index)}
            options={item.selectData.companySelectData}
            placeholder="同上"
          />
        </td>
        <td>
          <Button type="text">编辑</Button>
        </td>
      </tr>
    );
  });

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
        return <DataSelect onChange={(value) => inventoryOverviewChange(value, index)} options={inventoryOverviewSelectData} placeholder="请先选择资源库" />;
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
          <span style={{ cursor: 'pointer' }} onClick={() => editEngineer(record)}>
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
      render: (record: any) => {
        return (
          <span style={{ cursor: 'pointer' }} onClick={() => editProject(record)}>
            编辑
          </span>
        );
      },
    },
  ];


  const editProject = (record: any) => {};

  const saveCurrentEngineerEvent = async () => {
    await editEngineerForm.validateFields().then((value) => {
      const engineerInfo = Object.assign(
        {
          compiler: '',
          endTime: '',
          grade: '',
          importance: '',
          name: '',
          organization: '',
          plannedYear: '',
          startTime: '',
        },
        value,
      );
      console.log(engineerInfo);
    });
  };

  return (
    <>
      <Form form={batchAddForm}>
        <CyFormItem
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
        maskClosable={false}
        width={800}
        visible={editEngineerModalVisible}
        title="编辑-工程"
        onCancel={() => setEditEngineerModalVisble(false)}
        onOk={() => saveCurrentEngineerEvent()}
      >
        <Form form={editEngineerForm}>
          <EditBulkEngineer />
        </Form>
      </Modal>
    </>
  );
};

export default BulkImportProject;
