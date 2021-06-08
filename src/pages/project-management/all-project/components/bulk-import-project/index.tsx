import { Button, Cascader, Checkbox, message, Modal } from 'antd';
import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useMemo } from 'react';
import styles from './index.less';
import city from '@/assets/local-data/area';
import { useGetSelectData } from '@/utils/hooks';
import DataSelect from '@/components/data-select';
import { cloneDeep } from 'lodash';
import useRequest from '@ahooksjs/use-request';
import { getCommonSelectData } from '@/services/common';
import EditBulkEngineer from './edit-bulk-engineer';
import { useControllableValue } from 'ahooks';
import { importBulkEngineerProject } from '@/services/project-management/all-project';
import EditBulkProject from './edit-bulk-project';
import CyTip from '@/components/cy-tip';

interface BatchEditEngineerInfoProps {
  excelModalData: any;
  onChange: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
  refreshEvent?: () => void;
}

const BatchEditEngineerInfoTable: React.FC<BatchEditEngineerInfoProps> = (props) => {
  const { excelModalData = [], refreshEvent } = props;
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });

  const [engineerInfo, setEngineerInfo] = useState<any[]>([]);
  const [currentChooseEngineerInfo, setCurrentChooseEngineerInfo] = useState<any>();

  const [currentClickEngineerInfo, setCurrentClickEngineerInfo] = useState<any>();
  const [currentClickProjectInfo, setCurrentClickProjectInfo] = useState<any>();

  const [editEngineerModalVisible, setEditEngineerModalVisible] = useState<boolean>(false);
  const [editProjectModalVisible, setEditProjectModalVisible] = useState<boolean>(false);

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

  const { run: getInventoryOverviewSelectData } = useRequest(getCommonSelectData, { manual: true });

  const { run: getWarehouseSelectData } = useRequest(getCommonSelectData, { manual: true });
  const { run: getCompanySelectData } = useRequest(getCommonSelectData, { manual: true });
  const { run: getDepartmentSelectData } = useRequest(getCommonSelectData, { manual: true });

  const { data: libSelectData = [] } = useGetSelectData({
    url: '/ResourceLib/GetList?status=1',
    requestSource: 'resource',
    titleKey: 'libName',
    valueKey: 'id',
  });

  useEffect(() => {
    const newData = excelModalData?.map((item: any, index: any) => {
      return {
        ...item,
        id: uuid.v1(),
        checked: index === 0 ? true : false,
        index: index,
        areaChange: false,
        libChange: false,
        companyChange: false,
        selectData: {
          inventoryOverviewSelectData: [],
          warehouseSelectData: [],
          companySelectData: [],
          departmentSelectData: [],
        },
      };
    });
    setEngineerInfo(newData);
    setCurrentChooseEngineerInfo(newData[0]);
  }, [JSON.stringify(excelModalData)]);

  const areaChangeEvent = async (value: any, numberIndex: number) => {
    let [province, city, area] = value;
    if (city?.indexOf('null') != -1) {
      city = '';
    }
    if (area?.indexOf('null') != -1) {
      area = '';
    }
    const copyEngineerInfo = cloneDeep(engineerInfo);

    const warehouseSelectData = await getWarehouseSelectData({
      url: '/WareHouse/GetWareHouseListByArea',
      method: 'post',
      postType: 'query',
      params: { area: province },
      requestSource: 'resource',
    });

    // const { data: warehouseSelectData = [] } = useGetSelectData(
    //   {
    //     url: '/WareHouse/GetWareHouseListByArea',
    //     extraParams: { area: province },
    //     requestSource: 'resource',
    //     method: 'post',
    //     postType: 'query',
    //   },
    //   { ready: !!province, refreshDeps: [province] },
    // );

    const companySelectData = await getCompanySelectData({
      url: '/ElectricityCompany',
      method: 'get',
      params: { area: province },
      requestSource: 'resource',
    });
    // const { data: companySelectData = [] } = useGetSelectData(
    //   {
    //     url: `/ElectricityCompany?area=${province}`,
    //     // extraParams: { area: areaId },
    //     titleKey: 'companyName',
    //     valueKey: 'companyName',
    //     requestSource: 'resource',
    //   },
    //   { ready: !!province, refreshDeps: [province] },
    // );

    const handleWarehouseSelectData = warehouseSelectData?.map((item: any) => {
      return {
        label: item.text,
        value: item.value,
      };
    });

    const handleCompanySelectData = companySelectData?.map((item: any) => {
      return {
        label: item.companyName,
        value: item.companyName,
      };
    });

    const handleData = copyEngineerInfo.map((item, index) => {
      if (index === numberIndex) {
        const handleProjects = item.projects.map((ite: any) => {
          return {
            ...ite,
            powerSupply: null,
          };
        });
        return {
          ...item,
          areaChange: true,
          companyChange: true,
          checked: true,
          engineer: {
            ...item.engineer,
            province,
            city,
            area,
            warehouseId: null,
            company: null,
          },
          selectData: {
            ...item.selectData,
            warehouseSelectData: handleWarehouseSelectData,
            companySelectData: handleCompanySelectData,
            departmentSelectData: [],
          },
          projects: handleProjects,
        };
      }
      return { ...item, checked: false };
    });

    const finalyResultData = handleWillStateEngineerInfo(handleData);
    setEngineerInfo(finalyResultData);
    setCurrentChooseEngineerInfo(finalyResultData[numberIndex]);
  };

  const libChangeEvent = async (value: any, numberIndex: number) => {
    const copyEngineerInfo = cloneDeep(engineerInfo);
    const inventoryOverviewSelectData = await getInventoryOverviewSelectData({
      url: '/Inventory/GetListByResourceLibId',
      params: { libId: value },
      requestSource: 'resource',
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
          libChange: true,
          checked: true,
          engineer: {
            ...item.engineer,
            libId: value,
            inventoryOverviewId: null,
          },
          selectData: {
            ...item.selectData,
            inventoryOverviewSelectData: handleInventoryOverviewSelectData,
          },
        };
      }
      return { ...item, checked: false };
    });

    const finalyResultData = handleWillStateEngineerInfo(handleData);
    setEngineerInfo(finalyResultData);
    setCurrentChooseEngineerInfo(finalyResultData[numberIndex]);
  };

  const wareHouseChangeEvent = (value: any, numberIndex: number) => {
    const copyEngineerInfo = cloneDeep(engineerInfo);

    const handleData = copyEngineerInfo.map((item, index) => {
      if (index === numberIndex) {
        return {
          ...item,
          checked: true,
          engineer: {
            ...item.engineer,
            warehouseId: value,
          },
        };
      }
      return { ...item, checked: false };
    });

    const finalyResultData = handleWillStateEngineerInfo(handleData);
    setEngineerInfo(finalyResultData);
    setCurrentChooseEngineerInfo(finalyResultData[numberIndex]);
  };

  const companyChangeEvent = async (value: any, numberIndex: number) => {
    const copyEngineerInfo = cloneDeep(engineerInfo);

    const departmentSelectData = await getDepartmentSelectData({
      url: '/ElectricityCompany/GetPowerSupplys',
      method: 'post',
      params: { areaId: copyEngineerInfo[numberIndex].engineer.areaId, company: value },
      requestSource: 'project',
    });

    const handleDepartmentSelectData = departmentSelectData.map((item: any) => {
      return {
        label: item.text,
        value: item.value,
      };
    });

    const handleData = copyEngineerInfo.map((item, index) => {
      if (index === numberIndex) {
        const handleProjects = item.projects.map((ite: any) => {
          return {
            ...ite,
            powerSupply: null,
          };
        });
        return {
          ...item,
          index: numberIndex,
          companyChange: true,
          checked: true,
          engineer: {
            ...item.engineer,
            company: value,
          },
          selectData: {
            ...item.selectData,
            departmentSelectData: handleDepartmentSelectData,
          },
          projects: handleProjects,
        };
      }
      return { ...item, checked: false };
    });

    const finalyResultData = handleWillStateEngineerInfo(handleData);
    setEngineerInfo(finalyResultData);
    setCurrentChooseEngineerInfo(finalyResultData[numberIndex]);
  };

  const inventoryOverviewChange = (value: any, numberIndex: number) => {
    const copyEngineerInfo = cloneDeep(engineerInfo);

    const handleData = copyEngineerInfo.map((item, index) => {
      if (index === numberIndex) {
        return {
          ...item,
          checked: true,
          engineer: {
            ...item.engineer,
            inventoryOverviewId: value,
          },
        };
      }
      return { ...item, checked: false };
    });

    const finalyResultData = handleWillStateEngineerInfo(handleData);
    setEngineerInfo(finalyResultData);
    setCurrentChooseEngineerInfo(finalyResultData[numberIndex]);
  };

  const checkboxChangeEvent = (value: any, numberIndex: number) => {
    const copyEngineerInfo = cloneDeep(engineerInfo);

    const handleData = copyEngineerInfo.map((item, index) => {
      if (index === numberIndex) {
        setCurrentChooseEngineerInfo({ ...item, index: numberIndex });
        return {
          ...item,
          checked: true,
        };
      }

      return {
        ...item,
        checked: false,
      };
    });

    const finalyResultData = handleWillStateEngineerInfo(handleData);
    setEngineerInfo(finalyResultData);
    setCurrentChooseEngineerInfo(finalyResultData[numberIndex]);
  };

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
        <tr key={item.id} className={item.checked ? styles.checked : ''}>
          <td>
            <Checkbox
              onChange={(checked) => checkboxChangeEvent(checked, index)}
              checked={item.checked}
            />
          </td>
          <td>{item.engineer.name}</td>
          <td>
            <Cascader
              style={{ width: '100%' }}
              value={provinceValue}
              allowClear={false}
              onChange={(value) => areaChangeEvent(value, index)}
              options={afterHandleData}
            />
          </td>
          <td>
            <DataSelect
              style={{ width: '100%' }}
              value={item.engineer.libId}
              onChange={(value) => libChangeEvent(value, index)}
              options={libSelectData}
              placeholder="-资源库-"
            />
          </td>
          <td>
            <DataSelect
              style={{ width: '100%' }}
              value={item.engineer.inventoryOverviewId}
              onChange={(value) => inventoryOverviewChange(value, index)}
              options={
                item.selectData.inventoryOverviewSelectData?.length !== 0
                  ? item.selectData.inventoryOverviewSelectData
                  : [{ label: '无', value: 'none' }]
              }
              placeholder="请先选择资源库"
            />
          </td>
          <td>
            <DataSelect
              style={{ width: '100%' }}
              value={item.engineer.warehouseId}
              onChange={(value) => wareHouseChangeEvent(value, index)}
              options={
                item.selectData.warehouseSelectData !== undefined
                  ? item.selectData.warehouseSelectData
                  : [{ label: '无', value: 'none' }]
              }
              placeholder="请先选择区域"
            />
          </td>
          <td>
            <DataSelect
              style={{ width: '100%' }}
              value={item.engineer.company}
              onChange={(value) => companyChangeEvent(value, index)}
              options={item.selectData.companySelectData}
              placeholder="请先选择区域"
            />
          </td>
          <td>
            <Button type="text" onClick={() => editEngineerInfo({ ...item, index })}>
              <span className="canClick">编辑</span>
            </Button>
          </td>
        </tr>
      );
    }
    return (
      <tr key={item.id} className={item.checked ? styles.checked : ''}>
        <td>
          <Checkbox
            onChange={(checked) => checkboxChangeEvent(checked, index)}
            checked={item.checked}
          />
        </td>
        <td>{item.engineer.name}</td>
        <td>
          <Cascader
            style={{ width: '100%' }}
            value={provinceValue}
            allowClear={false}
            onChange={(value) => areaChangeEvent(value, index)}
            options={afterHandleData}
            placeholder="同上"
          />
        </td>
        <td>
          <DataSelect
            style={{ width: '100%' }}
            value={item.engineer.libId}
            onChange={(value) => libChangeEvent(value, index)}
            options={libSelectData}
            placeholder="同上"
          />
        </td>
        <td>
          <DataSelect
            style={{ width: '100%' }}
            value={item.engineer.inventoryOverviewId}
            onChange={(value) => inventoryOverviewChange(value, index)}
            options={item.selectData.inventoryOverviewSelectData}
            placeholder={item.libChange ? '请选择' : '同上'}
          />
        </td>
        <td>
          <DataSelect
            style={{ width: '100%' }}
            value={item.engineer.warehouseId}
            onChange={(value) => wareHouseChangeEvent(value, index)}
            options={item.selectData.warehouseSelectData}
            placeholder={item.areaChange ? '请选择' : '同上'}
          />
        </td>
        <td>
          <DataSelect
            style={{ width: '100%' }}
            value={item.engineer.company}
            onChange={(value) => companyChangeEvent(value, index)}
            options={item.selectData.companySelectData}
            placeholder={item.areaChange ? '请选择' : '同上'}
          />
        </td>
        <td>
          <Button type="text" onClick={() => editEngineerInfo({ ...item, index })}>
            <span className="canClick">编辑</span>
          </Button>
        </td>
      </tr>
    );
  });

  const departmentChangeEvent = (value: any, numberIndex: number) => {
    const copyProjectInfo = cloneDeep(currentChooseEngineerInfo.projects);

    const handleData = copyProjectInfo.map((item: any, index: number) => {
      if (index === numberIndex) {
        return {
          ...item,
          powerSupply: value,
        };
      }

      return item;
    });

    const copyEngineerInfo = cloneDeep(engineerInfo);
    const handleEngineerData = copyEngineerInfo.map((item: any, index: number) => {
      if (item.checked) {
        return {
          ...item,
          projects: handleData,
        };
      }
      return item;
    });

    setCurrentChooseEngineerInfo({
      ...currentChooseEngineerInfo,
      index: numberIndex,
      projects: handleData,
    });

    const finalyResultData = handleWillStateEngineerInfo(handleEngineerData);
    setEngineerInfo(finalyResultData);
    //setCurrentChooseEngineerInfo(finalyResultData[numberIndex]);
  };

  const projectTrElement = currentChooseEngineerInfo?.projects.map((item: any, index: number) => {
    if (index === 0) {
      return (
        <tr key={`${currentChooseEngineerInfo.id}_${index}`}>
          <td>{item.name}</td>
          <td>
            <DataSelect
              style={{ width: '100%' }}
              value={item.powerSupply}
              onChange={(value) => departmentChangeEvent(value, index)}
              options={currentChooseEngineerInfo.selectData.departmentSelectData}
              placeholder={
                currentChooseEngineerInfo.index === 0 || currentChooseEngineerInfo.companyChange
                  ? '部组'
                  : '同上'
              }
            />
          </td>
          <td>
            <Button type="text" onClick={() => editProjectInfo({ ...item, index })}>
              <span className="canClick">编辑</span>
            </Button>
          </td>
        </tr>
      );
    }
    return (
      <tr key={`${currentChooseEngineerInfo.id}_${index}`}>
        <td>{item.name}</td>
        <td>
          <DataSelect
            style={{ width: '100%' }}
            value={item.powerSupply}
            onChange={(value) => departmentChangeEvent(value, index)}
            options={currentChooseEngineerInfo.selectData.departmentSelectData}
            placeholder="同上"
          />
        </td>
        <td>
          <Button type="text" onClick={() => editProjectInfo({ ...item, index })}>
            <span className="canClick">编辑</span>
          </Button>
        </td>
      </tr>
    );
  });

  const judgeCanSaveFunction = () => {
    const copyEngineerInfo = cloneDeep(engineerInfo);
    let canSave = true;
    const errorInfo: {
      wareHouseNoChoose: any[];
      companyNoChoose: any[];
      departmentNoChoose: any[];
      inventoryOverviewNoChoose: any[];
    } = {
      wareHouseNoChoose: [],
      companyNoChoose: [],
      departmentNoChoose: [],
      inventoryOverviewNoChoose: [],
    };
    copyEngineerInfo.forEach((item, index) => {
      if (item.areaChange) {
        if (!item.engineer.warehouseId) {
          canSave = false;
          errorInfo.wareHouseNoChoose.push(item.engineer);
        }
        if (!item.engineer.company) {
          canSave = false;
          errorInfo.companyNoChoose.push(item.engineer);
        }
      }
      if (item.companyChange) {
        if (item.projects && item.projects.length > 0) {
          if (!item.projects[0].powerSupply) {
            canSave = false;
            errorInfo.departmentNoChoose.push(item.engineer);
          }
        }
      }
      if (item.libChange) {
        if (!item.engineer.inventoryOverviewId) {
          canSave = false;
          errorInfo.inventoryOverviewNoChoose.push(item.engineer);
        }
      }
    });
    return {
      canSave,
      errorInfo,
    };
  };

  const handleFinallyData = () => {
    const saveData = cloneDeep(engineerInfo).map((item) => {
      return {
        engineer: item.engineer,
        projects: item.projects,
      };
    });
    const engineerKeys = [
      'area',
      'city',
      'province',
      'warehouseId',
      'libId',
      'inventoryOverviewId',
      'company',
    ];

    // projects 里面的供应组也要同上
    saveData.forEach((item, index) => {
      const sliceData = saveData.slice(0, index);

      // 如果没有值，才需要做处理
      if (!item.engineer['company']) {
        const hasValueData = sliceData.filter((it) => it.engineer['company']);

        if (hasValueData && hasValueData.length > 0) {
          // 找这个数据下的projects 第一个的 powerSupply

          const thisPowerSupply = hasValueData[hasValueData.length - 1].projects[0].powerSupply;

          item.projects.forEach((it: any) => {
            it.powerSupply = thisPowerSupply;
          });
        }
      } else {
        item.projects.forEach((ite: any, ind: number) => {
          if (!ite['powerSupply']) {
            const copyProjects = cloneDeep(item.projects);
            const sliceProjectData = copyProjects.slice(0, ind);

            const hasThisValueData = sliceProjectData.filter((it: any) => it['powerSupply']);

            if (hasThisValueData && hasThisValueData.length > 0) {
              ite['powerSupply'] = hasThisValueData[hasThisValueData.length - 1]['powerSupply'];
            }
          }
        });
      }
    });

    saveData.forEach((item, index) => {
      if (index > 0) {
        engineerKeys.forEach((ite: any) => {
          // 如果没有值，才需要做处理
          if (!item.engineer[ite]) {
            const sliceData = saveData.slice(0, index);

            const hasValueData = sliceData.filter((it) => it.engineer[ite]);

            if (hasValueData && hasValueData.length > 0) {
              item.engineer[ite] = hasValueData[hasValueData.length - 1].engineer[ite];
            }
          }
        });
      }
    });
    return saveData;
  };

  const closeModalEvent = () => {
    setState(false);
  };

  //批量上传
  const saveBatchAddProjectEvent = async () => {
    // 如果存在含 areaChange、companyChange、libChange 为true的选型，如果没有重新选值，那么就不进行保存
    const judgeInfo = judgeCanSaveFunction();
    if (!judgeInfo.canSave) {
      let tipMessage = '';
      if (judgeInfo.errorInfo.wareHouseNoChoose.length > 0) {
        judgeInfo.errorInfo.wareHouseNoChoose.forEach((item, index) => {
          tipMessage = tipMessage + item.name;
        });
        tipMessage += '未选择利旧协议库。';
      }

      if (judgeInfo.errorInfo.companyNoChoose.length > 0) {
        judgeInfo.errorInfo.companyNoChoose.forEach((item, index) => {
          tipMessage = tipMessage + item.name;
        });
        tipMessage += '未选择所属公司。';
      }

      if (judgeInfo.errorInfo.inventoryOverviewNoChoose.length > 0) {
        judgeInfo.errorInfo.inventoryOverviewNoChoose.forEach((item, index) => {
          tipMessage = tipMessage + item.name;
        });
        tipMessage += '未选择协议库。';
      }

      if (judgeInfo.errorInfo.departmentNoChoose.length > 0) {
        judgeInfo.errorInfo.departmentNoChoose.forEach((item, index) => {
          tipMessage = tipMessage + item.name;
        });
        tipMessage += '下第一个项目未选择部组。';
      }
      message.error(tipMessage);
      return;
    }

    const submitInfo = handleFinallyData();
    await importBulkEngineerProject({ datas: submitInfo });
    setState(false);
    message.success('批量立项成功');
    refreshEvent?.();
  };

  const engineerFinishEditInfo = (values: any) => {
    const copyEngineerInfo = cloneDeep(engineerInfo);
    //copyEngineerInfo.splice(values.index, 1, values);

    const handleResultData = copyEngineerInfo.map((item, index) => {
      if (index === values.index) {
        return { ...values, checked: true };
      }
      return { ...item, checked: false };
    });

    const finalyResultData = handleWillStateEngineerInfo(handleResultData);
    setEngineerInfo(finalyResultData);

    setCurrentChooseEngineerInfo(finalyResultData[values.index]);
  };

  const projectFinishEditInfo = (values: any) => {
    const copyEngineerInfo = cloneDeep(engineerInfo);

    copyEngineerInfo.splice(values.index, 1, values);

    const finalyResultData = handleWillStateEngineerInfo(copyEngineerInfo);
    setEngineerInfo(finalyResultData);
    setCurrentChooseEngineerInfo(values);
  };

  const editEngineerInfo = (engineerInfo: any) => {
    setEditEngineerModalVisible(true);
    setCurrentClickEngineerInfo(engineerInfo);
  };

  const editProjectInfo = (projectInfo: any) => {
    setEditProjectModalVisible(true);
    setCurrentClickProjectInfo(projectInfo);
  };

  // 每一次设置engineerInfo的时候，需要把数据进行处理，可以获取到上面的select
  const handleWillStateEngineerInfo = (willStateEngineerInfo: any) => {
    const copyData = cloneDeep(willStateEngineerInfo);
    const engineerKeys = ['warehouseId', 'inventoryOverviewId', 'company'];

    copyData.forEach((item: any, index: number) => {
      if (index > 0) {
        engineerKeys.forEach((ite: any) => {
          // 如果没有值，并且这个数据的item的area没有发生过变化，那么可以更新同步  warehouseSelectData， companySelectData
          if (!item.engineer[ite] && ite === 'warehouseId' && !item.areaChange) {
            const sliceData = copyData.slice(0, index);

            const hasValueData = sliceData.filter((it: any) => it.engineer[ite]);

            if (hasValueData && hasValueData.length > 0) {
              item.selectData.warehouseSelectData =
                hasValueData[hasValueData.length - 1].selectData.warehouseSelectData;
            }
          }

          if (!item.engineer[ite] && ite === 'company') {
            const sliceData = copyData.slice(0, index);

            const hasValueData = sliceData.filter((it: any) => it.engineer[ite]);

            if (hasValueData && hasValueData.length > 0) {
              if (!item.areaChange) {
                item.selectData.companySelectData =
                  hasValueData[hasValueData.length - 1].selectData.companySelectData;
              }
              if (!item.companyChange) {
                item.selectData.departmentSelectData =
                  hasValueData[hasValueData.length - 1].selectData.departmentSelectData;
              }
            }
          }

          if (!item.engineer[ite] && ite === 'inventoryOverviewId') {
            const sliceData = copyData.slice(0, index);

            const hasValueData = sliceData.filter((it: any) => it.engineer[ite]);

            if (hasValueData && hasValueData.length > 0) {
              if (!item.libChange) {
                item.selectData.inventoryOverviewSelectData =
                  hasValueData[hasValueData.length - 1].selectData.inventoryOverviewSelectData;
              }
            }
          }
        });
      }
    });

    return copyData;
  };

  return (
    <>
      <Modal
        maskClosable={false}
        width="98%"
        bodyStyle={{ height: 700, overflowY: 'auto', padding: '0' }}
        centered
        title="立项批量导入"
        visible={state as boolean}
        okText="保存"
        onOk={() => saveBatchAddProjectEvent()}
        onCancel={() => closeModalEvent()}
      >
        <CyTip>
          立项批量导入模板中的工程/项目信息已经录入，但是还需要您对其他一些选项进行补充选择，请完善一下所有工程以及项目的信息，确认无误后点击【保存】按钮，随后会为您创建好所有项目
        </CyTip>
        <div className={styles.batchEditEngineerInfoTable}>
          <div className={styles.batchEditEngineerTableContent}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th>工程名称</th>
                  <th>区域</th>
                  <th>资源库</th>
                  <th>协议库</th>
                  <th>利旧协议库</th>
                  <th>所属公司</th>
                  <th style={{ width: '100px' }}>已录入信息</th>
                </tr>
              </thead>
              <tbody>{engineerTrElement}</tbody>
            </table>
          </div>
          <div className={styles.batchEditProjectTable}>
            <div className={styles.currentControlEngineer}>
              {currentChooseEngineerInfo?.engineer?.name}
            </div>
            <table>
              <thead>
                <tr>
                  <th>项目名称</th>
                  <th style={{ width: '140px' }}>供电公司/班组</th>
                  <th style={{ width: '100px' }}>已录入信息</th>
                </tr>
              </thead>
              <tbody>{projectTrElement}</tbody>
            </table>
          </div>
        </div>
      </Modal>
      {editEngineerModalVisible && (
        <EditBulkEngineer
          engineerInfo={currentClickEngineerInfo}
          finishEvent={engineerFinishEditInfo}
          visible={editEngineerModalVisible}
          onChange={setEditEngineerModalVisible}
        />
      )}

      {editProjectModalVisible && (
        <EditBulkProject
          projectInfo={currentClickProjectInfo}
          finishEvent={projectFinishEditInfo}
          visible={editProjectModalVisible}
          onChange={setEditProjectModalVisible}
          currentChooseEngineerInfo={currentChooseEngineerInfo}
          // setCurrent={setCurrentChooseEngineerInfo}
        />
      )}
    </>
  );
};

export default BatchEditEngineerInfoTable;
