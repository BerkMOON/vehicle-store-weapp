import Taro from '@tarojs/taro';
import * as XLSX from 'xlsx';

// 辅助函数，用于安全访问嵌套属性
const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, key) => {
    if (acc === null || acc === undefined) return null;
    return acc[key];
  }, obj);
}

export const createXlsxFile = (params: { data: any[], fileName: string, keyAndNames: any[] }) => {
  const { data, fileName, keyAndNames } = params

  const filePath = Taro.env.USER_DATA_PATH + '/'+ fileName;

  const filteredData = data?.map(item => {
    // 确保 item 是对象
    if (typeof item !== 'object' || item === null) return {};

    return keyAndNames.reduce((acc, { key, name }) => {
      if (typeof key === 'function') {
        acc[name] = key(item) ?? null;
      } else {
        acc[name] = getNestedValue(item, key) ?? null;
      }
      return acc;
    }, {});
  });

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(filteredData)

  // 根据 keyAndNames 设置每列宽度
  ws['!cols'] = keyAndNames.map(({ width }) => ({
    wch: width ?? 25
  }));

  XLSX.utils.book_append_sheet(wb, ws, fileName)
  const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

  // 保存并打开
  Taro.getFileSystemManager().writeFile({
    filePath,
    data: base64,
    encoding: 'base64',
    success: () => Taro.openDocument({ 
      filePath,
      fileType: 'xlsx',
      showMenu: true
    }),
    fail: (e) => {
      console.log(e)
      Taro.showToast({ title: '导出失败', icon: 'error' })
    }
  });
}