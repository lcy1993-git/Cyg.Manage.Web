import React from "react";



export const MapFormContext = React.createContext<any>(null)

export const defaultState = {
    chooseLibId: ""
}

export const mapFormReducer = (state: any, action: any) => {
    switch(action.type) {
        case "CHOOSE_LIb":
            return {...state}
        break;
        default: 
        throw new Error();
    }
}