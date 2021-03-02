import React, { useMemo } from 'react';
import { TreeSelect, Divider } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import EnumSelect from '@/components/enum-select';
import { Arrangement } from '@/services/project-management/all-project';
import { CompanyGroupTreeData } from '@/services/operation-config/company-group';
import { getUserTreeByGroup } from '@/services/personnel-config/company-user';
import { useRequest } from 'ahooks';
import Search from 'antd/lib/input/Search';

interface GetGroupUserProps {
  treeData?: CompanyGroupTreeData[];
}

interface ArrangeType {
  type: 'users' | 'entrust';
}

const ArrangeForm: React.FC<GetGroupUserProps> = (props) => {
  const { treeData = [] } = props;

  //   const { data, run: getUserData } = useRequest(getUserTreeByGroup, {
  //     manual: true,
  //   });

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

  console.log(handleData);

  const arrangementEvent = (value: any) => {};

  return (
    <>
      <CyFormItem label="安排方式" name="allotType" initialValue={'2'}>
        <EnumSelect enumList={Arrangement} onChange={(value) => arrangementEvent(value)} />
      </CyFormItem>

      <CyFormItem label="勘察" name="surveyUser" required>
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={handleData}
          placeholder="请选择"
          treeDefaultExpandAll
          allowClear
        />
      </CyFormItem>
      <CyFormItem label="设计" name="designUser" required>
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={handleData}
          placeholder="请选择"
          treeDefaultExpandAll
          allowClear
        />
      </CyFormItem>
      <Divider>设计校审</Divider>
      <CyFormItem label="校对" name="designAssessUser1">
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={handleData}
          placeholder="请选择"
          treeDefaultExpandAll
          allowClear
        />
      </CyFormItem>
      <CyFormItem label="校核" name="designAssessUser2">
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={handleData}
          placeholder="请选择"
          treeDefaultExpandAll
          allowClear
        />
      </CyFormItem>
      <CyFormItem label="审核" name="designAssessUser3">
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={handleData}
          placeholder="请选择"
          treeDefaultExpandAll
          allowClear
        />
      </CyFormItem>
      <CyFormItem label="审定" name="designAssessUser4" required>
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={handleData}
          placeholder="请选择"
          treeDefaultExpandAll
          allowClear
        />
      </CyFormItem>
      {/* <div className='flex'>
        <CyFormItem label="单位账户" name="unit">
          <Search placeholder="请输入单位" />
        </CyFormItem>
        <CyFormItem label="单位名称" name="unit">
          <Search placeholder="请输入单位" />
        </CyFormItem>
      </div> */}
    </>
  );
};

export default ArrangeForm;
