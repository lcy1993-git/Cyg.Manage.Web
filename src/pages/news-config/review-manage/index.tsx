import React, { FC } from 'react';
import PageCommonWrap from '@/components/page-common-wrap';
import Filterbar from './components/filter-bar';
interface ReviewProps {}

const ReviewManage: FC<ReviewProps> = (props) => {
  return (
    <>
      <PageCommonWrap>
        <Filterbar />
        <div>hello review</div>
      </PageCommonWrap>
    </>
  );
};

export default ReviewManage;
