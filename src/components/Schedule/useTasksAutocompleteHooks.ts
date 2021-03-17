import React, { useState, useEffect } from 'react';

interface TasksAutocompleteHooksProps {
  dataId: number;
  roleId: number;
  dataSet: any;
}

export const useTasksAutocompleteHooks = (dataId, roleId, dataSet) => {
  const [initialData] = useState({
    dataId,
    roleId,
    dataSet,
  });
  const [isCellModified, setIsCellModified] = useState<boolean>(false);
  const [isCellWarning, setIsCellWarning] = useState<boolean>(false);

  const [managedDataSet, setManagedDataSet] = useState(dataSet);
  const [prevRole, setPrevRole] = useState<number>(roleId);
  const [prevDetails, setPrevDetails] = useState(createDetails()); //stores info of prev selected

  const [isRolesChanged, setIsRolesChanged] = useState(false);
  const [isDataSetChanged, setIsDataSetChanged] = useState(false);

  useEffect(() => {
    if (roleId !== prevRole) setIsRolesChanged(true);
    if (roleId === initialData.roleId) setIsRolesChanged(false);
  }, [roleId]);

  useEffect(() => {
    if (dataId !== initialData.dataId) {
      setIsCellModified(true);
      setIsCellWarning(false);
      setPrevDetails(createDetails());
      if (isRolesChanged) setIsDataSetChanged(false);
    } else {
      setIsCellModified(false);
      setIsCellWarning(false);
      setIsDataSetChanged(false);
    }
  }, [dataId]);

  useEffect(() => {
    if (isRolesChanged) {
      setIsCellWarning(true);
      setPrevRole(roleId);
      setIsDataSetChanged(true);
    } else {
      if (dataId !== initialData.dataId) {
        setManagedDataSet(createDataSet());
        setIsCellWarning(true);
      } else setIsDataSetChanged(false);
    }
  }, [isRolesChanged]);

  useEffect(() => {
    if (isDataSetChanged) {
      setManagedDataSet(createDataSet());
    } else {
      setManagedDataSet(dataSet);
      setIsCellWarning(false);
    }
  }, [isDataSetChanged]);

  return [isCellModified, isCellWarning, managedDataSet, initialData];

  function createDataSet() {
    const managedDataClone = [...dataSet];
    managedDataClone.unshift(prevDetails);
    return managedDataClone;
  }

  function createDetails() {
    return dataSet.filter((user) => user.userId === dataId)[0];
  }
};
