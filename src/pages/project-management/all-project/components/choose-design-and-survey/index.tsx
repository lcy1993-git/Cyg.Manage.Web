import DataSelect from '@/components/data-select';
import { useGetSelectData } from '@/utils/hooks';
import { DownOutlined } from '@ant-design/icons';
import { useClickAway } from 'ahooks';
import { Select } from 'antd';
import React, {
  useRef,
  useState,
  forwardRef,
  Ref,
  useImperativeHandle,
  useMemo,
  useEffect,
} from 'react';
import styles from './index.less';

export interface ChooseDesignAndSurveyValue {
  survey: string;
  logicRelation: LogicRelation;
  design: string;
}

interface SelectProps {
  onChange?: (value: ChooseDesignAndSurveyValue) => void;
  defaultValue?: ChooseDesignAndSurveyValue;
}

type LogicRelation = 1 | 2;

const ChooseDesignAndSurveySelect = (props: SelectProps, ref: Ref<any>) => {
  const [selectAreaVisible, setSelectAreaVisible] = useState<boolean>(false);

  const [survey, setSurvey] = useState<string>('');
  const [logicRelation, setLogicRelation] = useState<LogicRelation>(2);
  const [design, setDesign] = useState<string>('');

  const { data: personData = [] } = useGetSelectData({
    url: '/CompanyUser/GetList',
    extraParams: { clientCategory: '0' },
  });

  const { onChange, defaultValue } = props;

  const selectRef = useRef<HTMLDivElement>(null);
  const selectContentRef = useRef<HTMLDivElement>(null);

  const showSelectContent = (e: any) => {
    if (selectContentRef && selectContentRef.current) {
      const windowWidth = document.body.clientWidth;

      const offsetInfo = e.currentTarget.getBoundingClientRect();
      let xOffsetLeft = offsetInfo.left + 260 > windowWidth ? windowWidth - 260 : offsetInfo.left;

      selectContentRef.current.style.left = `${xOffsetLeft - 8}px`;
      selectContentRef.current.style.top = `${offsetInfo.top + 32}px`;
    }
    setSelectAreaVisible(true);
  };

  useClickAway(() => {
    setSelectAreaVisible(false);
  }, [selectRef, selectContentRef]);

  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    reset: () => {},
  }));

  useEffect(() => {
    onChange?.({
      survey: survey === '-1' ? '' : survey,
      logicRelation,
      design: design === '-1' ? '' : design,
    });
  }, [survey, logicRelation, design]);

  useEffect(() => {
    if (defaultValue) {
      setDesign(defaultValue?.design);
      setLogicRelation(defaultValue?.logicRelation);
      setSurvey(defaultValue?.survey);
    }
  }, [JSON.stringify(defaultValue)]);

  const selectHasChooseInfo = useMemo(() => {
    const hasSurvey = survey !== '' && survey !== '-1';
    const hasDesign = design !== '' && design !== '-1';

    const designName = hasDesign
      ? personData.find((item: any) => item.value === design)?.label
      : '';
    const surveyName = hasSurvey
      ? personData.find((item: any) => item.value === survey)?.label
      : '';
    const logicRelationWord = logicRelation === 2 ? '与' : '或';

    if (hasSurvey && hasDesign) {
      return `勘察: ${surveyName} ${logicRelationWord} 设计：${designName}`;
    }

    if (!hasSurvey && hasDesign) {
      return `设计：${designName}`;
    }

    if (hasSurvey && !hasDesign) {
      return `勘察: ${surveyName}`;
    }
    return '';
  }, [survey, logicRelation, design, JSON.stringify(personData)]);

  return (
    <div className={styles.chooseDesignAndSurveySelect}>
      <div
        className={styles.chooseDesignAndSurveySelectContent}
        onClick={showSelectContent}
        ref={selectRef}
      >
        {!selectHasChooseInfo && <div className={styles.selectPlaceholder}>人员安排</div>}
        {selectHasChooseInfo && <div className={styles.hasSelectTip}>{selectHasChooseInfo}</div>}
        <div className={styles.selectFold}>
          <DownOutlined />
        </div>
      </div>
      <div
        className={`${styles.popContent} ${selectAreaVisible ? 'show' : 'hide'}`}
        ref={selectContentRef}
      >
        <div className={styles.popContentItem}>
          <div className={styles.popContentItemLabel}>勘察人</div>
          <div className={styles.popContentItemSelect}>
            <DataSelect
              value={survey}
              onChange={(value) => setSurvey(value as string)}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              style={{ width: '100%' }}
              options={[{ label: '全部', value: '-1' }, ...personData]}
            />
          </div>
        </div>
        <div className={styles.popContentItem}>
          <span className={styles.popContentItemLabel}>条&emsp;件</span>
          <div className={styles.popContentItemSelect}>
            <Select
              value={logicRelation}
              onChange={(value) => setLogicRelation(value as LogicRelation)}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              style={{ width: '100%' }}
              options={[
                { label: '与', value: 2 },
                { label: '或', value: 1 },
              ]}
            />
          </div>
        </div>
        <div className={styles.popContentItem}>
          <span className={styles.popContentItemLabel}>设计人</span>
          <div className={styles.popContentItemSelect}>
            <DataSelect
              value={design}
              onChange={(value) => setDesign(value as string)}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              style={{ width: '100%' }}
              options={[{ label: '全部', value: '-1' }, ...personData]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(ChooseDesignAndSurveySelect);
