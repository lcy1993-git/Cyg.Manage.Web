import QuotaLibCommon from '../components/quota-lib-common';
import {Input} from 'antd';
import CyFormItem from '@/components/cy-form-item';
import { useState } from 'react'

const dictionaryForm = () => {
  return (
    <>
      <CyFormItem label="材料编号" name="name">
        <span>123</span>
      </CyFormItem>

      <CyFormItem label="材料名称" name="key" required>
        <Input placeholder="请输入名称" />
      </CyFormItem>

      <CyFormItem label="单位" name="value">
        <Input placeholder="请输入类型" />
      </CyFormItem>

      <CyFormItem label="单重" name="extensionColumn">
        <Input placeholder="请输入发行日期" />
      </CyFormItem>
    </>
  );
}

// 外部
const columns = [
  {
    dataIndex: 'id',
    index: 'id',
    title: '材料编号',
    width: 120,
  },
  {
    dataIndex: 'name',
    index: 'name',
    title: '材料名称',
    width: 360,
  },
  {
    dataIndex: 'categoryText',
    index: 'categoryText',
    title: '单位',
    width: 180,
  },
  {
    dataIndex: 'releaseDate',
    index: 'releaseDate',
    title: '单重',
    width: 80,
  }
];

const QuotaMechanics = () => {

  return (
    <>
      <QuotaLibCommon
        title="定额库材料项"
        columns={columns}
        url=""
        dictionaryForm={dictionaryForm}
        add={{
          title: "添加-定额库材料项",
          url: "",
          ok: ()=> console.log("add")
        }}
        edit={{
          title: "添加-定额库材料项",
          url: "",
          ok: ()=> console.log("edit")
        }}
        del={{ok:()=>console.log("del")}}
      />
    </>
  );
}

export default QuotaMechanics;