import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Button, Checkbox, Spin, Tooltip } from 'antd';
import { useBoolean, useRequest } from 'ahooks';

import styles from './index.less';
import moment from 'moment';
import EmptyTip from '@/components/empty-tip';

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
  onChange?: (checkedValue: TableItemCheckedInfo) => void;
  setEngineerIds?: Dispatch<SetStateAction<string[]>>;
  getClickProjectId?: (clickProjectId: string) => void;
  left?: number;
  isOverflow?: boolean;
  getEngineerData?: Dispatch<SetStateAction<any[]>>;
  checkboxSet?: boolean;
  isFresh?: boolean;
  setIsFresh?: Dispatch<SetStateAction<boolean>>;
  fieldFlag?: boolean;
  getProjectIds?: Dispatch<SetStateAction<string[]>>;
  emitAll: { flag: boolean; state: number };
  setCheckAllisChecked: any;
  setCheckAllisIndeterminate: any;
  doneFlag?: boolean;
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
  const {
    userId,
    category,
    checkboxSet,
    onChange,
    getClickProjectId,
    setEngineerIds,
    left,
    doneFlag,
    isOverflow = false,
    isFresh,
    setIsFresh,
    getEngineerData,
    fieldFlag,
    getProjectIds,
    emitAll,
    setCheckAllisChecked,
    setCheckAllisIndeterminate,
  } = props;

  const [checkedProjectList, setCheckedProjectList] = useState<any[]>([]);

  const [allNum, setAllNum] = React.useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  const [handleTableData, setHandleTableData] = useState([]);

  const [checkedNewList, setCheckedNewList] = React.useState<any[]>([]);
  // 选中所有项目id数组

  const allProjectList = useMemo(() => {
    return handleTableData.map((item: any) => item.id);
  }, [JSON.stringify(handleTableData)]);

  // 所有选中的Id数组
  const allOptions = useMemo(() => {
    return handleTableData.map((item) => {
      const checkedList = item?.projects?.map((e: any) => {
        return e?.id;
      });
      return checkedList;
    });
  }, [handleTableData]);

  // 根据选中的列表变化动态改变全选状态
  useEffect(() => {
    if (category === 1) {
      const projectLen = checkedProjectList.length;

      if (projectLen === 0) {
        setCheckAllisIndeterminate(false);
        setCheckAllisChecked(false);
      } else if (projectLen < allProjectList.length) {
        setCheckAllisChecked(false);
        setCheckAllisIndeterminate(true);
      } else if (projectLen === allProjectList.length) {
        setCheckAllisChecked(true);
        setCheckAllisIndeterminate(false);
      }
    } else {
      const len = checkedNewList?.reduce((pre, val) => {
        return pre + val?.checkedList?.length;
      }, 0);

      if (len === 0) {
        setCheckAllisIndeterminate(false);
        setCheckAllisChecked(false);
      } else if (len < allNum) {
        setCheckAllisChecked(false);
        setCheckAllisIndeterminate(true);
      } else if (len === allNum) {
        setCheckAllisChecked(true);
        setCheckAllisIndeterminate(false);
      }
    }
  }, [JSON.stringify(checkedNewList), JSON.stringify(checkedProjectList)]);

  const { data: tableData, run, loading } = useRequest(
    () => getProjectsInfo({ userId, category }),
    {
      ready: !!userId,
      onSuccess: () => {
        getEngineerData?.(tableData);
        setHandleTableData(
          tableData?.map((item: any) => {
            const projects = JSON.parse(JSON.stringify(item.projects))?.map((ite: any) => {
              return { ...ite, isChecked: false };
            });
            return (item = { ...item, isChecked: false, isFold: false, projects });
          }) ?? [],
        );
        setCheckedNewList(
          tableData.map((item: any) => {
            return {
              isChecked: false,
              checkedList: [],
              indeterminate: false,
            };
          }),
        );
        setAllNum(
          tableData.reduce((pre: any, val: any) => {
            return pre + val.projects.length;
          }, 0),
        );
      },
    },
  );

  useEffect(() => {
    if (isFresh) {
      run();
      setEngineerIds?.([]);
      setCheckedProjectList([]);
      setIsFresh?.(false);
    }
  }, [isFresh]);

  // 当工程组复选框改变时
  const checkBigboxChange = (i: number, checked: boolean) => {
    const cloneCheckedList = JSON.parse(JSON.stringify(checkedNewList));
    cloneCheckedList[i].isChecked = checked;
    cloneCheckedList[i].checkedList = checked ? allOptions[i] : [];
    cloneCheckedList[i].indeterminate = false;

    setCheckedNewList(cloneCheckedList);
  };

  // 当项目复选框点击时
  const onCheckedChange = (i: number, id: string, checked: boolean) => {
    const cloneCheckedList = JSON.parse(JSON.stringify(checkedNewList));
    const list = [...cloneCheckedList[i].checkedList];
    const allList = allOptions[i];
    if (checked) {
      list.push(id);
      if (list.length === allList.length) {
        cloneCheckedList[i].isChecked = true;
      }
    } else {
      const index = list.findIndex((e) => e === id);
      index >= 0 && list.splice(index, 1);
      if (list.length === 0) {
        cloneCheckedList[i].isChecked = false;
      }
    }
    if (list.length > 0 && list.length < allList.length) {
      cloneCheckedList[i].indeterminate = true;
    } else {
      cloneCheckedList[i].indeterminate = false;
    }

    cloneCheckedList[i].checkedList = list;
    setCheckedNewList(cloneCheckedList);
  };

  // 获取选中的id
  const getCurrentCheckedIds = () => {
    return checkedNewList?.reduce((pre: any, val: any) => {
      return [...pre, ...val?.checkedList];
    }, []);
  };

  // 根据状态修改全选状态
  useEffect(() => {
    const flag = category === 1;

    if (emitAll.state === 1) {
      flag
        ? setCheckedProjectList([])
        : setCheckedNewList(
            tableData?.map((item: any) => {
              return {
                isChecked: false,
                checkedList: [],
                indeterminate: false,
              };
            }),
          );
    } else if (emitAll.state === 2) {
      flag
        ? setCheckedProjectList(allProjectList)
        : setCheckedNewList(
            allOptions.map((item) => {
              return {
                isChecked: true,
                checkedList: item,
                indeterminate: false,
              };
            }),
          );
    }
  }, [JSON.stringify(emitAll)]);

  useEffect(() => {
    getProjectIds?.(getCurrentCheckedIds());
  }, [JSON.stringify(checkedNewList)]);

  useEffect(() => {
    setEngineerIds?.(checkedProjectList);
  }, [JSON.stringify(checkedProjectList)]);

  //列表字段
  const listColumns = fieldFlag
    ? [
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
            return sources?.map((item: any) => {
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
              ?.filter((item: any) => item.text)
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
      ]
    : [
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

  const projectNameClickEvent = (projectId: string) => {
    getClickProjectId?.(projectId);
  };

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
  }, [JSON.stringify(tableData)]);

  // 当项目工程点击时
  const checkProjectChange = (i: number, checked: boolean) => {
    const cloneCheckedList = [...checkedProjectList];

    if (checked) {
      cloneCheckedList.push(allProjectList?.[i]);
    } else {
      const index = cloneCheckedList.findIndex((item) => item === allProjectList?.[i]);
      cloneCheckedList.splice(index, 1);
    }
    setCheckedProjectList(cloneCheckedList);
  };

  const foldChangeEvent = (item: any) => {
    const copyData = JSON.parse(JSON.stringify(handleTableData));

    const index = copyData.findIndex((ite: any) => ite.id === item.id);

    copyData[index].isFold = !copyData[index].isFold;
    setHandleTableData(copyData);
  };

  const projectTable = handleTableData?.map((item: any, bigIndex: number) => {
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
            {checkboxSet ? (
              <Checkbox
                onChange={(e) => checkBigboxChange(bigIndex, e.target.checked)}
                style={{ marginRight: '7px' }}
                indeterminate={checkedNewList[bigIndex]?.indeterminate}
                checked={!!checkedNewList[bigIndex]?.isChecked}
              />
            ) : (
              <Checkbox
                onChange={(e) => checkProjectChange(bigIndex, e.target.checked)}
                style={{ marginRight: '7px' }}
                checked={checkedProjectList.includes(item.id)}
              />
            )}
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
            <Checkbox.Group value={checkedNewList?.[bigIndex]?.checkedList ?? []}>
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
                    {(item.projects ?? []).map((pro: any, smallIndex: number) => {
                      return (
                        <div key={`${pro.id}Td`} className={styles.engineerTableTr}>
                          <div
                            className={`${styles.engineerTableTd} ${styles.engineerTableThCheckbox}`}
                            style={{ width: '38px', left: `${left}px` }}
                          >
                            {checkboxSet && (
                              <Checkbox
                                style={{ marginLeft: '4px' }}
                                checked={checkedNewList[bigIndex]?.checkedList?.includes(pro.id)}
                                value={pro.id}
                                onChange={(e) =>
                                  onCheckedChange(bigIndex, pro.id, e.target.checked)
                                }
                              />
                            )}
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
    <div className={styles.engineerTable} ref={tableRef}>
      <div className={styles.engineerTableContent}>
        {/* <ScrollView
          ref={scrollbar}
          onUpdate={scrollEvent}
          renderThumbHorizontal={scrollBarRenderView}
          renderThumbVertical={scrollBarRenderView}
        > */}
        <Spin spinning={loading}>
          {handleTableData?.length > 0 ? (
            projectTable
          ) : handleTableData?.length === 0 && doneFlag ? (
            <div style={{ margin: '100px', color: '#8C8C8C' }}>
              <EmptyTip className="pt20" description="您已经交接完毕了~" imgSrc="finish" />
            </div>
          ) : (
            <div style={{ margin: '100px', color: '#8C8C8C' }}>
              <EmptyTip className="pt20" description="暂无交接的内容" />
            </div>
          )}
        </Spin>
        {/* </ScrollView> */}
      </div>
    </div>
  );
};
export default EngineerTableList;
