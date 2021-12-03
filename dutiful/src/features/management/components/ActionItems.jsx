import { ButtonGroup } from '@material-ui/core';
import { Button } from 'components/button';

export const ActionItems = (item) => (
  <ButtonGroup variant="outlined" size="small">
    <Button onClick={() => console.log(item)}>Edit</Button>
    <Button onClick={() => console.log(item.value)}>Delete</Button>
  </ButtonGroup>
);
