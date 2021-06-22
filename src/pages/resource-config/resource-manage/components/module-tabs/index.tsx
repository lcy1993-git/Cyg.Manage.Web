import React, { useState, useEffect } from 'react';
import styles from './index.less';

const Tabs: React.FC = () => {
  const [value, setValue] = useState<number>(0);

  return (
    <div className="tabs">
      <div className='tabList'></div>
    </div>
  );
};
