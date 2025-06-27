import Taro from '@tarojs/taro';
import * as XLSX from 'xlsx';

export const createXlsxFile = (params: { data: any[], fileName: string, keyAndNames: any[] }) => {
  const { data, fileName, keyAndNames } = params

  const filePath = Taro.env.USER_DATA_PATH + '/'+ fileName;

  const fieldMappings = Object.fromEntries(
    keyAndNames?.map(({ key, name }) => [key, name]) || []
  );

  const filteredData = data?.map(item => {
    // 确保 item 是对象
    if (typeof item !== 'object' || item === null) return {};

    return Object.entries(fieldMappings).reduce((acc, [srcKey, targetKey]) => {
      // 安全访问属性
      acc[targetKey as string] = (item as Record<string, any>)[srcKey] ?? null; // 空值处理
      return acc;
    }, {});
  });

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(filteredData)

  const colWidth = 25;
  ws['!cols'] = filteredData 
    ? Object.keys(filteredData).map(() => ({ wch: colWidth }))
    : [];

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