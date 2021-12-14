export const TableOption = ({ value, onClick = null, component, ...props }) => {
  const Component = component;

  function handleClick() {
    onClick(value);
  }

  const customProps = (() => {
    let props = {};
    if (onClick) props.onClick = handleClick;
    return props;
  })();

  if (Component) return <Component {...props} {...customProps} />;
  return (
    <li onClick={handleClick} value={value}>
      {value}
    </li>
  );
};
