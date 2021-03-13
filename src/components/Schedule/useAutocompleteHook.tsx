import { useState, useEffect, useRef } from 'react';

export const useAutoCompleteHook = (
  dataId,
  dataSet,
  dataContext,
  isSaved,
  extractOptionId,
) => {
  //

  const [managedData, setManagedData] = useState(dataSet);
  const [optionIds, setOptionIds] = useState<number[]>(extractOptionId(dataSet));
  const initialData = useRef<initialDataInterface>(setInitialRefData());

  // maybe these 2 can go into the cell itself since its more UI oriented? not sure
  const [isCellModified, setIsCellModified] = useState<boolean>(false);
  const [isCellWarning, setIsCellWarning] = useState<boolean>(false);

  // remove managed data -- selection state managed in parent

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
    return {
      dataId: dataId > 0 ? dataId : dataSet.length - 1, // dataId will be negative if its a newly made task, so this is needed to handle those cases
      dataSet: dataSet,
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
