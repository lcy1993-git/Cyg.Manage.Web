/** 变电站参数类型 */
export interface TransformerSubstationType {
  builtScaleMainTransformer: number
  designScaleMainTransformer: number
  geom: string
  kvLevel: number
  name: string
}

/** 电源参数类型 **/
export interface PowerSupplyType {
  geom: string
  installedCapacity: number
  kvLevel: number
  name: string
  powerType: string
  schedulingMode: string
}
