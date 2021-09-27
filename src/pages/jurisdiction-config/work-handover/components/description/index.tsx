import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import React from 'react';
import styles from './index.less';
import { history } from 'umi';

const Description: React.FC = () => {
  const buttonJurisdictionArray = useGetButtonJurisdictionArray();
  return (
    <div className={styles.others}>
      <div className={styles.noticeHead}>*其他注意事项：</div>
      <div>
        <p>
          公司用户执行工作交接后，需要对应调整接受人员的“授权端口”，确保工作接受人员能够正常登录相关端口并执行
          相关操作。
        </p>
        <div>
          “授权端口”调整操作：登入管理【权限管理】 -
          {buttonJurisdictionArray?.includes('company-user-work-handover') ? (
            <span
              className="canClick"
              onClick={() => {
                history.push({
                  pathname: '/personnel-config/company-user',
                });
              }}
            >
              <u>【账号管理】</u>
            </span>
          ) : (
            <span>【账号管理】</span>
          )}
          选择对应的人员账号，点击【编辑】按钮， 调整对应的“授权端口”即可。
        </div>
        <div>
          “功能权限”调整操作：登入管理【权限管理】 -
          {buttonJurisdictionArray?.includes('role-permissions-authorization') ? (
            <span
              className="canClick"
              onClick={() => {
                history.push({
                  pathname: '/jurisdiction-config/role-permissions',
                });
              }}
            >
              <u>【功能权限】</u>
            </span>
          ) : (
            <span>【功能权限】</span>
          )}
          选择对应权限模板后点击【授权】按钮，将该 授权给对应的人员账号即可。
        </div>
        <div className={styles.noticeFooter}>
          确认以上“项目管理”、“作业任务”、“部组身份”以及对应的“授权端口”和“角色权限”均完成交接后，认为交接工作
          已经完成，可通过下方【交接完成】关闭“工作交接”选项卡。
        </div>
      </div>
    </div>
  );
};

export default Description;
