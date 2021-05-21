import React from 'react';
import CustomDialog from './CustomDialog';
import { ValidatedTextField } from '../FormControl';
import { useValidatedField } from '../../hooks';

const NewTemplateForm = () => {
  const [name, setName] = useValidatedField('', 'Please enter a name for this template');
  return (
    <CustomDialog>
      <ValidatedTextField label="Name" input={name} handleChange={setName} />
    </CustomDialog>
  );
};

export default NewTemplateForm;
