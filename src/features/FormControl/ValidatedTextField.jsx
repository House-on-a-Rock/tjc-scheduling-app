import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

const ValidatedTextField = ({ label, input, handleChange, ...props }) => (
  <TextField
    variant="outlined"
    margin="normal"
    required
    fullWidth
    id={label}
    label={label}
    name={label}
    value={input.value}
    onChange={(event) => handleChange({ ...input, value: event.target.value })}
    error={!input.valid}
    helperText={input.valid ? '' : input.message}
    {...props}
  />
);

ValidatedTextField.propTypes = {
  label: PropTypes.string,
  input: PropTypes.object,
  handleChange: PropTypes.func,
};

export default ValidatedTextField;
