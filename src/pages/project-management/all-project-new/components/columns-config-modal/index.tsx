import { saveColumnsConfig } from '@/services/project-management/all-project';
import { CheckSquareOutlined } from '@ant-design/icons';
import { useControllableValue } from 'ahooks';
import { Button } from 'antd';
import { Checkbox, Modal } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';
import styles from './index.less';

interface ColumnsConfigProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  finishEvent?: (checkedValue: any) => void;
  hasCheckColumns: string[];
}

const ColumnsConfigModal: React.FC<ColumnsConfigProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });

  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  const { finishEvent, hasCheckColumns = [] } = props;

  const defaultColumns = [
    {
      title: '项目名称(必选)',
      dataIndex: 'name',
      must: true,
    },
    {
      title: '项目分类',
      dataIndex: 'categoryText',
    },
    {
      title: '项目类型',
      dataIndex: 'pTypeText',
    },
    {
      title: '电压等级',
      dataIndex: 'kvLevelText',
    },
    {
      title: '项目性质',
      dataIndex: 'natureTexts',
    },
    {
      title: '专业类别',
      dataIndex: 'majorCategoryText',
    },
    {
      title: '建设建造目的',
      dataIndex: 'reformAimText',
    },
    {
      title: '所属市公司',
      dataIndex: 'cityCompany',
    },
    {
      title: '所属县公司',
      dataIndex: 'countyCompany',
    },
    {
      title: '建设类型',
      dataIndex: 'constructTypeText',
    },
    {
      title: '项目类别',
      dataIndex: 'pCategoryText',
    },
    {
      title: '项目阶段',
      dataIndex: 'stageText',
    },
    {
      title: '项目属性',
      dataIndex: 'pAttributeText',
    },
    {
      title: '交底范围',
      dataIndex: 'disclosureRange',
    },
    {
      title: '桩位范围',
      dataIndex: 'pileRange',
    },
    {
      title: '现场数据来源',
      dataIndex: 'dataSourceType',
    },
    {
      title: '导出坐标权限',
      dataIndex: 'exportCoordinate',
    },
    {
      title: '勘察人',
      dataIndex: 'surveyUser',
    },
    {
      title: '设计人',
      dataIndex: 'designUser',
    },
    {
      title: '项目批次',
      dataIndex: 'batchText',
    },
    {
      title: '项目来源(必选)',
      dataIndex: 'sources',
      must: true,
    },
    {
      title: '项目身份(必选)',
      dataIndex: 'identitys',
      must: true,
    },
    {
      title: '项目状态(必选)',
      dataIndex: 'status',
      must: true,
    },
  ];

  const checkboxElement = defaultColumns.map((item) => {
    return (
      <div className={styles.checkboxItemContent} key={item.dataIndex}>
        {item.must && (
          <span className={styles.mustCheckItem}>
            <span className={styles.mustCheckItemIcon}>
              <CheckSquareOutlined />
            </span>
            {item.title}
          </span>
        )}
        {!item.must && <Checkbox value={item.dataIndex}>{item.title}</Checkbox>}
      </div>
    );
  });

  const afterHandleColumns = useMemo(() => {
    return defaultColumns.filter((item) => !item.must).map((item) => item.dataIndex);
  }, [JSON.stringify(defaultColumns)]);

  const checkboxCheckEvent = (list: any) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < afterHandleColumns.length);
    setCheckAll(list.length === afterHandleColumns.length);
  };

  const allCheckEvent = (e: any) => {
    setCheckedList(e.target.checked ? afterHandleColumns : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  useEffect(() => {
    if (hasCheckColumns && hasCheckColumns.length > 0) {
      setCheckedList(hasCheckColumns);
      setIndeterminate(true);
      if (hasCheckColumns.length === afterHandleColumns.length) {
        setCheckAll(true);
      }
    }
  }, [JSON.stringify(hasCheckColumns)]);

  const sureConfigEvent = async () => {
    setRequestLoading(true);
    try {
      await saveColumnsConfig(JSON.stringify(checkedList));
      finishEvent?.(checkedList);
      setState(false);
    } catch (msg) {
      console.error(msg);
    } finally {
      setRequestLoading(false);
    }
  };

  const defaultConfig = [
    'categoryText',
    'kvLevelText',
    'natureTexts',
    'majorCategoryText',
    'constructTypeText',
    'stageText',
    'exportCoordinate',
    'surveyUser',
    'designUser',
    'identitys',
  ];

  const revertConfig = () => {
    setCheckedList(defaultConfig)
  }

  return (
    <Modal
      maskClosable={false}
      centered
      visible={state}
      width={820}
      onCancel={() => setState(false)}
      footer={[
        <Button key="revert" onClick={() => revertConfig()}>
          恢复默认
        </Button>,
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={requestLoading}
          onClick={() => sureConfigEvent()}
        >
          保存
        </Button>,
      ]}
      title="自定义表头"
      destroyOnClose
    >
      <div className={styles.configContent}>
        <div className={styles.allCheckContent}>
          <Checkbox indeterminate={indeterminate} onChange={allCheckEvent} checked={checkAll}>
            全选
          </Checkbox>
        </div>
        <Checkbox.Group style={{ width: '100%' }} value={checkedList} onChange={checkboxCheckEvent}>
          <div className={styles.allCheckboxContent}>{checkboxElement}</div>
        </Checkbox.Group>
      </div>
    </Modal>
  );
};

export default ColumnsConfigModal;
