import React, { useContext } from "react";
import {IndexContext} from "../../context"; 
import PersonelLoad from '../personnel-load';

interface Props {
  componentProps?: string[]
}

const IndexPersonnelLoadComponents: React.FC<Props> = (props) => {
  const {currentAreaId,currentAreaLevel} = useContext(IndexContext);
  return (
    <>
      <PersonelLoad areaId={currentAreaId} areaLevel={currentAreaLevel} {...props} />
    </>
  )
}

export default IndexPersonnelLoadComponents;