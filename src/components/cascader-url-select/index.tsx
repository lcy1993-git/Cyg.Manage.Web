import React, { FC, useEffect, useState } from 'react';
import UrlSelect from '../url-select';
import styles from './index.less';
interface CascaderProps {
  onChange?: (mc: MaterialAndComponent) => void;
  libId: string;
}

interface MaterialAndComponent {
  materailId?: string;
  componentId?: string;
}

const MCCascaderUrlSelect: FC<CascaderProps> = (props) => {
  const { onChange, libId } = props;
  const [materialComponent, setMaterialComponent] = useState<MaterialAndComponent>();
  const onMaterialChange = (materailId: string) => {
    setMaterialComponent({ ...materialComponent, materailId });
    onChange?.({ ...materialComponent, materailId });
  };

  const onComponentChange = (componentId: string) => {
    setMaterialComponent({ ...materialComponent, componentId });
    onChange?.({ ...materialComponent, componentId });
  };

  useEffect(() => {
    console.log(materialComponent);
  }, [materialComponent]);
  return (
    <div className={styles.cascader}>
      <UrlSelect
        requestSource="resource"
        url="/Material/GetList"
        valueKey="materialId"
        titleKey="materialName"
        allowClear
        className={styles.selectItem}
        maxTagTextLength={5}
        onChange={(value) => onMaterialChange(value as string)}
        requestType="post"
        postType="query"
        placeholder="--物料--"
        libId={libId}
      />
      <UrlSelect
        requestSource="resource"
        url="/Component/GetList"
        maxTagTextLength={5}
        valueKey="componentId"
        titleKey="componentName"
        allowClear
        onChange={(value) => onComponentChange(value as string)}
        requestType="post"
        postType="query"
        placeholder="--组件--"
        libId={libId}
      />
    </div>
  );
};

export default MCCascaderUrlSelect;
