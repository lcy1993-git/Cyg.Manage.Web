import {Form, Select} from 'antd';

const {Item} = Form;

const AreaManagrForm = () => {

  const onSelect1 = () => {
    console.log(1);
    
  }

  const [options3, setOptions3] = useState();
  const [options1, setOptions1] = useState();
  const [options2, setOptions2] = useState();


  return (
    <>
      <Item name="a1">
        <Select options={[]} onSelect={() => onSelect1()}/>
      </Item>
      <Item name="a2">
        <Select options={[]} onSelect={() => onSelect1()}/>
      </Item>
      <Item name="a3">
        <Select options={[]} onSelect={() => onSelect1()}/>
      </Item>
    </>
  );
}

export default AreaManagrForm;