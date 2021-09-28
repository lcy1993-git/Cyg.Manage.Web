/* eslint-disable no-else-return */
import React, { useState, useEffect, useMemo } from 'react';
import { handleJurisdictionData } from '@/utils/utils';
import TreeTable from '../tree-table';
import { Button, Checkbox } from 'antd';
import { flatten, toTreeData } from '@/utils/utils';

import styles from './index.less';
import CommonTitle from '../common-title';

interface FunctionItem {
  id: string;
  name: string;
  hasPermission: boolean;
}

interface TreeDataItem {
  id: string;
  name: string;
  hasPermission: boolean;
  functions: FunctionItem[];
  children: TreeDataItem[];
}

interface CheckboxTreeTableProps {
  treeData?: TreeDataItem[];
  onChange?: (checkedValue: string[]) => void;
}

const CheckboxTreeTable: React.FC<CheckboxTreeTableProps> = (props) => {
  const { treeData = [], onChange } = props;

  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);

  const [tableShowData, setTableShowData] = useState<TreeDataItem[]>([]);

  const columns = [
    {
      title: (text: any, record: any) => {
        return (
          <>
            <span style={{ paddingLeft: '19px' }}>
              <Checkbox
                checked={isAllChecked}
                onChange={isAllChecked ? allNoCheckEvent : allCheckEvent}
              >
                模块
              </Checkbox>
            </span>
          </>
        );
      },
      dataIndex: 'name',
      index: 'name',
      width: 360,
      render: (text: string, record: any) => {
        return (
          <>
            <span>
              <Checkbox
                checked={record.hasPermission}
                onChange={(e) => moduleCheckEvent(e.target.checked, record.id)}
              >
                {record.name}
              </Checkbox>
            </span>
          </>
        );
      },
    },
    {
      title: '功能',
      render: (text: string, record: any) => {
        const { functions } = record;
        const checkboxElement = functions.map((item: any) => {
          return (
            <div key={item.id}>
              <Checkbox
                checked={item.hasPermission}
                onChange={(e) => functionCheckEvent(e.target.checked, record.id, item.id)}
              >
                {item.name}
              </Checkbox>
            </div>
          );
        });

        return <div>{checkboxElement}</div>;
      },
    },
  ];

  /**
   *  左侧模块的check逻辑, check被选择了，那么他的上级所有的都需要被选中，他的下级和功能区都要被选中
   *  当他取消的时候，就自己取消，下级和功能区都要进行取消
   */
  const moduleCheckEvent = (checked: boolean, recordId: string) => {
    const copyData: TreeDataItem[] = JSON.parse(JSON.stringify(tableShowData));
    const flattenCopyData = flatten<TreeDataItem>(copyData);

    // 这个元素的所有父级都被勾选
    // 这个元素的所有相关子级也都被勾选
    const thisCheckedData = flattenCopyData.find((item) => item.id === recordId);
    const thisCheckedDataChildren = thisCheckedData?.children;
    const childrenData = flatten(thisCheckedDataChildren);

    if (checked) {
      const hasThisIdParentData: TreeDataItem[] = [];
      flattenCopyData.forEach((item) => {
        if (flatten(item.children).findIndex((item: any) => item.id === recordId) > -1) {
          hasThisIdParentData.push(item);
        }
      });

      const newData = flattenCopyData.map((item) => {
        if (hasThisIdParentData.findIndex((ite: any) => item.id === ite.id) > -1) {
          return {
            ...item,
            hasPermission: true,
          };
        }
        if (childrenData.findIndex((ite: any) => item.id === ite.id) > -1) {
          return {
            ...item,
            hasPermission: true,
            functions: item.functions.map((item) => ({ ...item, hasPermission: true })),
          };
        }
        if (item.id === recordId) {
          return {
            ...item,
            hasPermission: true,
            functions: item.functions.map((item) => ({ ...item, hasPermission: true })),
          };
        }
        return item;
      });

      setTableShowData(toTreeData(newData));
      getSelectIds(toTreeData(newData));
    } else {
      const newData = flattenCopyData.map((item) => {
        if (childrenData.findIndex((ite: any) => item.id === ite.id) > -1) {
          return {
            ...item,
            hasPermission: false,
            functions: item.functions.map((item) => ({ ...item, hasPermission: false })),
          };
        }
        if (item.id === recordId) {
          return {
            ...item,
            hasPermission: false,
            functions: item.functions.map((item) => ({ ...item, hasPermission: false })),
          };
        }
        return item;
      });

      setTableShowData(toTreeData(newData));
      getSelectIds(toTreeData(newData));
    }
  };

  /**
   *  右侧功能点击的时候，左侧的checkbox需要被勾选上
   *  右侧功能取消的时候，左侧的checkbox不需要动他
   */
  const functionCheckEvent = (checked: boolean, recordId: string, dataId: string) => {
    // 被勾选的时候，如果左侧模块没被勾选，那么左侧的模块以及他的父级都要被勾选, 但是父级的functions不用被勾选
    const copyData: TreeDataItem[] = JSON.parse(JSON.stringify(tableShowData));
    const flattenCopyData = flatten<TreeDataItem>(copyData);

    // 这个元素的所有父级都被勾选
    // 这个元素的所有相关子级也都被勾选
    const thisCheckedData = flattenCopyData.find((item) => item.id === recordId);
    if (checked) {
      // 如果父亲被勾选了，那么只管自己就好
      if (thisCheckedData?.hasPermission) {
        const newData = flattenCopyData.map((item) => {
          if (item.id === recordId) {
            return {
              ...item,
              functions: item.functions.map((ite) => {
                if (ite.id === dataId) {
                  return {
                    ...ite,
                    hasPermission: true,
                  };
                }
                return ite;
              }),
            };
          }
          return item;
        });
        setTableShowData(toTreeData(newData));
        getSelectIds(toTreeData(newData));
        return;
      } else {
        const hasThisIdParentData: TreeDataItem[] = [];
        flattenCopyData.forEach((item) => {
          if (flatten(item.children).findIndex((item: any) => item.id === recordId) > -1) {
            hasThisIdParentData.push(item);
          }
        });

        const newData = flattenCopyData.map((item) => {
          if (hasThisIdParentData.findIndex((ite: any) => item.id === ite.id) > -1) {
            return {
              ...item,
              hasPermission: true,
            };
          }
          if (item.id === recordId) {
            return {
              ...item,
              hasPermission: true,
              functions: item.functions.map((ite) => {
                if (ite.id === dataId) {
                  return { ...ite, hasPermission: true };
                }
                return { ...ite };
              }),
            };
          }
          return item;
        });

        setTableShowData(toTreeData(newData));
        getSelectIds(toTreeData(newData));
      }
    } else {
      const newData = flattenCopyData.map((item) => {
        if (item.id === recordId) {
          return {
            ...item,
            functions: item.functions.map((ite) => {
              if (ite.id === dataId) {
                return {
                  ...ite,
                  hasPermission: false,
                };
              }
              return ite;
            }),
          };
        }
        return item;
      });
      setTableShowData(toTreeData(newData));
      getSelectIds(toTreeData(newData));
    }
  };

  /**
   *  根据数据，获取被勾选的checkbox，返回出去
   *
   * */
  const getSelectIds = (data: TreeDataItem[]) => {
    const copyData = JSON.parse(JSON.stringify(data));
    const flattenCopyData = flatten<TreeDataItem>(copyData);

    // 左侧模块没被勾选。那么右侧一定不会有被勾选的。
    const checkedDataArray: string[] = [];
    flattenCopyData
      .filter((item) => item.hasPermission)
      .forEach((item) => {
        checkedDataArray.push(item.id);
        item.functions.forEach((ite) => {
          if (ite.hasPermission) {
            checkedDataArray.push(ite.id);
          }
        });
      });
    onChange?.(checkedDataArray);
  };

  useEffect(() => {
    if (treeData) {
      const afterHandleData = handleJurisdictionData(treeData);
      setTableShowData(afterHandleData);
      getSelectIds(afterHandleData);
    }
  }, [JSON.stringify(treeData)]);

  const mapDataAllFalse = (data: any) => {
    return {
      ...data,
      hasPermission: false,
      functions: data.functions.map((item: any) => ({ ...item, hasPermission: false })),
      children: data.children.map(mapDataAllFalse),
    };
  };

  const mapAllDataTrue = (data: any) => {
    return {
      ...data,
      hasPermission: true,
      functions: data.functions.map((item: any) => ({ ...item, hasPermission: true })),
      children: data.children.map(mapAllDataTrue),
    };
  };

  const allCheckEvent = () => {
    const copyData: TreeDataItem[] = JSON.parse(JSON.stringify(tableShowData));
    const newData = copyData.map(mapAllDataTrue);
    setTableShowData(newData);
    getSelectIds(newData);
    setIsAllChecked(true);
  };

  const allNoCheckEvent = () => {
    const copyData: TreeDataItem[] = JSON.parse(JSON.stringify(tableShowData));
    const newData = copyData.map(mapDataAllFalse);
    setTableShowData(newData);
    getSelectIds(newData);
    setIsAllChecked(false);
  };

  // const tableAllCheckedButton = () => {
  //   return (
  //     <div className={styles.buttonContent}>
  //       <div className={styles.moduleTitle}>
  //         <CommonTitle>分配功能模块</CommonTitle>
  //       </div>
  //       <div>
  //         <Button className="mr7" onClick={() => allCheckEvent()}>
  //           全选
  //         </Button>
  //         <Button onClick={() => allNoCheckEvent()}>全不选</Button>
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <div>
      <TreeTable
        tableTitle="分配功能模块"
        // leftButtonsSlot={tableAllCheckedButton}
        dataSource={tableShowData}
        columns={columns}
        needCheck={false}
      />
    </div>
  );
};

export default CheckboxTreeTable;
