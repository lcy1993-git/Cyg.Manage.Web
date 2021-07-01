import React, { useMemo } from 'react';
import { Input, InputNumber, TreeSelect } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import rules from '../rule';
import { CompanyGroupTreeData } from '@/services/operation-config/company-group';
import styles from './index.less';
import UrlSelect from '@/components/url-select';

interface CompanyUserFormProps {
  treeData: CompanyGroupTreeData[];
}

const BatchAddCompanyUser: React.FC<CompanyUserFormProps> = (props) => {
  const { treeData = [] } = props;

  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      value: data.id,
      children: data.children.map(mapTreeData),
    };
  };

  const handleData = useMemo(() => {
    return treeData?.map(mapTreeData);
  }, [JSON.stringify(treeData)]);
  return (
    <>
      <CyFormItem
        className={styles.qtyNumber}
        label="生成数量"
        name="qty"
        rules={[
          {
            required: true,
            message: '生成数量不能为0',
          },
          () => ({
            validator(_, value) {
              if (value <= 50 && value >= 1) {
                return Promise.resolve();
              }
              return Promise.reject('请填写1~50以内的整数');
            },
          }),
          {
            pattern: /^[0-9]\d*$/,
            message: '请输入正整数',
          },
        ]}
        initialValue={1}
        required
      >
        <InputNumber />
      </CyFormItem>

      <CyFormItem label="所属部组" name="groupIds">
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          multiple
          treeData={handleData}
          placeholder="请选择部组(非必选)"
          treeDefaultExpandAll
          allowClear
        />
      </CyFormItem>

      <CyFormItem label="密码" name="pwd" required rules={rules.pwd} hasFeedback>
        <Input type="password" placeholder="请输入密码" />
      </CyFormItem>

      <CyFormItem
        label="确认密码"
        name="confirmPwd"
        required
        hasFeedback
        dependencies={['pwd']}
        rules={[
          {
            required: true,
            message: '请确认密码',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('pwd') === value) {
                return Promise.resolve();
              }
              return Promise.reject('两次密码输入不一致，请确认');
            },
          }),
        ]}
      >
        <Input type="password" placeholder="请再次输入密码" />
      </CyFormItem>
      <CyFormItem label="授权端口" name="clientCategorys">
        <UrlSelect
          mode="multiple"
          requestSource="project"
          showSearch
          url="/CompanyUser/GetClientCategorys"
          titlekey="text"
          valuekey="value"
          placeholder="请选择授权端口"
        />
      </CyFormItem>
    </>
  );
};

export default BatchAddCompanyUser;
