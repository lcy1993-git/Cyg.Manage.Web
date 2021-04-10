import React from 'react';
import ReactJson from 'react-json-view';

interface ResContentProps {
  info: any;
}

const ResContent: React.FC<ResContentProps> = (props) => {
  const { info } = props;
  return (
    <div style={{ width: '100%',wordBreak: "break-all", height: '500px',overflowY: "auto" }}>
      {info.resContent ? <ReactJson src={JSON.parse(info.resContent)} /> : null}
    </div>
  );
};

export default ResContent;
