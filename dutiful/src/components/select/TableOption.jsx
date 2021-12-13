export const TableOption = ({ item, onClick, component }) => {
  function handleClick() {
    onClick(item.value);
  }

  const Component = component;

  if (Component) return <Component onClick={handleClick} label={item.value}></Component>;
  return (
    <li onClick={handleClick} value={item.value}>
      {item.value}
    </li>
  );
};
