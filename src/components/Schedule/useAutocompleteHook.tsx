import { useState, useEffect, useRef } from 'react';

export const useAutoCompleteHook = (
  dataId,
  dataSet,
  dataContext,
  isSaved,
  extractOptionId,
) => {
  const [managedData, setManagedData] = useState(dataSet);
  const [optionIds, setOptionIds] = useState<number[]>([]);
  const initialData = useRef<initialDataInterface>(null);

  // maybe these 2 can go into the cell itself since its more UI oriented? not sure
  const [isCellModified, setIsCellModified] = useState<boolean>(false);
  const [isCellWarning, setIsCellWarning] = useState<boolean>(false);

  // initializes props into the useState hooks, where its managed better
  useEffect(() => {
    setInitialRefData();
    setOptionIds(extractOptionId(dataSet));
  }, []);

  // when roleId changes (through the role column), this will trigger changes to cell background color and options list
  useEffect(() => {
    if (!doesDataContextMatch()) {
      setIsCellWarning(true);
      if (dataContext.taskId) onRoleChanged(); // only run this for the task cells, not duty cells. can try to decouple this later if needed
    } else setIsCellWarning(false);
  }, [dataContext.roleId]);

  // if isSaved, reset the initialDataRef and background color states
  useEffect(() => {
    if (isSaved) {
      setInitialRefData();
      setIsCellModified(false);
      setIsCellWarning(false);
    }
  }, [isSaved]);

  return [
    managedData,
    optionIds,
    initialData,
    isCellModified,
    setIsCellModified,
    isCellWarning,
    setIsCellWarning,
  ];

  function setInitialRefData() {
    initialData.current = {
      dataId: dataId > 0 ? dataId : dataSet.length - 1,
      dataSet: managedData,
      dataContext,
    };
  }

  function doesDataContextMatch(): boolean {
    return dataContext.roleId === initialData.current.dataContext.roleId;
  }

  function onRoleChanged() {
    const previouslySelected = initialData.current.dataSet.filter(
      (user) => user.userId === initialData.current.dataId,
    )[0]; // maybe just store this inside the ref? idk if the other stuff is really necessary, this can be trimmed later
    const managedDataClone = [...dataSet];
    managedDataClone.unshift(previouslySelected); // adds the prev. selected to the top of the option list
    setManagedData(managedDataClone);
    setOptionIds(extractOptionId(managedDataClone));
  }
};

interface initialDataInterface {
  dataId: number;
  dataSet: any;
  dataContext: any;
}
