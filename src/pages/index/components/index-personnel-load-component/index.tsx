import React, { useContext } from "react";
import {IndexContext} from "../../context"; 
import PersonelLoad from '../personnel-load';

interface Props {
  componentProps?: string[]
}

const IndexPersonnelLoadComponents: React.FC<Props> = (props) => {
  const { currentAreaInfo } = useContext(IndexContext);
  return (
    <>
      <PersonelLoad currentAreaInfo={currentAreaInfo} {...props} />
    </>
  )
}

export default IndexPersonnelLoadComponents;