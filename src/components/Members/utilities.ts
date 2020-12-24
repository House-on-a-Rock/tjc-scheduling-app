import { MemberStateData } from '../../store/types';

export function updateSelectedRows(start: number, end: number, data: MemberStateData[]) {
  let newRows: number[] = [];
  let startPushing: boolean = false;
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
