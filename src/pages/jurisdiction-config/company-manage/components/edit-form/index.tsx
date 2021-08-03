import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import styles from './index.less';
import rules from '../../rule';
import AddMinusComponent from '../add-minus-component';
import FormSwitch from '@/components/form-switch';
import DatePickerForm from '@/components/date-from-item';

interface EditCompanyProps {
  accreditNumber: any[];
}

const EditCompanyManageForm: React.FC<EditCompanyProps> = (props) => {
  const { accreditNumber } = props;

  return (
    <>
      <CyFormItem
        labelWidth={100}
        align="right"
        label="公司名称"
        name="name"
        required
        rules={rules.name}
      >
        <Input placeholder="请输入公司名" />
      </CyFormItem>

      <CyFormItem
        className={styles.statistic}
        labelWidth={100}
        align="right"
        label="勘察端"
        required
        name="prospect"
        rules={[
          { pattern: /^-?[0-9]\d*$/, message: '请输入正确的数量' },
          () => ({
            validator(_, value) {
              if (Number(value) + accreditNumber[1]?.value.availableQty >= 0 || isNaN(value)) {
                return Promise.resolve();
              }

              return Promise.reject('减少数不能低于剩余可用数量');
            },
          }),
          () => ({
            validator(_, value) {
              if (Number(value) + accreditNumber[1]?.value.totalQty <= 50 || isNaN(value)) {
                return Promise.resolve();
              }
              return Promise.reject('增加后总量不能超过50');
            },
          }),
        ]}
      >
        <AddMinusComponent
          totalNum={accreditNumber[1]?.value.totalQty}
          availableNum={accreditNumber[1]?.value.availableQty}
          maxNumber={50 - accreditNumber[1]?.value.totalQty}
          minNumber={-accreditNumber[1]?.value.availableQty}
        />
      </CyFormItem>

      <CyFormItem
        className={styles.statistic}
        labelWidth={100}
        align="right"
        label="设计端"
        required
        // initialValue={0}
        name="design"
        rules={[
          { pattern: /^-?[0-9]\d*$/, message: '请输入正确的数量' },
          () => ({
            validator(_, value) {
              if (Number(value) + accreditNumber[2]?.value.availableQty >= 0 || isNaN(value)) {
                return Promise.resolve();
              }
              return Promise.reject('减少数不能低于剩余可用数量');
            },
          }),
          () => ({
            validator(_, value) {
              if (Number(value) + accreditNumber[2]?.value.totalQty <= 50 || isNaN(value)) {
                return Promise.resolve();
              }
              return Promise.reject('增加后总量不能超过50');
            },
          }),
        ]}
      >
        <AddMinusComponent
          totalNum={accreditNumber[2]?.value.totalQty}
          availableNum={accreditNumber[2]?.value.availableQty}
          maxNumber={50 - accreditNumber[2]?.value.totalQty}
          minNumber={-accreditNumber[2]?.value.availableQty}
        />
      </CyFormItem>

      <CyFormItem
        className={styles.statistic}
        labelWidth={100}
        align="right"
        label="技经端"
        required
        // initialValue={0}
        name="skillBy"
        rules={[
          { pattern: /^-?[0-9]\d*$/, message: '请输入正确的数量' },
          () => ({
            validator(_, value) {
              if (Number(value) + accreditNumber[4]?.value.availableQty >= 0 || isNaN(value)) {
                return Promise.resolve();
              }
              return Promise.reject('减少数不能低于剩余可用数量');
            },
          }),
          () => ({
            validator(_, value) {
              if (Number(value) + accreditNumber[4]?.value.totalQty <= 50 || isNaN(value)) {
                return Promise.resolve();
              }
              return Promise.reject('增加后总量不能超过50');
            },
          }),
        ]}
      >
        <AddMinusComponent
          totalNum={accreditNumber[4]?.value.totalQty}
          availableNum={accreditNumber[4]?.value.availableQty}
          maxNumber={50 - accreditNumber[4]?.value.totalQty}
          minNumber={-accreditNumber[4]?.value.availableQty}
        />
      </CyFormItem>

      <CyFormItem
        className={styles.statistic}
        labelWidth={100}
        align="right"
        label="评审端"
        required
        name="review"
        // initialValue={0}
        rules={[
          { pattern: /^-?[0-9]\d*$/, message: '请输入正确的数量' },
          () => ({
            validator(_, value) {
              if (Number(value) + accreditNumber[3]?.value.availableQty >= 0 || isNaN(value)) {
                return Promise.resolve();
              }
              return Promise.reject('减少数不能低于剩余可用数量');
            },
          }),
          () => ({
            validator(_, value) {
              if (Number(value) + accreditNumber[3]?.value.totalQty <= 50 || isNaN(value)) {
                return Promise.resolve();
              }
              return Promise.reject('增加后总量不能超过50');
            },
          }),
        ]}
      >
        <AddMinusComponent
          totalNum={accreditNumber[3]?.value.totalQty}
          availableNum={accreditNumber[3]?.value.availableQty}
          maxNumber={50 - accreditNumber[3]?.value.totalQty}
          minNumber={-accreditNumber[3]?.value.availableQty}
        />
      </CyFormItem>

      <CyFormItem
        className={styles.statistic}
        labelWidth={100}
        align="right"
        label="管理端"
        required
        name="manage"
        rules={[
          { pattern: /^-?[0-9]\d*$/, message: '请输入正确的数量' },
          () => ({
            validator(_, value) {
              if (Number(value) + accreditNumber[0]?.value.availableQty >= 0 || isNaN(value)) {
                return Promise.resolve();
              }
              return Promise.reject('减少数不能低于剩余可用数量');
            },
          }),
          () => ({
            validator(_, value) {
              if (Number(value) + accreditNumber[0]?.value.totalQty <= 50 || isNaN(value)) {
                return Promise.resolve();
              }
              return Promise.reject('增加后总量不能超过50');
            },
          }),
        ]}
      >
        <AddMinusComponent
          totalNum={accreditNumber[0]?.value.totalQty}
          availableNum={accreditNumber[0]?.value.availableQty}
          maxNumber={50 - accreditNumber[0]?.value.totalQty}
          minNumber={-accreditNumber[0]?.value.availableQty}
        />
      </CyFormItem>

      <CyFormItem
        labelWidth={100}
        align="right"
        label="详细地址"
        name="address"
        required
        rules={rules.address}
      >
        <Input placeholder="请输入地址" />
      </CyFormItem>
      
      <CyFormItem
        labelWidth={100}
        align="right"
        label="授权期限"
        name="date"
      >
        <DatePickerForm />
      </CyFormItem>

      <CyFormItem labelWidth={100} align="right" label="备注" name="remark">
        <Input placeholder="请输入备注信息" />
      </CyFormItem>
      {/* <CyFormItem label="状态" name="isEnabled" labelWidth={100} align="right">
        <FormSwitch />
      </CyFormItem> */}
    </>
  );
};

export default EditCompanyManageForm;
