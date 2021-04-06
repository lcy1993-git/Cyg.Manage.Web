import React from 'react';
import ReactJson from 'react-json-view';

interface ResContentProps {
  info: any;
}

const ResContent: React.FC<ResContentProps> = (props) => {
  const { info } = props;
  return (
    <div style={{ width: '100%', overflow: 'auto', height: '500px' }}>
      {info.resContent ? <ReactJson src={JSON.parse(info.resContent)} /> : null}
    </div>
  );
};

export default ResContent;
