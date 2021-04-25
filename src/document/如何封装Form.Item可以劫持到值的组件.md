## 如何封装ant design 的Form.Item可以获取到值的组件

### 1. 明白为什么antd的Form.Item可以获取到组件的值

```
antd 文档中说到

自定义或第三方的表单控件，也可以与 Form 组件一起使用。只要该组件遵循以下的约定：

提供受控属性 value 或其它与 valuePropName 的值同名的属性。

提供 onChange 事件或 trigger 的值同名的事件。


!!! 注意，只能劫持第一个组件的onChange事件
```

### 2. 开始封装类似组件

```
import { MinusOutlined, PlusOutlined} from "@ant-design/icons";
import { Input } from "antd";
import React, { memo, useState, useEffect } from "react";
import { add, isNumber, subtract } from "lodash"
import styles from "./index.less";

interface InputNumberProps {
    limit?: number
    onChange?: (inputValue: number) => void
    canInput?: boolean
    maxNumber?: number
    minNumber?: number
}

const InputNumber: React.FC<InputNumberProps> = (props) => {
    const { limit = 1, onChange, canInput = false, maxNumber, minNumber } = props;
    const [inputValue, setInputValue] = useState<number>(0);

    const inputEvent = (e: any) => {
        setInputValue(e.target.value);
    }
    // 增加事件
    const addEvent = () => {
        if (isNumber(maxNumber)) {
            if (add(inputValue, limit) <= maxNumber) {
                setInputValue(add(inputValue, limit))
            }
            return
        }
        setInputValue(add(inputValue, limit))
    }
    // 减少事件
    const cutEvent = () => {
        if (isNumber(minNumber)) {
            if (subtract(inputValue, limit) >= minNumber) {
                setInputValue(subtract(inputValue, limit))
            }
            return
        }
        setInputValue(subtract(inputValue, limit))
    }

    useEffect(() => {
        // 每一次值的变化，都通过onChange方法暴露出去
        onChange?.(inputValue)
    }, [inputValue])

    return (
        <div className={styles.inputNumber}>
            <div className={styles.inputContent}>
                <Input readOnly={!canInput} value={inputValue} onChange={inputEvent} />
            </div>
            <div className={styles.controlValueContent}>
                <div className={styles.cutButton} onClick={() => cutEvent()}>
                    <MinusOutlined />
                </div>
                <div className={styles.limitNumber}>
                    {limit}
                </div>
                <div className={styles.addButton} onClick={() => addEvent()}>
                    <PlusOutlined />
                </div>
            </div>

        </div>
    )
}

export default memo(InputNumber)

```

### 3. 如何使用

```
 

import CyFormItem from '@/components/cy-form-item';
import InputNumber from '@/components/input-number';
import { Button, Form } from 'antd';
import React from 'react';


const TestPage = () => {
  const [form] = Form.useForm();

  const test = () => {
    form.validateFields().then((value) => {
      console.log(value)  //打印可获取到 {number: 9}
    })
  }

  return (
    <div style={{width: "1200px", height: "960px"}}>
      <Form form={form}>
        <Form.Item label="测试组件" name="number" initialValue={5}>
          <InputNumber minNumber={0} />
        </Form.Item>
      </Form>
      <Button onClick={() => test()}>
        测试
      </Button>
    </div>
  );
};

export default TestPage;

```