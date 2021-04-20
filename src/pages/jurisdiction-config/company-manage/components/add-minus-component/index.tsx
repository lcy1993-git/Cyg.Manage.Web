import React, { useState } from 'react';
import styles from './index.less';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Input } from 'antd';

interface AddMinusComponentProps {
  // importUrl: string;
  // extraParams?: object;
  // modalTitle?: string;
  // accept?: string;
  // name?: string;
  // labelTitle?: string;
  // buttonTitle?: string;
  // requestSource?: 'project' | 'resource' | 'upload';
  // postType?: 'body' | 'query';
}

const AddMinusComponent: React.FC<AddMinusComponentProps> = (props) => {
  const {} = props;
  const [currentNumber, setCurrentNumber] = useState<number>(0);

  return (
    <div className={styles.addMinus}>
      <div>可用增加：</div>
      <div className={styles.clickArea}>
        <div className={styles.minusBtn}>
          <MinusOutlined onClick={() => {}} />
        </div>
        <div className={styles.numberArea}>
          <Input />
        </div>
        <div className={styles.addBtn}>
          <PlusOutlined onClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default AddMinusComponent;
