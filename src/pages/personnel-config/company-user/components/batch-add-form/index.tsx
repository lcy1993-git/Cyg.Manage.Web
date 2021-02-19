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
        rules={rules.qtyNumber}
        required
      >
        <InputNumber min={1} max={99} defaultValue={0} />
        <div className={styles.remainQty}>用户库存:</div>
      </CyFormItem>

      <CyFormItem label="所属部组" name="groupIds">
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={handleData}
          placeholder="请选择部组(非必选)"
          treeDefaultExpandAll
          allowClear
        />
      </CyFormItem>

      <CyFormItem label="密码" name="pwd" required rules={rules.pwd}>
        <Input type="password" placeholder="请输入密码" />
      </CyFormItem>

      <CyFormItem label="确认密码" name="confirmPwd" required rules={rules.confirmPwd}>
        <Input type="password" placeholder="请再次输入密码" />
      </CyFormItem>
      <CyFormItem label="授权端口" name="clientCategorys">
        <UrlSelect
          mode="multiple"
          showSearch
          url="/CompanyUser/GetClientCategorys"
          titleKey="text"
          valueKey="value"
          placeholder="请选择授权端口"
        />
      </CyFormItem>
    </>
  );
};

export default BatchAddCompanyUser;
