import { useState, createContext, useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import _ from 'lodash';

const DndContext = createContext();

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function move({ source, destination, state, config }) {
  const sourceKey = source.droppableId;
  const destKey = destination.droppableId;
  const sourceState = state[sourceKey];
  const destinationState = state[destKey];

  const mold = (prev) => {
    const { template } = config[destKey];
    let curr = {};
    Object.keys(template).forEach((key) => (curr[key] = prev[key] ?? template[key]));
    return curr;
  };
  const sourceClone = Array.from(sourceState);
  const destClone = Array.from(destinationState);
  const removed = sourceClone.splice(source.index, 1)[0];
  config[destKey].fixed
    ? destClone.push(mold(removed))
    : destClone.splice(destination.index, 0, mold(removed));
  const result = {};
  result[source.droppableId] = sourceState;
  result[destination.droppableId] = destClone;

  return result;
}

// TODO change from useContext -> useReducer
// - rationale
// 1. there can easily be many state changes, this will rerender every time
// 2. functions are possibly being rerendered on every state change (use useCallback)

// TODO renamed "fixed" to a better name
const DndProvider = ({ children, initialState }) => {
  const [state, setState] = useState(initialState);
  const [config, setConfig] = useState({});

  function bootstrapConfig(type, payload) {
    setConfig((oldConfig) => {
      let newConfig = { ...oldConfig };
      if (!newConfig[type]) {
        newConfig[type] = payload;
        return newConfig;
      }

      let typeConfig = newConfig[type];
      function updateNestedConfig(key) {
        const newValue = payload[key];
        const newPayload = _.isArray(newValue)
          ? [...typeConfig[key], ...newValue]
          : { ...typeConfig[key], ...newValue };
        newConfig = { ...newConfig, [type]: { ...typeConfig, [key]: newPayload } };
      }
      Object.keys(payload).forEach(updateNestedConfig);
      return newConfig;
    });
  }

  function bootstrapState(payload) {
    setState({ ...state, ...payload });
  }

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;

    const sourceKey = source.droppableId;
    const destKey = destination.droppableId;

    if (sourceKey === destKey) {
      const items = reorder(state[sourceKey], source.index, destination.index);
      const newState = [...state];
      newState[sourceKey] = items;
      setState(newState);
    } else {
      const result = move({ source, destination, state, config });
      const newState = { ...state };
      newState[sourceKey] = result[sourceKey];
      newState[destKey] = result[destKey];
      setState(newState);
    }
  }

  return (
    <DndContext.Provider value={{ state, bootstrapState, bootstrapConfig }}>
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

export { useDnd, DndProvider };
