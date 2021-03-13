import React, { useState, useRef, useEffect } from 'react';

interface TasksAutoCompleteWrapperProps {
  // dbId: number;
  // dbRole: number;
  modelId: number;
  modelRole: number;
  children: any;
  dataSet: any;
  extractOptionId: any;
  // users: any;
  isSaved: boolean;
}

export const TasksAutoCompleteWrapper = (props: TasksAutoCompleteWrapperProps) => {
  const {
    // dbId,
    // dbRole,
    modelId,
    modelRole,
    children,
    dataSet,
    isSaved,
    // users,
  } = props;

  // autocomplete cell props that do not need to be changed
  //    onChange, getOptionLabel, renderOption

  // logic
  // default state
  //    modelId === origId, modelRole === origRole
  //    return normal background color, modelId, unmodifiedDataSet

  // changed role without changing the assignee (filled cell)
  //    modelId === origId, modelRole !== origRole
  //    return red background color, modelId, modifyDataSet
  //    modified dataSet -- append origId and origRole to dataSet so they can still be displayed

  // states
  const [initialData] = useState<InitialDataInterface>(initializeData());
  const [isCellModified, setIsCellModified] = useState<boolean>(false);
  const [isCellWarning, setIsCellWarning] = useState<boolean>(false);

  const [prevRole, setPrevRole] = useState<number>(modelRole);
  const [prevDetails, setPrevDetails] = useState(createDetails());
  const [managedData, setManagedData] = useState(dataSet);

  useEffect(() => {
    if (modelRole !== prevRole) {
      setManagedData(createDataSet());
      setPrevRole(modelRole);
      setPrevDetails(createDetails());
      setIsCellWarning(true);
    }
  }, [modelRole]);

  useEffect(() => {
    if (modelId !== initialData.modelId) {
      setIsCellModified(true);
      setIsCellWarning(false);
    } else {
      setIsCellModified(false);
    }
  }, [modelId]);

  const WrappedAutocomplete = () =>
    React.cloneElement(children, {
      dataId: modelId,
      dataSet: managedData,
      isCellModified,
      isCellWarning,
    });

  return WrappedAutocomplete();

  function initializeData() {
    return {
      modelId,
      modelRole,
      dataSet,
    };
  }

  function createDataSet() {
    const managedDataClone = [...managedData];
    managedDataClone.unshift(prevDetails);
    setManagedData(managedDataClone);
  }

  function createDetails() {
    return dataSet.filter((user) => user.userId === modelId);
  }
};

interface InitialDataInterface {
  modelId: number;
  modelRole: number;
  dataSet: any;
  // dataContext: any;
}
