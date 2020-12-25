import { MemberStateData } from '../../shared/types';

export function updateSelectedRows(start: number, end: number, data: MemberStateData[]) {
  const newRows: number[] = [];
  let startPushing = false;
  const vectoredData: MemberStateData[] = start < end ? data : data.reverse();

  for (let i = 0; i < vectoredData.length; i++) {
    if (startPushing) {
      newRows.push(vectoredData[i].userId);
      if (vectoredData[i].userId === end) break;
    }
    if (vectoredData[i].userId === start) startPushing = true;
  }
  return newRows;
}
