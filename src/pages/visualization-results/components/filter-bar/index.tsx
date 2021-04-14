import React, { FC } from 'react';
import { Form, Input, Select, Button } from 'antd';
import classNames from 'classnames';
import { useGetProjectEnum } from '@/utils/hooks';
import styles from './index.less';

const { Search } = Input;
const { Option } = Select;
const FilterBar: FC = () => {
  const {
    projectCategory,
    projectPType,
    projectNature,
    projectConstructType,
    projectStage,
    projectKvLevel,
  } = useGetProjectEnum();

  return (
    <div>
      <Form name="basic" className={styles.form} initialValues={{ remember: true }}>
        <Form.Item
          label="项目名称"
          className={styles.formItem}
          name="username"
          rules={[{ message: 'Please input your username!' }]}
        >
          <Search style={{ width: 120 }} placeholder="请输入" enterButton />
        </Form.Item>

        <Form.Item
          label="立项时间"
          className={styles.formItem}
          name="password"
          rules={[{ message: 'Please input your password!' }]}
        >
          <Select placeholder="年" style={{ width: 106 }}>
            {projectCategory?.map(({ text }: { text: string }) => (
              <Option key={text} value={text}>
                {text}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="更新时间"
          className={styles.formItem}
          name="password"
          rules={[{ message: 'Please input your password!' }]}
        >
          <Select placeholder="年" style={{ width: 120 }}>
            <Option value="2020">2020</Option>
            <Option value="2021">2021</Option>

            <Option value="2022">2022</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="项目状态"
          className={classNames(styles.formItem, styles.projectState)}
          name="password"
          rules={[{ message: 'Please input your password!' }]}
        >
          <Input.Group compact className={styles.projectStateSelectGroup}>
            <Select placeholder="项目分类" style={{ width: 120 }}>
              {projectCategory?.map(({ text }: { text: string }) => (
                <Option key={text} value={text}>
                  {text}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="项目类别"
              className={styles.projectStateSelectItem}
              style={{ width: 120 }}
            >
              {projectPType?.map(({ text }: { text: string }) => (
                <Option key={text} value={text}>
                  {text}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="项目阶段"
              className={styles.projectStateSelectItem}
              style={{ width: 120 }}
            >
              {projectStage?.map(({ text }: { text: string }) => (
                <Option key={text} value={text}>
                  {text}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="建设性质"
              className={styles.projectStateSelectItem}
              style={{ width: 120 }}
            >
              {projectNature?.map(({ text }: { text: string }) => (
                <Option key={text} value={text}>
                  {text}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="电压等级"
              className={styles.projectStateSelectItem}
              style={{ width: 120 }}
            >
              {projectKvLevel?.map(({ text }: { text: string }) => (
                <Option key={text} value={text}>
                  {text}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="项目性质"
              className={styles.projectStateSelectItem}
              style={{ width: 120 }}
            >
              {projectConstructType?.map(({ text }: { text: string }) => (
                <Option key={text} value={text}>
                  {text}
                </Option>
              ))}
            </Select>
          </Input.Group>
        </Form.Item>

        <Form.Item className={classNames(styles.formItem, styles.buttonGroup)}>
          <Button type="primary" className={styles.buttonGroupItem} htmlType="submit">
            查询
          </Button>
          <Button htmlType="button">重置</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FilterBar;
