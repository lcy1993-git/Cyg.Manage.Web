import { Modal, Form, Select, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons'
import { useRequest, useMount } from 'ahooks';
import UrlSelect from '@/components/url-select';
import EnumSelect from '@/components/enum-select';
// import { useGetProjectEnum } from '@/utils/hooks';
import {
  ProjectIdentityType,
  ProjectSourceType,
  ProjectStatus,
} from '@/services/project-management/all-project';
import { getEngineerEnum } from '@/services/project-management/all-project';
import styles from './index.less';

const { Item } = Form;
const { Option } = Select;
interface Props {
  visible: boolean;
  onSure?: (arg0: any) => void;
  onCancel?: () => void;
  onChange: (arg0: boolean) => void;
  defaultData: any;
}

interface ProjectStatusOption {
  key: string;
  name: string;
}

const FilterModal: React.FC<Props> = ({
  visible,
  onSure,
  onChange,
  onCancel,
  defaultData
}) => {
  const { data: resData = {}, run } = useRequest(() => getEngineerEnum(), { manual: true });
  useMount(() => run());
  const [form] = Form.useForm();
  const sureEvent = () => {
    form.validateFields().then(async (values) => {
      onSure?.(values)
    })
    onChange(false);
  }

  const getProjectStatusOption = () => {
    const arrayProjectStatus: ProjectStatusOption[] = [];
    for (const [propertyKey, propertyValue] of Object.entries(ProjectStatus)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }
      arrayProjectStatus.push({ key: propertyValue.toString(), name: propertyKey });
    }

    return arrayProjectStatus.map((v) => {
      return <Option key={v.key} children={v.name} value={v.key} />;
    });
  };

  const onReset= () => {
    form.setFieldsValue({
      statuss: undefined,
      pCategory: undefined,
      constructType: undefined,
      nature: undefined,
      identityType: undefined,
      category: undefined,
      stage: undefined,
      kvLevel: undefined,
      sourceType: undefined,
      comment: undefined
    })
  }

  const footer = [
    <Button style={{width: 68}} onClick={onReset}><ReloadOutlined />重置</Button>,
    <Button style={{width: 68}} onClick={sureEvent}type="primary">确定</Button>,
  ]
  const selectStyle = {
    maxTagPlaceholder : (e: any[]) => `已选择${e.length}项`,
    maxTagCount: 0,
    maxTagTextLength: 2
  }

  return (
    <Modal
      title="条件筛选"
      visible={visible}
      onCancel={onCancel ?? (() => onChange(false))}
      cancelText="重置"
      width={827}
      footer={footer}
    >
      <Form form={form}>
        <div className={styles.filterModalWrap}>
          <div className={styles.col}>
            <Item
              name="statuss"
              label="项目状态"
            >
              <Select
                {...selectStyle}
                mode="multiple"
                allowClear
                style={{ width: 200 }}
                placeholder="项目状态"
              >
                {getProjectStatusOption()}
              </Select>
            </Item>
            <Item
              name="pCategory"
              label="项目类别"
            >
              <UrlSelect
                {...selectStyle}
                defaultValue={defaultData.pCategory}
                allowClear
                mode="multiple"
                valueKey="value"
                titleKey="text"
                defaultData={resData.projectPType}
                dropdownMatchSelectWidth={168}
                className="widthAll"
                placeholder="项目类别"
                style={{ width: 200 }}
              />
            </Item>
            <Item
              name="constructType"
              label="建设类别"
            >
              <UrlSelect
                {...selectStyle}
                allowClear
                defaultValue={defaultData.constructType}
                valueKey="value"
                titleKey="text"
                defaultData={resData.projectConstructType}
                className="widthAll"
                mode="multiple"
                placeholder="建设类型"
                style={{ width: 200 }}
              />
            </Item>
            <Item
              name="nature"
              label="项目性质"
            >
              <UrlSelect
                {...selectStyle}
                valueKey="value"
                titleKey="text"
                allowClear
                defaultValue={defaultData.nature}
                defaultData={resData.projectNature}
                mode="multiple"
                dropdownMatchSelectWidth={168}
                className="widthAll"
                placeholder="项目性质"
                style={{ width: 200 }}
              />
            </Item>
            <Item
              name="identityType"
              label="项目身份"
            >
              <EnumSelect
                enumList={ProjectIdentityType}
                defaultValue={defaultData.identityType}
                className="widthAll"
                mode="multiple"
                allowClear
                {...selectStyle}
                placeholder="项目身份"
                style={{ width: 200 }}
              />
            </Item>
          </div>
          <div className={styles.col}>
            <Item
              name="category"
              label="项目分类"
            >
              <UrlSelect
                {...selectStyle}
                allowClear
                defaultValue={defaultData.category}
                mode="multiple"
                valueKey="value"
                titleKey="text"
                defaultData={resData.projectCategory}
                className="widthAll"
                placeholder="项目分类"
                style={{ width: 200 }}
              />
            </Item>
            <Item
              name="stage"
              label="项目阶段"
            >
              <UrlSelect
                {...selectStyle}
                allowClear
                defaultValue={defaultData.stage}
                mode="multiple"
                valueKey="value"
                titleKey="text"
                defaultData={resData.projectStage}
                className="widthAll"
                placeholder="项目阶段"
                style={{ width: 200 }}
              />
            </Item>
            <Item
              name="kvLevel"
              label="电压等级"
            >
              <UrlSelect
                {...selectStyle}
                allowClear
                defaultValue={defaultData.kvLevel}
                mode="multiple"
                valueKey="value"
                titleKey="text"
                defaultData={resData.projectKvLevel}
                className="widthAll"
                placeholder="电压等级"
                style={{ width: 200 }}
              />
            </Item>
            <Item
              name="sourceType"
              label="项目来源"
            >
              <EnumSelect
                {...selectStyle}
                defaultValue={defaultData.sourceType}
                enumList={ProjectSourceType}
                className="widthAll"
                mode="multiple"
                allowClear
                placeholder="项目来源"
                style={{ width: 200 }}
              />
            </Item>
            <Item
              name="comment"
              label="存在审阅"
            >
              <Select
                defaultValue={defaultData.comment}
                allowClear
                style={{ width: 200 }}
                placeholder="存在审阅"
              >
                <Select.Option value={-1} children={'全部'} />
                <Select.Option value={1} children={'是'} />
                <Select.Option value={0} children={'否'} />
              </Select>
            </Item>
          </div>
        </div>


      </Form>
    </Modal>
  );
}

export default FilterModal;