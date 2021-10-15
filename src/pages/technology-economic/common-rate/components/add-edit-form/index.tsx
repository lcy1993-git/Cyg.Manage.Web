import React, {useState} from 'react';
import { Input, Col, Row, Select } from 'antd';
import UrlSelect from '@/components/url-select';
import FormSwitch from '@/components/form-switch';
import CyFormItem from '@/components/cy-form-item';
import DateFormItem from '@/components/date-from-item';
import { getEnums } from '../../../utils';
import {useMount} from "ahooks";
import { queryRateFilePager } from '@/services/technology-economic/common-rate';
getEnums('RateTableType');

interface Props{
  modalType :string
}
const DictionaryForm: React.FC<Props> = ({modalType}) => {
  const [list,setLsit ] = useState<{sourceFile:string}[]>([])
  useMount( async ()=>{
    const res = await queryRateFilePager({pageSize:1000,pageIndex:1})
    console.log(res)
    setLsit(res.items)
  })
  return (
    <>
      <Row>
        <Col span={11}>
          <CyFormItem label="名称" name="name" required rules={[{required:true,message:'名称为必填项'}]}>
            <Input placeholder="请输入名称" />
          </CyFormItem>
          <CyFormItem label="来源文件" name="sourceFile" required rules={[{required:true,message:'来源文件为必填项'}]}>
            <Input placeholder="请输入所属文件" />
          </CyFormItem>
          <CyFormItem label="发布机构" name="publishOrg">
            <Input />
          </CyFormItem>
        </Col>
        <Col span={2}></Col>
        <Col span={11}>
          <CyFormItem label="费率年度" name="year">
            <DateFormItem picker="year" />
          </CyFormItem>
          <CyFormItem label="适用专业" name="majorType">
            <UrlSelect
              url="/CommonEnum/GetMajorTypeEnums"
              requestType="get"
              requestSource="tecEco"
            />
          </CyFormItem>
          <CyFormItem label="发布时间" name="publishDate">
            <DateFormItem />
          </CyFormItem>
        </Col>
      </Row>

      <CyFormItem label="备注" name="remark">
        <Input.TextArea rows={3} />
      </CyFormItem>
    </>
  );
};

export default DictionaryForm;
