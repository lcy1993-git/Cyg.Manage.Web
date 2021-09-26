import React, { useRef, useState } from 'react';
import ToDo from '../components/to-do-second';



const TestPage = () => {
  return (
    <div style={{ width: '400px', height: '600px' }}>
      <ToDo currentAreaInfo={{areaId: "", areaLevel: "1"}} />
    </div>
  );
};

export default TestPage;
