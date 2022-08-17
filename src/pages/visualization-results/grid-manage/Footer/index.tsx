import styles from './index.less'
const Footer = () => {
  return (
    <div
      className="text-center text-sm"
      style={{ height: 40, lineHeight: '40px', backgroundColor: '#ECECEC' }}
    >
      <span style={{ color: '#1F1F1F' }}>工程智慧云平台</span>
      <span style={{ color: '#8C8C8C' }}>版权所有</span>
      <span
        style={{ color: '#0076FF' }}
        className="cursor-pointer"
        onClick={() =>
          window.open(`/instructionsManage?token=${window.localStorage.getItem('Authorization')}`)
        }
      >
        《工程智慧云平台管理端使用说明书》
      </span>
      <a className={styles.linkToBeian} href="https://beian.miit.gov.cn/">
        蜀ICP备2021026719号-1
      </a>
    </div>
  )
}

export default Footer
