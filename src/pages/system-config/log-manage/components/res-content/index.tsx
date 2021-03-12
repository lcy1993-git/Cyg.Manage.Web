import React from 'react';

interface ResContentProps {
  info: any;
}

const ResContent: React.FC<ResContentProps> = (props) => {
  const { info } = props;
  return (

    <div style={{ width: "100%", overflow: "auto", height: "500px"}}>
      <pre>
        {info.resContent}
      </pre>
    </div>

  );
};

export default ResContent;
