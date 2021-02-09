import ReadonlyItem from '@/components/readonly-item';
import React from 'react';

interface reqPostBodyProps {
  info: any;
}

const ReqPostBody: React.FC<reqPostBodyProps> = (props) => {
  const { info } = props;
  return (
    <div>
      <ReadonlyItem label="Post数据源">{info.reqPostBody}</ReadonlyItem>
    </div>
  );
};

export default ReqPostBody;
