import React from 'react';
import styles from './index.less';
import Filterbar from '../components/filter-bar';
import Footer from '../components/footer';
import SideMenu from '../components/side-menu';
const VisualizationResults: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Filterbar />

      <div className="content">
        <SideMenu />
      </div>

      <Footer />
    </div>
  );
};

export default VisualizationResults;
