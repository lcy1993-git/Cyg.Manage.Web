
import React, { useRef } from 'react';

import ChooseDesignAndSurvey, { ChooseDesignAndSurveyValue } from '@/pages/project-management/all-project/components/choose-design-and-survey';

import styles from './index.less';

const TestPage = (data) => {
  const testValue = {
    survey: "",
    design: "1270717958644809729",
    logicRelation: 0
  }
  return (
    <>

      <table className={styles.table}>
        <thead>

        </thead>
        <tbody>
          <tr>
            <th colSpan={2}>
              地区分类
            </th>
            <th>
              I
            </th>
            <th>
              II
            </th>
            <th>III</th>
            <th>IV</th>
            <th>V</th>
          </tr>
          <tr>
            <td rowSpan={2}>
              地区分类
            </td>
            <td>
              建筑工程
            </td>
            <td>
              3
            </td>
            <td>
              3
            </td>
            <td>
              3
            </td>
            <td>
              3
            </td>
            <td>
              3
            </td>
          </tr>
          <tr>
            <td>
              安装工程
            </td>
            <td>
              3
            </td>
            <td>
              3
            </td>
            <td>
              3
            </td>
            <td>
              3
            </td>
            <td>
              3
            </td>
          </tr>
        </tbody>
      </table>
      <table className={styles.table}>
        <thead>
          <tr>
            <th >
              <pre>表3.3.2 地区分类表</pre>
            </th>
          </tr>
        </thead>
        <tbody>
          <th >
            <pre>表3.3.2 地区分类表</pre>
          </th>
        </tbody>
      </table>

    </>
  );
};

export default TestPage;
