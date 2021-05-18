import material from '@/pages/resource-config/material';
import React, { FC, useEffect, useState } from 'react';
import UrlSelect from '../url-select';
import styles from './index.less';
interface CascaderProps {
  onChange?: (mc: MaterialAndComponent) => void;
  libId: string;
}

interface Material {
  name: string;
  id: string;
}

interface Component {
  name: string;
  id: string;
}

interface MaterialAndComponent {
  material?: Material;
  component?: Component;
}

const MCCascaderUrlSelect: FC<CascaderProps> = (props) => {
  const { onChange, libId } = props;
  const [material, setMaterial] = useState<Material>();
  const [component, setComponent] = useState<Component>();
  const [active, setActive] = useState<boolean>(true);

  const onMaterialChange = (materail: { label: string; value: string }) => {
    setMaterial({ name: materail.label, id: materail.value });
    setActive(false);
  };

  const onComponentChange = (component: { label: string; value: string }) => {
    setComponent({ name: component.label, id: component.value });
  };

  useEffect(() => {
    onChange?.({ component, material });
  }, [material, component]);
  return (
    <div className={styles.cascader}>
      <UrlSelect
        requestSource="resource"
        url="/Material/GetList"
        valueKey="materialId"
        titleKey="materialName"
        allowClear
        labelInValue
        className={styles.selectItem}
        maxTagTextLength={5}
        onChange={(value) => onMaterialChange(value as { label: string; value: string })}
        requestType="post"
        postType="query"
        placeholder="--物料1--"
        libId={libId}
      />
      <UrlSelect
        requestSource="resource"
        url="Component/GetListByName"
        manual={active}
        extraParams={{ libId, name: material?.name }}
        maxTagTextLength={5}
        valueKey="componentId"
        titleKey="componentName"
        allowClear
        labelInValue
        onChange={(value) => onComponentChange(value as { label: string; value: string })}
        requestType="post"
        postType="body"
        placeholder="--组件1--"
      />
    </div>
  );
};

export default MCCascaderUrlSelect;
