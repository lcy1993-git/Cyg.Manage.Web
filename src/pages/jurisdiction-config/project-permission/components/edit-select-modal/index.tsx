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
  finishEvent?: Dispatch<SetStateAction<any[]>>;
  setEmpty?: Dispatch<SetStateAction<any[]>>;
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

const EditSelectModal: React.FC<TypeModalParams> = (props) => {
  const { changeTableEvent, hasAddData, editData, editForm, finishEvent, setEmpty } = props;

  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [categorySelected, setCategorySelected] = useState<string>();
  const [projectTypes, setProjectTypes] = useState<number[]>(editData?.projectTypes ?? []);
  const [company, setCompany] = useState<any>();
  const [selectedCompany, setSelectedCompany] = useState<any>();
  const [selectedUser, setSelectedUser] = useState<any>();
  const [selectedGroup, setSelectedGroup] = useState<any>();
  const [objectName, setObjectName] = useState<string>(editData?.objectName ?? '');

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

  console.log(editData, '当前编辑');
  const editProjectEntry = () => {
    const copyHasAddData = [...hasAddData];
    const editIndex = copyHasAddData.findIndex((item: any) => item.objectId === editData?.objectId);

    const currentItem = {
      category: categorySelected,
      objectId:
        categorySelected === '1'
          ? selectedCompany ?? editData?.objectId
          : categorySelected === '2'
          ? selectedGroup ?? editData?.objectId
          : selectedUser ?? editData?.objectId,
      projectTypes: projectTypes ?? editData?.projectTypes,
      objectName: objectName ?? editData?.objectName,
    };

    console.log(currentItem, '修改数据');

    if (
      copyHasAddData.findIndex((item: any) => item.objectId === currentItem?.objectId) === -1 ||
      currentItem.objectId === editData?.objectId
    ) {
      copyHasAddData.splice(editIndex, 1, currentItem);
      changeTableEvent?.(copyHasAddData);
      finishEvent?.([]);
      setEmpty?.([]);
      message.success('修改成功');
      setState(false);
      return;
    }

    message.error('所选对象已经存在，不可重复添加');
  };

  useEffect(() => {
    setCategorySelected(String(editData?.category));
  }, [editData]);

  console.log(projectTypes, '项目类型');

  return (
    <>
      <Modal
        maskClosable={false}
        width="58%"
        title="编辑-项目权限组"
        visible={state as boolean}
        destroyOnClose
        okText="确定"
        centered
        cancelText="取消"
        bodyStyle={{ padding: 0 }}
        onCancel={() => setState(false)}
        onOk={() => editProjectEntry()}
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
                  name="category"
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
                        console.log(label);
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
                  <UrlSelect style={{ width: '350px' }} placeholder="请先选择对象类型" />
                )}
              </Col>
            </Row>
            <CyFormItem
              label="请选择项目类型"
              required
              align="right"
              labelWidth={111}
              name="projectTypes"
            >
              <UrlSelect
                style={{ width: '100%' }}
                mode="multiple"
                valuekey="value"
                titlekey="text"
                url="/ProjectAuthorityGroup/GetProjectTypes"
                placeholder="请选择项目类型"
                value={projectTypes}
                onChange={(value) => setProjectTypes(value as number[])}
              />
            </CyFormItem>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default EditSelectModal;
