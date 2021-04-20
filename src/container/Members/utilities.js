// eslint-disable-next-line import/prefer-default-export
export function updateSelectedRows(start, end, data) {
  const newRows = [];
  let startPushing = false;
  const vectoredData = start < end ? data : data.reverse();

  for (let i = 0; i < vectoredData.length; i++) {
    if (startPushing) {
      newRows.push(vectoredData[i].userId);
      if (vectoredData[i].userId === end) break;
    }
    if (vectoredData[i].userId === start) startPushing = true;
  }

  // bug 1- hold the shift button down and continually select items. doesn't work as expected
  // bug 2- this function only works on ordered id
  return newRows;
}
