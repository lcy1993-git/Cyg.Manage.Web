import React from "react"
import logonSrc from "@/assets/image/logo.png";
import {logoArray} from "../../../public/config/request";

interface LogoComponentProps {
    className?: string
}

const LogoComponent:React.FC<LogoComponentProps> = (props) => {
    const thisHostName = window.location.hostname;
    const imgName = logoArray[thisHostName];
    const {className,...rest} = props;
    const imgSrc = imgName ? require("../../assets/icon-image/"+imgName+"") : logonSrc;
    return (
        <img src={imgSrc} {...rest} className={className} alt="logo" />
    )
}

export default LogoComponent