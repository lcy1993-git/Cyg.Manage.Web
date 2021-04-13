import { CockpitProps } from ".";

export const getHasChooseComponentsProps = (configArray: CockpitProps[], componentName: string) => {
    return configArray.filter((item) => item.name === componentName && item.componentProps).map((item) => item.componentProps).flat();
}