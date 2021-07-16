import React, { useMemo, useState } from 'react';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Button, Checkbox, Spin, Tooltip } from 'antd';
import { useBoolean, useRequest } from 'ahooks';
import { TableContext } from '@/pages/project-management/all-project-new/components/engineer-table/table-store';

import styles from './index.less';
import moment from 'moment';
import EmptyTip from '@/components/empty-tip';
import { useContext } from 'react';
import { useEffect } from 'react';
import ScrollView from 'react-custom-scrollbars';
import { isNumber } from 'lodash';
import uuid from 'node-uuid';
import CyTag from '@/components/cy-tag';
import { getProjectsInfo } from '@/services/personnel-config/work-handover';

export interface AddProjectValue {
  engineerId: string;
  areaId: string;
  company: string;
  companyName: string;
}

const colorMap = {
  立项: 'green',
  委托: 'blue',
  共享: 'yellow',
  执行: 'yellow',
};

interface EngineerTableItemProps {
  userId: string;
  category: number;
  projectInfo: any;
  columns: any[];
  onChange?: (checkedValue: TableItemCheckedInfo) => void;
  getClickProjectId: (clickProjectId: string) => void;
  left: number;
  isOverflow: boolean;
  columnsWidth: number;
  contentWidth: number;
}
interface TableCheckedItemProjectInfo {
  id: string;
  isAllChecked: boolean;
  status?: any;
  name?: any;
  dataSourceType?: number[];
}

export interface TableItemCheckedInfo {
  projectInfo: TableCheckedItemProjectInfo;
  checkedArray: string[];
}

const EngineerTableList: React.FC<EngineerTableItemProps> = (props) => {
  const { userId, category } = props;
  // const [isFold, { toggle: foldEvent }] = useBoolean(false);

  const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = React.useState(false);

  const [engineerIds, setEngineerIds] = useState<string[]>([]);
  const [checkAll, setCheckAll] = React.useState(false);

  const { data: tableData, loading } = useRequest(() => getProjectsInfo({ userId, category }), {
    ready: !!userId,
    onSuccess: () => {
      setCopyTableData(tableData);
    },
  });

  const [copyTableData, setCopyTableData] = useState<any[]>([]);

  const handleTableData = useMemo(() => {
    if (tableData) {
      return tableData?.map((item: any) => {
        return (item = { ...item, isChecked: false, isFold: false });
      });
    }
  }, [JSON.stringify(tableData)]);

  console.log(handleTableData);

  const {
    projectInfo = {},
    columns = [],
    onChange,
    getClickProjectId,

    left,
    isOverflow = false,
    // columnsWidth,
    contentWidth,
  } = props;

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
        dataSourceType: projectInfo.projects
          .map((item: any) => {
            if (list.includes(item.id)) {
              return item.dataSourceType;
            }
          })
          .filter((item: any) => isNumber(item)),
      },
      checkedArray: list as string[],
    });
  };

  //列表字段
  const listColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 400,
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
      ellipsis: true,
    },
    {
      title: '项目起止时间',
      dataIndex: 'projectTime',
      width: 200,
      ellipsis: true,
      render: (record: any) => {
        const { startTime, endTime } = record;
        if (startTime && endTime) {
          return `${moment(startTime).format('YYYY-MM-DD')} 至 ${moment(endTime).format(
            'YYYY-MM-DD',
          )}`;
        }
        if (startTime && !endTime) {
          return `开始时间: ${moment(startTime).format('YYYY-MM-DD')}`;
        }
        if (!startTime && endTime) {
          return `截止时间: ${moment(startTime).format('YYYY-MM-DD')}`;
        }
        return '未设置起止时间';
      },
    },
    {
      title: '专业类别',
      dataIndex: 'majorCategoryText',
      width: 150,
      ellipsis: true,
      render: (record: any) => {
        return record.majorCategoryText;
      },
    },
    {
      title: '项目阶段',
      dataIndex: 'stageText',
      width: 150,
      ellipsis: true,
      render: (record: any) => {
        return record.stageText;
      },
    },
    {
      title: '勘察人',
      dataIndex: 'surveyUser',
      width: 150,
      ellipsis: true,
      render: (record: any) => {
        return record.surveyUser ? `${record.surveyUser.value}` : '无需安排';
      },
    },
    {
      title: '设计人',
      dataIndex: 'designUser',
      width: 150,
      ellipsis: true,
      render: (record: any) => {
        return record.designUser ? `${record.designUser.value}` : '';
      },
    },
    {
      title: '项目来源',
      dataIndex: 'sources',
      width: 140,
      render: (record: any) => {
        const { sources = [] } = record;
        return sources.map((item: any) => {
          return (
            <span key={uuid.v1()}>
              <CyTag color={colorMap[item] ? colorMap[item] : 'green'}>
                <span>{item}</span>
              </CyTag>
            </span>
          );
        });
      },
    },
    {
      title: '项目身份',
      dataIndex: 'identitys',
      width: 200,
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
      title: '项目状态',
      dataIndex: 'status',
      width: 180,
      render: (record: any) => {
        const { stateInfo, allot, identitys } = record;
        let arrangeType: any = null;
        let allotCompanyId: any = null;

        if (allot) {
          arrangeType = allot.allotType;
          allotCompanyId = allot.allotCompanyGroup;
        }
        return (
          <>
            <span>{stateInfo?.statusText}</span>
          </>
        );
      },
    },
  ];

  const columnsWidth = listColumns.reduce((sum, item) => {
    return sum + (item.width ? item.width : 100);
  }, 0);

  // const checkAllEvent = (e: any) => {
  //   setCheckedList(e.target.checked ? valueList : []);
  //   setIndeterminate(false);
  //   setCheckAll(e.target.checked);

  //   onChange?.({
  //     projectInfo: {
  //       id: projectInfo.id,
  //       isAllChecked: e.target.checked,
  //       status: projectInfo.projects
  //         .map((item: any) => {
  //           if (valueList.includes(item.id)) {
  //             return item.stateInfo;
  //           }
  //         })
  //         .filter(Boolean),
  //       name: projectInfo.projects
  //         .map((item: any) => {
  //           if (valueList.includes(item.id)) {
  //             return item.name;
  //           }
  //         })
  //         .filter(Boolean),
  //       dataSourceType: projectInfo.projects
  //         .map((item: any) => {
  //           if (valueList.includes(item.id)) {
  //             return item.dataSourceType;
  //           }
  //         })
  //         .filter((item: any) => isNumber(item)),
  //     },
  //     checkedArray: e.target.checked ? valueList : [],
  //   });
  // };

  const projectNameClickEvent = (projectId: string) => {
    getClickProjectId?.(projectId);
  };

  // useEffect(() => {
  //   if (tableData.length === 0) {
  //     setCheckedList([]);
  //     setCheckAll(false);
  //   }
  // }, [JSON.stringify(tableData)]);

  const theadElement = useMemo(() => {
    return listColumns.map((item) => {
      return (
        <div
          className={styles.engineerTableTh}
          key={`${item.dataIndex}`}
          style={{
            width: `${item.width}px`,
            flex: `${item.dataIndex === 'name' ? '1' : 'none'}`,
          }}
        >
          {item.title}
        </div>
      );
    });
  }, [
    JSON.stringify(tableData),
    left,
    contentWidth,
    isOverflow,
    JSON.stringify(columns),
    columnsWidth,
  ]);

  // const tbodyElement = useMemo(() => {
  //   return (projectInfo.projects ?? []).map((item: any) => {
  //     return (

  //     );
  //   });
  // }, [
  //   JSON.stringify(projectInfo),
  //   left,
  //   contentWidth,
  //   isOverflow,
  //   JSON.stringify(columns),
  //   columnsWidth,
  // ]);

  const checkProjectEvent = (item: any) => {
    console.log(item.isChecked);
    item.isChecked = !item.isChecked;
  };
  // console.log(engineerIds);

  const foldChangeEvent = (item: any) => {
    const copyData = handleTableData;
    const index = copyData.findIndex((ite: any) => ite.id === item.id);

    console.log(item.isFold);

    copyData[index].isFold = !copyData[index].isFold;
    setCopyTableData(copyData);
  };

  const projectTable = handleTableData?.map((item: any) => {
    return (
      <div
        className={`${styles.engineerTableItem} ${isOverflow ? styles.overflowTable : ''}`}
        key={item.id}
      >
        <div className={styles.engineerTableItemHeader} style={{ left: `${left}px` }}>
          <div className={styles.foldButton} onClick={() => foldChangeEvent(item)}>
            <span>{item.isFold ? <CaretUpOutlined /> : <CaretDownOutlined />}</span>
          </div>
          <div className={styles.engineerName}>
            <Checkbox
              onChange={() => checkProjectEvent(item)}
              style={{ marginRight: '7px' }}
              indeterminate={indeterminate}
              checked={item.isChecked}
            />
            <Tooltip title={item.name}>
              <u
                className={`canClick ${styles.engineerNameContent}`}
                onClick={() => projectNameClickEvent(item.id)}
              >
                {item.name}
              </u>
            </Tooltip>
          </div>
          <div className={styles.projectAccount}>
            <span className={styles.label}>共有项目:</span>
            <span>{item.projects ? item.projects?.length : 0}个</span>
          </div>
          <div className={styles.projectTime}>
            <span className={styles.label}>工程日期:</span>
            <span>{item.startTime ? moment(item.startTime).format('YYYY/MM/DD') : ''}</span>
            <span>-{item.startTime ? moment(item.endTime).format('YYYY/MM/DD') : ''}</span>
          </div>
          <div className={styles.createTime}>
            <span className={styles.label}>编制日期:</span>
            <span>{item.compileTime ? moment(item.compileTime).format('YYYY/MM/DD') : ''}</span>
          </div>
        </div>
        <div
          className={styles.engineerTableBody}
          style={{ width: isOverflow ? `${columnsWidth}px` : '100%' }}
        >
          {!item.isFold && item.projects && item.projects.length > 0 && (
            <Checkbox.Group value={checkedList} onChange={checkboxChange}>
              <div className={styles.engineerTable}>
                <div className={styles.engineerTableContent}>
                  <div className={styles.engineerTableHeader}>
                    <div
                      className={`${styles.engineerTableTh} ${styles.engineerTableThCheckbox}`}
                      style={{ width: '38px', left: `${left}px` }}
                    ></div>
                    {theadElement}
                  </div>
                  <div className={styles.engineerTableBody}>
                    {(item.projects ?? []).map((pro: any) => {
                      return (
                        <div key={`${pro.id}Td`} className={styles.engineerTableTr}>
                          <div
                            className={`${styles.engineerTableTd} ${styles.engineerTableThCheckbox}`}
                            style={{ width: '38px', left: `${left}px` }}
                          >
                            {false && <Checkbox style={{ marginLeft: '4px' }} value={pro.id} />}
                          </div>
                          {listColumns.map((ite) => {
                            return (
                              <div
                                className={styles.engineerTableTd}
                                key={`${pro.id}Td${ite.dataIndex}`}
                                style={{
                                  width: `${ite.width}px`,
                                  flex: `${ite.dataIndex === 'name' ? '1' : 'none'}`,
                                }}
                              >
                                {ite.ellipsis ? (
                                  // eslint-disable-next-line no-nested-ternary
                                  <Tooltip
                                    title={
                                      typeof pro[ite.dataIndex] === 'string'
                                        ? pro[ite.dataIndex]
                                        : ite.render
                                        ? ite.render(pro, item)
                                        : ''
                                    }
                                  >
                                    {ite.render ? ite.render(pro, item) : item[ite.dataIndex]}
                                  </Tooltip>
                                ) : (
                                  <span>
                                    {ite.render ? ite.render(pro, item) : item[ite.dataIndex]}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Checkbox.Group>
          )}
          {!item.isFold && (!item.projects || (item.projects && item.projects.length === 0)) && (
            <div className={styles.noEngineerData}>
              <EmptyTip className="pt20 pb20" description="暂无交接的内容" />
            </div>
          )}
        </div>
      </div>
    );
  });

  return (
    <div className={styles.engineerTable}>
      <div className={styles.engineerTableContent}>
        {/* <ScrollView
          ref={scrollbar}
          onUpdate={scrollEvent}
          renderThumbHorizontal={scrollBarRenderView}
          renderThumbVertical={scrollBarRenderView}
        > */}
        <Spin spinning={loading}>
          {handleTableData?.length > 0 && projectTable}
          {handleTableData?.length === 0 && <EmptyTip className="pt20" />}
        </Spin>
        {/* </ScrollView> */}
      </div>
      <div className={styles.engineerTablePaging}>
        <div className={styles.engineerTablePagingLeft}>
          <span>总共</span>
          <span className={styles.importantTip}>{handleTableData?.length}</span>
          <span>个工程，</span>
          {/* <span className={styles.importantTip}>{tableData?.projectLen}</span>个项目 */}
        </div>
      </div>
    </div>
  );
};
export default EngineerTableList;
