import { useState, useEffect } from 'react';
import _ from 'lodash';

export const useDnd = (initialState, handleState) => {
  const [state, setState] = useState(initialState);

  const reorder = (list, startIndex, endestIdex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endestIdex, 0, removed);

    return result;
  };

  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  function onDragEnd(result) {
    const { source, destination } = result;
    // if dropped outside the list
    if (!destination) return;

    console.log({ source, destination });

    const sourceId = +source.droppableId;
    const destId = +destination.droppableId;

    // if (sourceId === destId) {
    //   const items = reorder(state[sourceId], source.index, destination.index);
    //   const newState = [...state];
    //   newState[sourceId] = items;
    //   setState(newState);
    // } else {
    //   const result = move(state[sourceId], state[destId], source, destination);
    //   const newState = [...state];
    //   newState[sourceId] = result[sourceId];
    //   newState[destId] = result[destId];

    //   setState(newState.filter((group) => group.length));
    // }
  }

  // useEffect(() => !_.isEmpty(initialState) && setState(initialState), [initialState]);
  useEffect(() => console.log({ initialState }));

  return [state, onDragEnd];
};
