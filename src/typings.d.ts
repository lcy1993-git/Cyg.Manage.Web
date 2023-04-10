declare module 'slash2'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module 'omit.js'
declare module '*.docx'

declare module 'react-virtualized-auto-sizer' {
  /**
   * @see https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md#prop-types
   */
  type Props = {
    children: (param: { width: number; height: number }) => JSX.Element
    className?: string
    defaultHeight?: number
    defaultWidth?: number
    disableWidth?: boolean
    disableHeight?: boolean
    nonce?: string
    onResize?: (param: { height: number; width: number }) => void
    style?: React.CSSProperties
  }

  export default function AutoSizer(props: Props): JSX.Element
}
declare module '*html2pdf.js'

// google analytics interface
interface GAFieldsObject {
  eventCategory: string
  eventAction: string
  eventLabel?: string
  eventValue?: number
  nonInteraction?: boolean
}
interface Window {
  ga: (
    command: 'send',
    hitType: 'event' | 'pageview',
    fieldsObject: GAFieldsObject | string
  ) => void
  reloadAuthorized: () => void
  /** lucky-sheet */
  luckysheet: any
  LuckyExcel: any
  /** jquery */
  $: jQuery
  jQuery: jQuery
  /** uuid */
  uuid: v4
}

declare let ga: Function

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false
