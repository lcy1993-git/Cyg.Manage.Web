import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { add, subtract, isNumber } from 'lodash';

interface AddMinusComponentProps {
  limit?: number;
  onChange?: (inputValue: number) => void;
  canInput?: boolean;
  maxNumber?: number;
  minNumber?: number;
  totalNum?: string;
  availableNum?: string;
}

const AddMinusComponent: React.FC<AddMinusComponentProps> = (props) => {
  const {
    limit = 1,
    onChange,
    canInput = true,
    maxNumber,
    minNumber,
    totalNum,
    availableNum,
  } = props;
  const [inputValue, setInputValue] = useState<number>(0);

  const inputEvent = (e: any) => {
    setInputValue(e.target.value);
  };

  const minusEvent = () => {
    if (isNumber(minNumber)) {
      if (subtract(inputValue, limit) >= minNumber) {
        setInputValue(subtract(inputValue, limit));
      }
      return;
    }
    setInputValue(subtract(inputValue, limit));
  };

  const addEvent = () => {
    if (isNumber(maxNumber)) {
      if (add(inputValue, limit) <= maxNumber) {
        setInputValue(add(inputValue, limit));
      }
      return;
    }
    setInputValue(add(inputValue, limit));
  };

  useEffect(() => {
    onChange?.(inputValue);
  }, [inputValue]);

  return (
    <div className={styles.addMinus}>
      <div className={styles.totalNumber}>总量（{totalNum}）</div>
      <div className={styles.canUseNumber}>可用（{availableNum}）</div>
      <div>可用增加：</div>
      <div className={styles.clickArea}>
        <div className={styles.minusBtn} onClick={() => minusEvent()}>
          <MinusOutlined />
        </div>
        <div className={styles.numberArea}>
          <Input readOnly={!canInput} value={inputValue} onChange={inputEvent} />
        </div>
        <div className={styles.addBtn} onClick={() => addEvent()}>
          <PlusOutlined />
        </div>
      </div>
    </div>
  );
};

export default AddMinusComponent;
