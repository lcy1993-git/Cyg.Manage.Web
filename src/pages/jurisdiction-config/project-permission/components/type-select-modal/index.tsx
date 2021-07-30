import { useControllableValue, useRequest } from 'ahooks';
import { Col, Form, message, Modal, Row, TreeSelect } from 'antd';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
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
  addForm?: any;
}

enum categoryEnum {
  '公司' = 1,
  '部组',
  '公司用户',
}

const PermissionTypeModal: React.FC<TypeModalParams> = (props) => {
  const { changeTableEvent, hasAddData, editData, addForm } = props;

  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [categorySelected, setCategorySelected] = useState<string>();
  const [projectTypes, setProjectTypes] = useState<number[] | undefined>([]);
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

  const { data: proTypeData = [] } = useGetSelectData({
    url: '/ProjectAuthorityGroup/GetProjectTypes',
  });

  //处理不同对象的项目类型
  const groupTypeData = proTypeData?.filter((item: any) => item.value != 32);
  const userTypeData = proTypeData?.filter((item: any) => item.value != 32 && item.value != 16);

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
    addForm.validateFields().then((values: any) => {
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
        addForm.resetFields();
        return;
      }

      message.error('所选对象已经存在，不可重复添加');
    });
  };

  return (
    <>
      <Modal
        maskClosable={false}
        width="58%"
        title="添加-权限条目"
        visible={state as boolean}
        destroyOnClose
        okText="确定"
        centered
        cancelText="取消"
        bodyStyle={{ padding: 0 }}
        onCancel={() => {
          addForm.resetFields();
          setState(false);
        }}
        onOk={() => addProjectEntry()}
      >
        <CyTip>选择某对象，即包含了该对象以及该对象下属部组，公司用户的全部相关类型项目。</CyTip>
        <div style={{ padding: '20px' }}>
          <Form form={addForm}>
            <Row gutter={24}>
              <Col>
                <CyFormItem
                  label="请选择对象类型"
                  required
                  align="right"
                  labelWidth={111}
                  rules={[{ required: true, message: '对象类型不能为空' }]}
                  name="category"
                >
                  <EnumSelect
                    style={{ width: '350px' }}
                    enumList={categoryEnum}
                    onChange={(value: any) => {
                      addForm.resetFields([
                        'proType',
                        'groupType',
                        'userType',
                        'companyId',
                        'groupId',
                        'userId',
                      ]);
                      setCategorySelected(value);
                    }}
                    placeholder="请选择对象类型"
                  />
                </CyFormItem>
              </Col>
              <Col span={12}>
                {categorySelected === '1' ? (
                  <CyFormItem
                    label="请选择对象"
                    required
                    align="right"
                    labelWidth={111}
                    name="companyId"
                    rules={[{ required: true, message: '对象不能为空' }]}
                  >
                    <UrlSelect
                      valuekey="value"
                      titlekey="text"
                      defaultData={company}
                      value={selectedCompany}
                      onChange={(value: any, label: any) => {
                        setSelectedCompany(value);
                        setObjectName(label?.label);
                      }}
                      placeholder="请选择公司"
                      style={{ width: '350px' }}
                    />
                  </CyFormItem>
                ) : categorySelected === '2' ? (
                  <CyFormItem
                    label="请选择对象"
                    required
                    align="right"
                    labelWidth={111}
                    name="groupId"
                    rules={[{ required: true, message: '对象不能为空' }]}
                  >
                    <TreeSelect
                      style={{ width: '350px' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={handleGroupData}
                      placeholder="请选择部组"
                      treeDefaultExpandAll
                      value={selectedGroup}
                      onChange={(value: any, label: any) => {
                        setSelectedGroup(value);
                        setObjectName(label);
                      }}
                    />
                  </CyFormItem>
                ) : categorySelected === '3' ? (
                  <CyFormItem
                    label="请选择对象"
                    required
                    align="right"
                    labelWidth={111}
                    name="userId"
                    rules={[{ required: true, message: '对象不能为空' }]}
                  >
                    <UrlSelect
                      showSearch
                      value={selectedUser}
                      defaultData={userData}
                      titlekey="label"
                      valuekey="value"
                      style={{ width: '350px' }}
                      onChange={(value: any, label: any) => {
                        setSelectedUser(value);
                        setObjectName(label?.label);
                      }}
                      placeholder="请选择公司用户"
                    />
                  </CyFormItem>
                ) : (
                  <CyFormItem
                    required
                    label="请选择对象"
                    align="right"
                    labelWidth={111}
                    rules={[{ required: true, message: '对象不能为空' }]}
                    name="unselected"
                  >
                    <UrlSelect style={{ width: '350px' }} placeholder="请先选择对象类型" />
                  </CyFormItem>
                )}
              </Col>
            </Row>

            {categorySelected === '1' ? (
              <CyFormItem
                label="请选择项目类型"
                required
                align="right"
                labelWidth={111}
                rules={[{ required: true, message: '项目类型不能为空' }]}
                name="proType"
              >
                <UrlSelect
                  style={{ width: '100%' }}
                  mode="multiple"
                  valuekey="value"
                  titlekey="label"
                  value={projectTypes}
                  defaultData={proTypeData}
                  placeholder="请选择项目类型"
                  onChange={(value) => setProjectTypes(value as number[])}
                />
              </CyFormItem>
            ) : categorySelected === '2' ? (
              <CyFormItem
                label="请选择项目类型"
                required
                align="right"
                labelWidth={111}
                rules={[{ required: true, message: '项目类型不能为空' }]}
                name="groupType"
              >
                <UrlSelect
                  style={{ width: '100%' }}
                  mode="multiple"
                  valuekey="value"
                  titlekey="label"
                  value={projectTypes}
                  defaultData={groupTypeData}
                  placeholder="请选择项目类型"
                  onChange={(value) => setProjectTypes(value as number[])}
                />
              </CyFormItem>
            ) : categorySelected === '3' ? (
              <CyFormItem
                label="请选择项目类型"
                required
                align="right"
                labelWidth={111}
                rules={[{ required: true, message: '项目类型不能为空' }]}
                name="userType"
              >
                <UrlSelect
                  style={{ width: '100%' }}
                  mode="multiple"
                  valuekey="value"
                  titlekey="label"
                  value={projectTypes}
                  defaultData={userTypeData}
                  placeholder="请选择项目类型"
                  onChange={(value) => setProjectTypes(value as number[])}
                />
              </CyFormItem>
            ) : (
              <CyFormItem
                required
                label="请选择项目类型"
                align="right"
                labelWidth={111}
                rules={[{ required: true, message: '项目类型不能为空' }]}
                name="unselected"
              >
                <UrlSelect style={{ width: '100%' }} placeholder="请先选择对象类型" />
              </CyFormItem>
            )}
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default PermissionTypeModal;
