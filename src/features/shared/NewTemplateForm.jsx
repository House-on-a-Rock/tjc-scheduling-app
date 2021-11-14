/* eslint-disable prettier/prettier */

import PropTypes from 'prop-types';
import CustomDialog from './CustomDialog';
import { ValidatedTextField } from '../FormControl';
import { useValidatedField } from '../../hooks';
import { stringLengthCheck } from '../../shared/utilities';
import TemplateDisplay from '../Template/TemplateDisplay';

const NewTemplateForm = ({ open, handleClose, handleClick, error, template }) => {
  const [templateName, setTemplateName, setTemplateNameError, resetTemplateNameError] =
    useValidatedField('', 'Please enter a name for this template');

  const dialogConfig = {
    title: 'Save template',
    description:
      'Save the current services, events, and times as a template for future use. Task assignments will not be saved. Templates can be managed under the templates tab',
    handleClose: onClose,
    handleSubmit: (event) => onSubmitHandler(event),
  };

  return (
    <CustomDialog open={open} {...dialogConfig}>
      <div style={{ color: 'red' }}>{error?.response.data.message}</div>
      <ValidatedTextField
        label="Name"
        input={templateName}
        handleChange={setTemplateName}
        autoFocus
      />
      <TemplateDisplay template={template} />
    </CustomDialog>
  );

  function onSubmitHandler(event) {
    event.preventDefault();
    resetTemplateNameError();
    if (templateName.value.length > 0) handleClick(templateName.value);
    setTemplateNameError(stringLengthCheck(templateName.value));
  }

  function onClose() {
    resetTemplateNameError();
    setTemplateName('');
    handleClose();
  }
};

NewTemplateForm.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleClick: PropTypes.func,
  error: PropTypes.object,
  template: PropTypes.array,
};

export default NewTemplateForm;
