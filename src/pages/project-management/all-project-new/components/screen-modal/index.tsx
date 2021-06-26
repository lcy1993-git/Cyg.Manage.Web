import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useControllableValue } from 'ahooks';
import UrlSelect from '@/components/url-select';
import { Button, Modal, Form, DatePicker, Select } from 'antd';
import { useGetProjectEnum } from '@/utils/hooks';
import CyFormItem from '@/components/cy-form-item';
import { Moment } from 'moment';
import AreaSelect from '@/components/area-select';
import EnumSelect from '@/components/enum-select';
import {
  ProjectIdentityType,
  ProjectSourceType,
  ProjectStatus,
} from '@/services/project-management/all-project';
import ChooseDesignAndSurvey from '@/pages/project-management/all-project/components/choose-design-and-survey';
import styles from './index.less';

interface ScreenModalProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  finishEvent?: () => void;
  searchParams?: any;
}

const { RangePicker } = DatePicker;

const ScreenModal: React.FC<ScreenModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [category, setCategory] = useState<number[]>(); //项目分类
  const [pCategory, setPCategory] = useState<number[]>(); //项目类别
  const [stage, setStage] = useState<number[]>(); //项目阶段
  const [constructType, setConstructType] = useState<number[]>(); //建设性质
  const [nature, setNature] = useState<number[]>(); //项目性质
  const [kvLevel, setKvLevel] = useState<number[]>(); //电压等级
  const [status, setStatus] = useState<number[]>(); //状态
  const [majorCategory, setMajorCategory] = useState<number[]>(); //专业类别
  const [createdOn, setCreatedOn] = useState<Moment | null>(); //创建时间
  const [modifyDate, setsModiyDate] = useState<Moment | null>(); //更新时间
  const [sourceType, setSourceType] = useState<number[]>(); //项目来源
  const [identityType, setIdentityType] = useState<number[]>(); //项目身份
  const [areaInfo, setAreaInfo] = useState({ areaType: '-1', areaId: '' });
  const [dataSourceType, setDataSourceType] = useState<number>();
  const [personInfo, setPersonInfo] = useState<any>({});
  const areaRef = useRef<HTMLDivElement>(null);
  const personRef = useRef<HTMLDivElement>(null);

  const [selectDefaultData, setSelectDefaultData] = useState({
    logicRelation: 2,
    survey: '',
    design: '',
  });

  const imgSrc = require('../../../../../assets/icon-image/bottom.png');

  const searchEvent = () => {};

  const resetEvent = () => {};

  const areaChangeEvent = (params: any) => {
    const { provinceId, cityId, areaId } = params;
    if (areaId) {
      setAreaInfo({
        areaType: '3',
        areaId: areaId,
      });
      return;
    }
    if (cityId) {
      setAreaInfo({
        areaType: '2',
        areaId: cityId,
      });
      return;
    }
    if (provinceId) {
      setAreaInfo({
        areaType: '1',
        areaId: provinceId,
      });
      return;
    }
    if (!provinceId && !cityId && !areaId) {
      setAreaInfo({
        areaType: '-1',
        areaId: '',
      });
    }
  };

  const closeEvent = () => {
    setState(false);
  };

  const {
    projectCategory,
    projectClassification,
    projectNature,
    projectPType,
    projectConstructType,
    projectStage,
    projectKvLevel,
    projectMajorCategory,
  } = useGetProjectEnum();

  return (
    <Modal
      maskClosable={false}
      title="条件筛选"
      centered
      width={820}
      visible={state as boolean}
      destroyOnClose
      footer={[
        <Button key="cancle" onClick={() => resetEvent()}>
          重置
        </Button>,
        <Button key="save" type="primary" onClick={() => searchEvent()}>
          确定
        </Button>,
      ]}
      onCancel={() => closeEvent()}
    >
      <Form preserve={false}>
        <>
          <div className="flex">
            <div className="flex1">
              <CyFormItem label="项目区域" align="right" labelWidth={111}>
                <AreaSelect ref={areaRef} onChange={areaChangeEvent} />
              </CyFormItem>
            </div>
            <div className="flex1">
              <CyFormItem label="项目起止日期" align="right" labelWidth={111}>
                <RangePicker />
              </CyFormItem>
            </div>
          </div>

          <div className="flex">
            <div className="flex1">
              <CyFormItem label="建设类型" align="right" labelWidth={111}>
                <UrlSelect
                  valueKey="value"
                  titleKey="text"
                  mode="multiple"
                  allowClear
                  maxTagCount={0}
                  maxTagTextLength={3}
                  defaultData={projectConstructType}
                  value={constructType}
                  className="widthAll"
                  placeholder="建设类型"
                  onChange={(value) => setConstructType(value as number[])}
                />
              </CyFormItem>
            </div>
            <div className="flex1">
              <CyFormItem label="项目阶段" align="right" labelWidth={111}>
                <UrlSelect
                  valueKey="value"
                  titleKey="text"
                  mode="multiple"
                  allowClear
                  maxTagCount={0}
                  maxTagTextLength={3}
                  defaultData={projectStage}
                  value={stage}
                  className="widthAll"
                  onChange={(value) => setStage(value as number[])}
                  placeholder="项目阶段"
                />
              </CyFormItem>
            </div>
          </div>

          <div className="flex">
            <div className="flex1">
              <CyFormItem label="专业类别" align="right" labelWidth={111}>
                <UrlSelect
                  valueKey="value"
                  titleKey="text"
                  defaultData={projectMajorCategory}
                  value={majorCategory}
                  dropdownMatchSelectWidth={168}
                  onChange={(values: number[]) => setMajorCategory(values)}
                  className="widthAll"
                  placeholder="项目类别"
                  needAll={true}
                  allValue="-1"
                />
              </CyFormItem>
            </div>
            <div className="flex1">
              <CyFormItem label="项目状态" align="right" labelWidth={111}>
                <UrlSelect
                  maxTagCount={0}
                  maxTagTextLength={2}
                  mode="multiple"
                  allowClear
                  value={status}
                  onChange={(value) => setStatus(value as number[])}
                  style={{ width: '100%' }}
                  placeholder="项目状态"
                />
                {/* {getProjectStatusOption()} */}
                {/* </Select> */}
              </CyFormItem>
            </div>
          </div>

          <div className="flex">
            <div className="flex1">
              <CyFormItem label="项目来源" align="right" labelWidth={111}>
                <EnumSelect
                  enumList={ProjectSourceType}
                  mode="multiple"
                  allowClear
                  maxTagCount={0}
                  maxTagTextLength={3}
                  value={sourceType}
                  onChange={(value) => setSourceType(value as number[])}
                  className="widthAll"
                  placeholder="项目来源"
                />
              </CyFormItem>
            </div>
            <div className="flex1">
              <CyFormItem label="项目身份" align="right" labelWidth={111}>
                <EnumSelect
                  enumList={ProjectIdentityType}
                  mode="multiple"
                  allowClear
                  maxTagCount={0}
                  maxTagTextLength={3}
                  value={identityType}
                  onChange={(value) => setIdentityType(value as number[])}
                  className="widthAll"
                  placeholder="项目身份"
                />
              </CyFormItem>
            </div>
          </div>
          <div className="flex">
            <div className="flex1">
              <CyFormItem label="人员安排" align="right" labelWidth={111}>
                <ChooseDesignAndSurvey
                  ref={personRef}
                  defaultValue={selectDefaultData}
                  onChange={setPersonInfo}
                />
              </CyFormItem>
            </div>
            <div className="flex1">
              <CyFormItem label="电压等级" align="right" labelWidth={111}>
                <UrlSelect
                  valueKey="value"
                  titleKey="text"
                  mode="multiple"
                  allowClear
                  maxTagCount={0}
                  maxTagTextLength={3}
                  defaultData={projectKvLevel}
                  value={kvLevel}
                  onChange={(value) => setKvLevel(value as number[])}
                  className="widthAll"
                  placeholder="电压等级"
                />
              </CyFormItem>
            </div>
          </div>
          <div className={styles.moreInfo}>
            更多条件
            <img src={imgSrc} alt="" />
          </div>
        </>
      </Form>
    </Modal>
  );
};

export default ScreenModal;
