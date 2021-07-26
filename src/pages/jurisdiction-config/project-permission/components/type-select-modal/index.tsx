import { useControllableValue, useRequest } from 'ahooks';
import { Col, Form, message, Modal, Row, TreeSelect } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import CyTip from '@/components/cy-tip';
import EnumSelect from '@/components/enum-select';
import { getCompany } from '@/services/jurisdiction-config/company-manage';
import { useGetSelectData } from '@/utils/hooks';
import { getTreeSelectData } from '@/services/operation-config/company-group';
import { permissionItem } from '../category-table';

interface TypeModalParams {
  visible?: boolean;
  onChange?: Dispatch<SetStateAction<boolean>>;
  finishEvent?: () => void;
  // addItem?: Dispatch<SetStateAction<permissionItem[] | undefined>>;
  changeTableEvent: (value: permissionItem[]) => void;
  hasAddData: permissionItem[];
  editData?: permissionItem;
  editForm?: any;
}

enum categoryEnum {
  '公司' = 1,
  '部组',
  '公司用户',
}

const PermissionTypeModal: React.FC<TypeModalParams> = (props) => {
  const { changeTableEvent, hasAddData, editData, editForm } = props;

  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [categorySelected, setCategorySelected] = useState<string>();
  const [projectTypes, setProjectTypes] = useState<number[]>([]);
  const [company, setCompany] = useState<any>();
  const [selectedCompany, setSelectedCompany] = useState<any>();
  const [selectedUser, setSelectedUser] = useState<any>();
  const [selectedGroup, setSelectedGroup] = useState<any>();
  const [objectName, setObjectName] = useState<string>();

  const { data: companyData } = useRequest(() => getCompany(), {
    ready: categorySelected === '1',
    onSuccess: () => {
      const company = [];
      company.push(companyData);
      setCompany(company);
    },
  });

  //获取用户数据
  const { data: userData = [] } = useGetSelectData({
    url: '/CompanyUser/GetList?clientCategory=2',
  });

  //获取并处理部组数据
  const { data: groupData = [] } = useRequest(() => getTreeSelectData(), {
    ready: categorySelected === '2',
  });

  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      value: data.id,
      children: data.children?.map(mapTreeData),
    };
  };

  const handleGroupData = useMemo(() => {
    return groupData.map(mapTreeData);
  }, [JSON.stringify(groupData)]);

  const addProjectEntry = () => {
    const copyHasAddData = [...hasAddData];
    const addData = {
      category: categorySelected,
      objectId:
        categorySelected === '1'
          ? selectedCompany
          : categorySelected === '2'
          ? selectedGroup
          : selectedUser,
      projectTypes: projectTypes,
      objectName: objectName,
    };

    if (copyHasAddData.findIndex((item) => item.objectId === addData.objectId) === -1) {
      copyHasAddData.unshift(addData);
      changeTableEvent?.(copyHasAddData);
      message.success('添加成功');
      setState(false);
      return;
    }

    message.error('所选对象已经存在，不可重复添加');
  };

  return (
    <>
      <Modal
        maskClosable={false}
        width="58%"
        title="添加-项目权限组"
        visible={state as boolean}
        destroyOnClose
        okText="确定"
        centered
        cancelText="取消"
        bodyStyle={{ padding: 0 }}
        onCancel={() => setState(false)}
        onOk={() => addProjectEntry()}
      >
        <CyTip>选择某对象，即包含了该对象以及该对象下属部组，公司用户的全部相关类型项目。</CyTip>
        <div style={{ padding: '20px' }}>
          <Form form={editForm}>
            <Row gutter={24}>
              <Col>
                <CyFormItem
                  label="请选择对象类型"
                  required
                  align="right"
                  labelWidth={111}
                  rules={[{ required: true, message: '对象类型不能为空' }]}
                >
                  <EnumSelect
                    style={{ width: '350px' }}
                    enumList={categoryEnum}
                    onChange={(value: any) => {
                      setSelectedCompany(undefined);
                      setSelectedUser(undefined);
                      setSelectedGroup(undefined);
                      setCategorySelected(value);
                    }}
                    placeholder="请选择对象类型"
                  />
                </CyFormItem>
              </Col>
              <Col span={12}>
                <CyFormItem
                  label="请选择对象"
                  required
                  align="right"
                  labelWidth={111}
                  rules={[{ required: true, message: '对象不能为空' }]}
                >
                  {categorySelected === '1' ? (
                    <UrlSelect
                      valuekey="value"
                      titlekey="text"
                      labelInValue
                      defaultData={company}
                      value={selectedCompany?.value}
                      onChange={(value: any) => {
                        setSelectedCompany(value?.value);
                        setObjectName(value?.label);
                      }}
                      placeholder="请选择公司"
                      style={{ width: '350px' }}
                    />
                  ) : categorySelected === '2' ? (
                    <TreeSelect
                      style={{ width: '350px' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={handleGroupData}
                      placeholder="请选择部组"
                      treeDefaultExpandAll
                      labelInValue
                      onChange={(value: any) => {
                        setSelectedGroup(value?.value);
                        setObjectName(value?.label);
                      }}
                    />
                  ) : categorySelected === '3' ? (
                    <UrlSelect
                      showSearch
                      value={selectedUser?.value}
                      defaultData={userData}
                      titlekey="label"
                      valuekey="value"
                      labelInValue
                      style={{ width: '350px' }}
                      onChange={(value: any) => {
                        setSelectedUser(value?.value);
                        setObjectName(value?.label);
                      }}
                      placeholder="请选择公司用户"
                    />
                  ) : (
                    <UrlSelect style={{ width: '350px' }} placeholder="请先选择对象类型" />
                  )}
                </CyFormItem>
              </Col>
            </Row>
            <CyFormItem
              label="请选择项目类型"
              required
              align="right"
              labelWidth={111}
              rules={[{ required: true, message: '项目类型不能为空' }]}
            >
              <UrlSelect
                style={{ width: '100%' }}
                mode="multiple"
                valuekey="value"
                titlekey="text"
                url="/ProjectAuthorityGroup/GetProjectTypes"
                placeholder="请选择项目类型"
                onChange={(value) => setProjectTypes(value as number[])}
              />
            </CyFormItem>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default PermissionTypeModal;
