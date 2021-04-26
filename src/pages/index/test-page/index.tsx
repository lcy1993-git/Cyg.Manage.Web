import CyFormItem from '@/components/cy-form-item';
import ClickInputNumber from '@/components/clickInput-number';
import { Button, Form } from 'antd';
import React, { useRef } from 'react';
import OverFlowHiddenComponent from '@/components/over-flow-hidden-component';
import AreaSelect from '@/components/area-select';

const TestPage = () => {
  const [form] = Form.useForm();

  const test = () => {
    form.validateFields().then((value) => {
      console.log(value);
    });
  };

  const selectRef = useRef(null)

  const test2 = () => {
    if(selectRef && selectRef.current) {
        selectRef.current.reset();
    }
  }

  return (
    <div style={{ width: '1200px', height: '960px' }}>
      {/* <Form form={form}>
        <CyFormItem name="number" initialValue={5}>
          <ClickInputNumber minNumber={0} />
        </CyFormItem>
      </Form>
      <Button onClick={() => test()}>测试</Button> */}
      {/* <OverFlowHiddenComponent childrenList={[
        {width: 300, element: () => <div>1</div>},
        {width: 100, element: () => <div>2</div>},
        {width: 200, element: () => <div>3</div>}
      ]}>
        <div>1</div>
      </OverFlowHiddenComponent> */}
      <Button onClick={test2}>测试</Button>
      <AreaSelect  ref={selectRef} />
    </div>
  );
};

export default TestPage;
