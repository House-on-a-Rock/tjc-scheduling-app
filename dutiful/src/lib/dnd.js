import { useState, createContext, useContext } from 'react';

import { DragDropContext } from 'react-beautiful-dnd';

const DndContext = createContext();

// TODO change from useContext -> useReducer
// - rationale
// 1. there can easily be many state changes, this will rerender everythine
// 2. callbacks are possibly being rerendered on every state change (use useCallback)

const DndProvider = ({ children, initialState, reorderable }) => {
  const [state, setState] = useState(initialState);

  function bootstrapState(payload) {
    setState({ ...state, ...payload });
  }

  function onDragEnd(result) {
    const { source, destination } = result;
    console.log({ source, destination, state });

    // if dropped outside the list
    if (!destination) return;

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

  return (
    <DndContext.Provider value={{ state, bootstrapState }}>
      <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>
    </DndContext.Provider>
  );
};

const useDnd = () => {
  const context = useContext(DndContext);
  if (!context)
    throw new Error('Dnd context can only be accessed within a Dnd Context Provider');
  return context;
};

const useDndProps = () => {
  const [initialState, setInitialState] = useState([]);

  return [initialState];
};

export { useDnd, DndProvider, useDndProps };

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
