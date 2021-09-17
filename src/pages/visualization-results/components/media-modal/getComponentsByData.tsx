import React from 'react';
import MediaImage from './components/media-image';
import MediaAudio from './components/media-audio';

type FileType = 1 | 2;

export interface MediaData {
  id: string;
  projectId: string;
  type: number;
  size: number;
  fileName?: string;
  filePath: string;
  mainId: string;
  mainType: 1;
  remark?: string;
  account: string;
  surveyTime: number;
  authorization?: string;
}

const strategyComponent = new Map<FileType, ((data: MediaData, index: number, preFullClick: () => void, nextFullClick: () => void, content: any[]) => React.ReactElement)>();

// 多媒体图片组件
strategyComponent.set(
  1,
  (data, index, preFullClick, nextFullClick, content) => <MediaImage data={data} index={index} preFullClick={preFullClick} nextFullClick={nextFullClick} content={content}/>
);

// 多媒体音频组件
strategyComponent.set(
  2,
  (data) => <MediaAudio data={data} />
)

const getComponentsByData = (data: MediaData, index: number, preFullClick: () => void, nextFullClick: () => void, content: any[]) => {

  if (data?.type) {
    return strategyComponent.get(data.type as FileType)!(data, index, preFullClick, nextFullClick, content);
  }
  return null
}

export default getComponentsByData;