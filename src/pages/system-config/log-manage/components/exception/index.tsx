import React from 'react';

interface ExceptionProps {
  info: any;
}

const Exception: React.FC<ExceptionProps> = (props) => {
  const { info } = props;

  return (
    <div style={{ width: '100%', overflow: 'auto', height: '500px' }}>
      <pre>{info.exception}</pre>
    </div>
  );
};

export default Exception;
