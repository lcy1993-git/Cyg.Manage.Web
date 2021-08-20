import FileDocxView from '../file-docx-view';
import FileXlsxView from '../file-xlsx-view';

export type FileType = 'xlsx' | 'docx';

const context = new Map<FileType, React.FC<any>>();

context.set('docx', FileDocxView);
context.set('xlsx', FileXlsxView);

const getStrategyComponent = (type: FileType) => {
  return context.get(type);
};

export { getStrategyComponent as default };
