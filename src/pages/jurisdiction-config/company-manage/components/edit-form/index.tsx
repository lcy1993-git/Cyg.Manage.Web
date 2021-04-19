import React from 'react';
import { Input, InputNumber, Form } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import styles from './index.less';
import rules from '../../rule';
// import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

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
      >
        <div className={styles.totalNumber}>总量（{accreditNumber[1]?.value.totalQty}）</div>
        <div className={styles.canUseNumber}>可用（{accreditNumber[1]?.value.availableQty}）</div>
        <div className={styles.addOrMinus}>可用增加</div>
        <Form.Item
          name="prospect"
          initialValue={0}
          rules={[
            () => ({
              validator(_, value) {
                if (value + accreditNumber[1]?.value.availableQty >= 0) {
                  return Promise.resolve();
                }
                return Promise.reject('减少数不能低于剩余可用数量');
              },
            }),
            () => ({
              validator(_, value) {
                if (value + accreditNumber[1]?.value.totalQty <= 50) {
                  return Promise.resolve();
                }
                return Promise.reject('增加后总量不能超过50');
              },
            }),
          ]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="增减可用数量" />
        </Form.Item>
      </CyFormItem>

      <CyFormItem
        className={styles.statistic}
        labelWidth={100}
        align="right"
        label="设计端"
        required
      >
        <div className={styles.totalNumber}>总量（{accreditNumber[2]?.value.totalQty}）</div>
        <div className={styles.canUseNumber}>可用（{accreditNumber[2]?.value.availableQty}）</div>
        <div className={styles.addOrMinus}>可用增加</div>
        <Form.Item
          name="design"
          initialValue={0}
          rules={[
            () => ({
              validator(_, value) {
                if (value + accreditNumber[2]?.value.availableQty >= 0) {
                  return Promise.resolve();
                }
                return Promise.reject('减少数不能低于剩余可用数量');
              },
            }),
            () => ({
              validator(_, value) {
                if (value + accreditNumber[2]?.value.totalQty <= 50) {
                  return Promise.resolve();
                }
                return Promise.reject('增加后总量不能超过50');
              },
            }),
          ]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="增减可用数量" />
        </Form.Item>
      </CyFormItem>

      <CyFormItem
        className={styles.statistic}
        labelWidth={100}
        align="right"
        label="技经端"
        required
      >
        <div className={styles.totalNumber}>总量（{accreditNumber[4]?.value.totalQty}）</div>
        <div className={styles.canUseNumber}>可用（{accreditNumber[4]?.value.availableQty}）</div>
        <div className={styles.addOrMinus}>可用增加</div>
        <Form.Item
          name="skillBy"
          initialValue={0}
          rules={[
            { pattern: /^(^-?\d+$)$/, message: '请输入正确的数量' },
            () => ({
              validator(_, value) {
                if (value + accreditNumber[4]?.value.availableQty >= 0) {
                  return Promise.resolve();
                }
                return Promise.reject('减少数不能低于剩余可用数量');
              },
            }),
            () => ({
              validator(_, value) {
                if (value + accreditNumber[4]?.value.totalQty <= 50) {
                  return Promise.resolve();
                }
                return Promise.reject('增加后总量不能超过50');
              },
            }),
          ]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="增减可用数量" />
        </Form.Item>
      </CyFormItem>

      <CyFormItem
        className={styles.statistic}
        labelWidth={100}
        align="right"
        label="评审端"
        required
      >
        <div className={styles.totalNumber}>总量（{accreditNumber[3]?.value.totalQty}）</div>
        <div className={styles.canUseNumber}>可用（{accreditNumber[3]?.value.availableQty}）</div>
        <div className={styles.addOrMinus}>可用增加</div>
        <Form.Item
          name="review"
          initialValue={0}
          rules={[
            () => ({
              validator(_, value) {
                if (value + accreditNumber[3]?.value.availableQty >= 0) {
                  return Promise.resolve();
                }
                return Promise.reject('减少数不能低于剩余可用数量');
              },
            }),
            () => ({
              validator(_, value) {
                if (value + accreditNumber[3]?.value.totalQty <= 50) {
                  return Promise.resolve();
                }
                return Promise.reject('增加后总量不能超过50');
              },
            }),
          ]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="增减可用数量" />
        </Form.Item>
      </CyFormItem>

      <CyFormItem
        className={styles.statistic}
        labelWidth={100}
        align="right"
        label="管理端"
        required
      >
        <div className={styles.totalNumber}>总量（{accreditNumber[0]?.value.totalQty}）</div>
        <div className={styles.canUseNumber}>可用（{accreditNumber[0]?.value.availableQty}）</div>
        <div className={styles.addOrMinus}>可用增加</div>
        <Form.Item
          name="manage"
          initialValue={0}
          rules={[
            () => ({
              validator(_, value) {
                if (value + accreditNumber[0]?.value.availableQty >= 0) {
                  return Promise.resolve();
                }
                return Promise.reject('减少数不能低于剩余可用数量');
              },
            }),
            () => ({
              validator(_, value) {
                if (value + accreditNumber[0]?.value.totalQty <= 50) {
                  return Promise.resolve();
                }
                return Promise.reject('增加后总量不能超过50');
              },
            }),
          ]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="增减可用数量" />
        </Form.Item>
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
      <CyFormItem labelWidth={100} align="right" label="备注" name="remark">
        <Input placeholder="请输入备注信息" />
      </CyFormItem>
    </>
  );
};

export default EditCompanyManageForm;
