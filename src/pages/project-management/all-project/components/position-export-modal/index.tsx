import React from 'react';
import styles from './index.less';
import { Form, Checkbox, Row, Col, Button, message, Divider } from 'antd';
import { BlockOutlined, SnippetsOutlined } from '@ant-design/icons';
// import Item from '@/components/cy-form-item'
import Modal from 'antd/lib/modal/Modal';

const { Group } = Checkbox;
const { Item } = Form;

interface Props {

}

// 全选状态下的数据
const allLayersOptions = ["勘察图层", "方案图层", "设计图层", "拆除图层"];
const allTypeOptions = ["杆塔", "柱上变压器", "户表", "地物", "电缆井", "电气设备"];

const PositionExportModal: React.FC<Props> = ({
  // positionExportVisible,
  // setPositionExportVisible,

}) => {

  const [form] = Form.useForm();
  // 坐标图层全选按钮
  const handlerAllLayers = () => {
    const oldValues = form.getFieldValue('layers');
    form.setFieldsValue({ ...oldValues, layers: allLayersOptions })
  }
  // 坐标图层反选按钮
  const handlerReverseLayers = () => {
    const oldValues = form.getFieldValue('layers');
    form.setFieldsValue({ ...oldValues, layers: allLayersOptions.filter((item) => !oldValues.includes(item)) })
  }
  // 点位类型全选按钮
  const handlerAllType = () => {
    const oldValues = form.getFieldValue('positionType');
    form.setFieldsValue({ ...oldValues, positionType: allTypeOptions })
  }
  // 点位类型反选按钮
  const handlerReverseType = () => {
    const oldValues = form.getFieldValue('positionType');
    form.setFieldsValue({ ...oldValues, positionType: allTypeOptions.filter((item) => !oldValues.includes(item)) })
  }
  // 
  const onOK = async () => {
    form.validateFields().then(async (values) => {

      // await 
      // setPositionExportVisible(false)
      message.success('导出成功');
    })


  }

  return (
    <Modal className={styles.modalWrap}
      visible={true}
      title="导出选择"
      okText="导出"
      cancelText="取消"
      onOk={onOK}
    // onCancel={() => setPositionExportVisible(false)}
    >
      <Form form={form}>
        <div className={styles.layers}>
          <pre className={styles.title}>
            坐标图层:
          </pre>
          <Item
            name="layers"
          // label="坐标图层"
          >
            <Group style={{ width: "100%", border: "1px solid #f0f0f0", padding: 10, paddingBottom: 30, background: "#fff", borderRadius: 4 }}>
              <div className={styles.buttonArea}>
                <Button type="primary" onClick={handlerAllLayers}>全选</Button>
                &nbsp;&nbsp;
                <Button onClick={handlerReverseLayers}>反选</Button>
              </div>
              <Row className={styles.row}>
                <Col span={12}>
                  <Checkbox value="勘察图层">勘察图层</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="方案图层">方案图层</Checkbox>
                </Col>
              </Row>
              <Row className={styles.row}>
                <Col span={12}>
                  <Checkbox value="设计图层">设计图层</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="拆除图层">拆除图层</Checkbox>
                </Col>
              </Row>
              <Row className={styles.row}>
                <Col span={12}></Col>
                <Col span={12}></Col>
              </Row>
            </Group>
          </Item>
        </div>
        {/* <Divider style={{marginBottom: 4}}></Divider> */}
        <div className={styles.layers}>
          <pre className={styles.title}>
            点位类型:
          </pre>
          <Item
            name="positionType"
          // label="点位类型"
          >
            <Group
              style={{ width: "100%", border: "1px solid #f0f0f0", padding: 10, paddingBottom: 20, background: "#fff", borderRadius: 4 }}
            >
              <div className={styles.buttonArea}>
                <Button type="primary" onClick={handlerAllType}>全选</Button>
                &nbsp;&nbsp;
                <Button onClick={handlerReverseType}>反选</Button>
              </div>

              <Row className={styles.row}>
                <Col span={12}>
                  <Checkbox value="杆塔">杆塔</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="柱上变压器">柱上变压器</Checkbox>
                </Col>
              </Row>
              <Row className={styles.row}>
                <Col span={12}>
                  <Checkbox value="户表">户表</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="地物">地物</Checkbox>
                </Col>
              </Row>
              <Row className={styles.row}>
                <Col span={12}>
                  <Checkbox value="电缆井">电缆井</Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value="电气设备">电气设备</Checkbox>
                </Col>
              </Row>
            </Group>
          </Item>
        </div>
      </Form>

    </Modal>
  );
}

export default PositionExportModal;