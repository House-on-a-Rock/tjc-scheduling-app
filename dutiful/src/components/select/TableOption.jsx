export const TableOption = ({ item, onClick }) => {
  function handleClick() {
    onClick(item.value);
  }

  return (
    <li onClick={handleClick} value={item.value}>
      {item.value}
    </li>
  );
};
