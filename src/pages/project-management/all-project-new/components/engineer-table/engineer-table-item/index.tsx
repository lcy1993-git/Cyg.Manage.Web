import React, { useMemo } from 'react';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { BarsOutlined, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Button, Checkbox, Tooltip } from 'antd';
import { useBoolean } from 'ahooks';

import styles from './index.less';
import moment from 'moment';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import uuid from 'node-uuid';
import EmptyTip from '@/components/empty-tip';
import CyTag from '@/components/cy-tag';
import { Dropdown } from 'antd';
import { Menu } from 'antd';

export interface AddProjectValue {
  engineerId: string;
  areaId: string;
  company: string;
  companyName: string;
}

interface EngineerTableItemProps {
  projectInfo: any;
  columns: any[];
  onChange?: (checkedValue: TableItemCheckedInfo) => void;
  getClickProjectId: (clickProjectId: string) => void;
  addProject?: (needValue: AddProjectValue) => void;
  editEngineer?: (needValue: AddProjectValue) => void;
}
interface TableCheckedItemProjectInfo {
  id: string;
  isAllChecked: boolean;
  status?: any;
  name?: any;
}

export interface TableItemCheckedInfo {
  projectInfo: TableCheckedItemProjectInfo;
  checkedArray: string[];
}

interface JurisdictionInfo {
  canEdit: boolean;
  canCopy: boolean;
}

const colorMap = {
  立项: 'green',
  委托: 'blue',
  共享: 'yellow',
  执行: 'yellow',
};

const EngineerTableItem: React.FC<EngineerTableItemProps> = (props) => {
  const [isFold, { toggle: foldEvent }] = useBoolean(false);

  const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const {
    projectInfo = {},
    //columns = [],
    onChange,
    getClickProjectId,
    addProject,
    editEngineer,
    left
  } = props;




















  
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      render: (record: any) => {
        return (
          <u
            className="canClick"
            // onClick={() => {
            //   setCurrentClickProjectId(record.id);
            //   setProjectModalVisible(true);
            // }}
          >
            {record.name}
          </u>
        );
      },
      // width:'10%'
    },
    {
      title: '项目分类',
      dataIndex: 'categoryText',
      width: '6.15%',
    },
    {
      title: '电压等级',
      dataIndex: 'kvLevelText',
      width: '6.15%',
    },
    {
      title: '项目性质',
      dataIndex: 'natureTexts',
      width: '10%',
      render: (record: any) => {
        const { natureTexts = [] } = record;
        return natureTexts.map((item: any) => {
          return (
            <CyTag key={uuid.v1()} className="mr7">
              {item}
            </CyTag>
          );
        });
      },
    },
    {
      title: '专业类别',
      dataIndex: 'majorCategoryText',
      width: '6.15%',
    },
    {
      title: '建设类型',
      dataIndex: 'constructTypeText',
      width: '5.45%',
    },
    {
      title: '项目批次',
      dataIndex: 'batchText',
      width: '6.15%',
    },
    {
      title: '项目阶段',
      dataIndex: 'stageText',
      width: '5.45%',
    },
    {
      title: '导出坐标权限',
      dataIndex: 'exportCoordinate',
      width: '8.15%',
      render: (record: any) => {
        return record.exportCoordinate === true ? (
          <span className="colorPrimary">启用</span>
        ) : (
          <span className="colorRed">禁用</span>
        );
      },
    },

    {
      title: '项目状态',
      width: '6.15%',
      dataIndex: 'statusText',
      render: (record: any) => {},
    },
    {
      title: '项目来源',
      dataIndex: 'sources',
      width: '6.15%',
      render: (record: any) => {
        const { sources = [] } = record;
        return sources.map((item: any) => {
          return (
            <span key={uuid.v1()}>
              <CyTag color={colorMap[item.text] ? colorMap[item.text] : 'green'}>
                <span>{item}</span>
              </CyTag>
            </span>
          );
        });
      },
    },
    {
      title: '勘察人',
      dataIndex: 'surveyUser',
      width: '6.5%',
      render: (record: any) => {
        return record.surveyUser.value;
      },
    },
    {
      title: '设计人',
      dataIndex: 'designUser',
      width: '6.5%',
      render: (record: any) => {
        return record.designUser.value;
      },
    },
    {
      title: '项目身份',
      dataIndex: 'identitys',
      width: '8%',
      render: (record: any) => {
        const { identitys = [] } = record;
        return identitys
          .filter((item: any) => item.text)
          .map((item: any) => {
            return (
              <span className="mr7" key={uuid.v1()}>
                <CyTag color={colorMap[item.text] ? colorMap[item.text] : 'green'}>
                  {item.text}
                </CyTag>
              </span>
            );
          });
      },
    },
    {
      title: '操作',
      dataIndex: 'operationAuthority',
      width: '60px',
      render: (record: any, engineerInfo: any) => {
        const { operationAuthority } = record;

        return (
          <Dropdown
            overlay={() =>
              projectItemMenu(operationAuthority, record, engineerInfo, record.stateInfo.status)
            }
            placement="bottomLeft"
            arrow
          >
            <BarsOutlined />
          </Dropdown>
        );
      },
    },
  ];

  const projectItemMenu = (
    jurisdictionInfo: JurisdictionInfo,
    tableItemData: any,
    engineerInfo: any,
  ) => {
    return (
      <Menu>
        {jurisdictionInfo.canEdit && buttonJurisdictionArray?.includes('all-project-edit-project') && (
          <Menu.Item
            // onClick={() => {
            //   editProjectEvent({
            //     projectId: tableItemData.id,
            //     areaId: engineerInfo.province,
            //     company: engineerInfo.company,
            //     companyName: engineerInfo.company,
            //     status: tableItemData.stateInfo.status,
            //   });
            // }}
          >
            编辑
          </Menu.Item>
        )}
        {jurisdictionInfo.canCopy && buttonJurisdictionArray?.includes('all-project-copy-project') && (
          <Menu.Item
            // onClick={() =>
            //   copyProjectEvent({
            //     projectId: tableItemData.id,
            //     areaId: engineerInfo.province,
            //     company: engineerInfo.company,
            //     engineerId: engineerInfo.id,
            //     companyName: engineerInfo.company,
            //   })
            // }
          >
            复制项目
          </Menu.Item>
        )}
        {buttonJurisdictionArray?.includes('all-project-check-result') && (
          <Menu.Item
            // onClick={() =>
            //   checkResult({
            //     projectId: tableItemData.id,
            //     projectName: tableItemData.name,
            //     projectStatus: tableItemData.stateInfo.statusText,
            //     projectStage: tableItemData.stageText,
            //   })
            // }
          >
            查看成果
          </Menu.Item>
        )}
      </Menu>
    );
  };

  const valueList = useMemo(() => {
    if (projectInfo.projects) {
      return projectInfo.projects.map((item: any) => item.id);
    }
    return [];
  }, [JSON.stringify(projectInfo.projects)]);

  const checkboxChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < valueList.length);
    setCheckAll(list.length === valueList.length);

    onChange?.({
      projectInfo: {
        id: projectInfo.id,
        isAllChecked: list.length === valueList.length,
        status: projectInfo.projects
          .map((item: any) => {
            if (list.includes(item.id)) {
              return item.stateInfo;
            }
          })
          .filter(Boolean),
        name: projectInfo.projects
          .map((item: any) => {
            if (list.includes(item.id)) {
              return item.name;
            }
          })
          .filter(Boolean),
      },
      checkedArray: list as string[],
    });
  };

  const checkAllEvent = (e: any) => {
    setCheckedList(e.target.checked ? valueList : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);

    onChange?.({
      projectInfo: {
        id: projectInfo.id,
        isAllChecked: e.target.checked,
        status: projectInfo.projects
          .map((item: any) => {
            if (valueList.includes(item.id)) {
              return item.stateInfo;
            }
          })
          .filter(Boolean),
        name: projectInfo.projects
          .map((item: any) => {
            if (valueList.includes(item.id)) {
              return item.name;
            }
          })
          .filter(Boolean),
      },
      checkedArray: e.target.checked ? valueList : [],
    });
  };

  const projectNameClickEvent = (projectId: string) => {
    getClickProjectId?.(projectId);
  };

  const addProjectEvent = () => {
    addProject?.({
      engineerId: projectInfo.id,
      areaId: projectInfo.province,
      company: projectInfo.company,
      companyName: projectInfo.company,
    });
  };

  const editEngineerEvent = () => {
    editEngineer?.({
      engineerId: projectInfo.id,
      areaId: projectInfo.province,
      company: projectInfo.company,
      companyName: projectInfo.company,
    });
  };

  const theadElement = columns.map((item) => {
    return (
      <div
        className={styles.engineerTableTh}
        key={uuid.v1()}
        style={item.width ? { width: `${item.width}` } : { flex: '1' }}
      >
        {item.title}
      </div>
    );
  });

  const tbodyElement = (projectInfo.projects ?? []).map((item: any) => {
    return (
      <div key={uuid.v1()} className={styles.engineerTableTr}>
        <div className={styles.engineerTableTd} style={{ width: '38px' }}>
          <Checkbox style={{ marginLeft: '4px' }} value={item.id} />
        </div>
        {columns.map((ite) => {
          return (
            <div
              className={styles.engineerTableTd}
              key={uuid.v1()}
              style={ite.width ? { width: `${ite.width}` } : { flex: '1' }}
            >
              {ite.render ? ite.render(item, projectInfo) : item[ite.dataIndex]}
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <div className={styles.engineerTableItem}>
      <div className={styles.engineerTableItemHeader} style={{left: `${left}px`}}>
        <div className={styles.foldButton} onClick={() => foldEvent()}>
          <span>{isFold ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
        </div>
        <div className={styles.engineerName}>
          <Checkbox
            onChange={checkAllEvent}
            style={{ marginRight: '7px' }}
            indeterminate={indeterminate}
            checked={checkAll}
          />
          <Tooltip title={projectInfo.name}>
            <u
              className={`canClick ${styles.engineerNameContent}`}
              onClick={() => projectNameClickEvent(projectInfo.id)}
            >
              {projectInfo.name}
            </u>
          </Tooltip>
        </div>
        <div className={styles.projectAccount}>
          <span className={styles.label}>共有项目:</span>
          <span>{projectInfo.projects ? projectInfo.projects?.length : 0}个</span>
        </div>
        <div className={styles.projectTime}>
          <span className={styles.label}>工程日期:</span>
          <span>
            {projectInfo.startTime ? moment(projectInfo.startTime).format('YYYY/MM/DD') : ''}
          </span>
          <span>
            -{projectInfo.startTime ? moment(projectInfo.endTime).format('YYYY/MM/DD') : ''}
          </span>
        </div>
        <div className={styles.createTime}>
          <span className={styles.label}>编制日期:</span>
          <span>
            {projectInfo.compileTime ? moment(projectInfo.compileTime).format('YYYY/MM/DD') : ''}
          </span>
        </div>
        <div className={styles.projectButtons}>
          {projectInfo?.operationAuthority?.canAddProject &&
            buttonJurisdictionArray?.includes('all-project-add-project') && (
              <Button className="mr10" ghost type="primary" onClick={() => addProjectEvent()}>
                新增项目
              </Button>
            )}
          {projectInfo?.operationAuthority?.canEdit &&
            buttonJurisdictionArray?.includes('all-project-edit-engineer') && (
              <Button onClick={() => editEngineerEvent()}>编辑</Button>
            )}
        </div>
      </div>
      <div className={styles.engineerTableBody}>
        {!isFold && projectInfo.projects && projectInfo.projects.length > 0 && (
          <Checkbox.Group value={checkedList} onChange={checkboxChange}>
            <div className={styles.engineerTable}>
              <div className={styles.engineerTableContent}>
                <div className={styles.engineerTableHeader}>
                  <div className={styles.engineerTableTh} style={{ width: '38px' }}></div>
                  {theadElement}
                </div>
                <div className={styles.engineerTableBody}>{tbodyElement}</div>
              </div>
            </div>
          </Checkbox.Group>
        )}
        {!isFold &&
          (!projectInfo.projects ||
            (projectInfo.projects && projectInfo.projects.length === 0)) && (
            <div className={styles.noEngineerData}>
              <EmptyTip className="pt20 pb20" description="该工程下没有项目" />
            </div>
          )}
      </div>
    </div>
  );
};

export default EngineerTableItem;
