
import React, { useRef } from 'react';

import ChooseDesignAndSurvey, { ChooseDesignAndSurveyValue } from '@/pages/project-management/all-project/components/choose-design-and-survey';

const TestPage = () => {
  const testValue = {
    survey: "",
    design: "1270717958644809729",
    logicRelation: 0
  }
  return (
    <ChooseDesignAndSurvey defaultValue={testValue as ChooseDesignAndSurveyValue} />
  );
};

export default TestPage;
