import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import {useMount} from "ahooks";

interface Props {
  value?: string;
  onChange?: (arg0: string) => void;
}

/**
 * 受控日期组件，与CyFormItem嵌套使用
 * @param  null, API同DatePicker
 * @returns JSX.Element
 */
const DatePickerForm: React.FC<Props & DatePickerProps> = ({
  value,
  onChange,
  picker,
  ...rest
}) => {
  const momentValue = moment(value).isValid() ? moment(value) : undefined;
  const format = picker === 'year' ? 'YYYY' : 'YYYY-MM-DD';
  const handleDate = (v: Moment | null, m: string) => {
    onChange!(moment(m).format(format));
  };
  useMount(()=>{
    if (value){
      onChange!(moment(moment(value).format("YYYY-MM-DD")).format(format));
    } else {
      onChange!(moment(moment(new Date()).format("YYYY-MM-DD")).format(format));
    }
  })
  return <DatePicker value={momentValue} onChange={handleDate} picker={picker} {...rest} />;
};

export default DatePickerForm;
