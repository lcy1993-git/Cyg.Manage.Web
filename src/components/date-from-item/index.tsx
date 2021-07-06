import { DatePicker, DatePickerProps } from 'antd';
import moment, { Moment } from 'moment';

interface Props {
  value?: string;
  onChange?: (arg0: string)=>void;
}

/**
 * 受控日期组件，与CyFormItem嵌套使用
 * @param  null, API同DatePicker
 * @returns JSX.Element
 */
const DatePickerForm: React.FC<Props & DatePickerProps> = ({value, onChange, picker, ...rest}) => {
  const format = picker === 'year' ? "YYYY" : "YYYY-MM-DD";
  const handleDate = (v: Moment | null, m: string) => {
    
    onChange!(moment(m).format(format))
  };

  return <DatePicker  onChange={handleDate} picker={picker} {...rest}/>
}

export default DatePickerForm;