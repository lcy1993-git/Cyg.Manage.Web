import { Switch } from 'antd';
import React, { useState, useEffect } from 'react';

interface FormSwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

const withFormProps = <P extends {}>(WrapperComponent: React.ComponentType<P>) => (
  props: P & FormSwitchProps & { children?: React.ReactNode },
) => {
  const { value = false, onChange, ...rest } = props;

  const [formValue, setFormValue] = useState<boolean>(true);

  const changeEvent = (checked: boolean) => {
    setFormValue(checked);
    onChange?.(checked);
  };

  useEffect(() => {
    setFormValue(value);
    onChange?.(value);
  }, [value]);

  return <WrapperComponent checked={formValue} onChange={changeEvent} {...(rest as P)} />;
};

export default withFormProps(Switch);
