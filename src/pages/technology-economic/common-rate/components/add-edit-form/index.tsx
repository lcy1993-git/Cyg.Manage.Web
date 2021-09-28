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
          <CyFormItem label="序号" name="number" required rules={[{required:true,message:'序号为必填项'}]}>
            <Input placeholder="请输入名称" />
          </CyFormItem>
          <CyFormItem label="所属文件" name="sourceFile" required rules={[{required:true,message:'所属文件为必填项'}]}>
            <Select>
              <Select.Option value={'20kV及以下配电网工程建设预算编制与计算规定'} key={1} disabled={list.find(item=>item.sourceFile === '20kV及以下配电网工程建设预算编制与计算规定' ) !== undefined}>20kV及以下配电网工程建设预算编制与计算规定</Select.Option>
              <Select.Option value={'电网拆除工程预算定额估价表'} key={2} disabled={list.find(item=>item.sourceFile === '电网拆除工程预算定额估价表' ) !== undefined}>电网拆除工程预算定额估价表</Select.Option>
            </Select>
            {/*<Input placeholder="请输入所属文件" />*/}
          </CyFormItem>
          <CyFormItem label="是否拆除" name="isDemolitionMajor" required rules={[{required:true,message:'是否拆除为必填项'}]}>
            <FormSwitch />
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
          {/* <CyFormItem label="费率类型" name="rateTableType" required>
            <UrlSelect
              defaultData={getEnums('RateTableType')}
            />
          </CyFormItem> */}
          <CyFormItem label="行业类别" name="industryType">
            <UrlSelect
              url="/CommonEnum/GetIndustryTypeEnums"
              requestType="get"
              requestSource="tecEco"
            />
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
      <CyFormItem label="状态" name="enabled" required rules={[{required:true,message:'状态为必填项'}]}>
        <FormSwitch disabled={modalType === 'edit'}/>
      </CyFormItem>
      <CyFormItem label="备注" name="remark">
        <Input.TextArea rows={3} />
      </CyFormItem>
    </>
  );
};

export default DictionaryForm;
