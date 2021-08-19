import ReadonlyItem from '@/components/readonly-item';
import React from 'react';

interface ErrorTabProps {
  info: any;
}

const ErrorTab: React.FC<ErrorTabProps> = (props) => {
  const { info } = props;

  return (
    <>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="异常">{info?.error}</ReadonlyItem>
        </div>
      </div>
    </>
  );
};

export default ErrorTab;
