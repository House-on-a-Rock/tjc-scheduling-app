export const Option = ({ native = false, value, text, children }) => {
  return (
    <option key={value} value={value}>
      {children ?? text}
    </option>
  );
};
