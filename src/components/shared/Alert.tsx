import React from 'react';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

function Transition(props: any) {
  return <Slide direction="up" {...props} />;
}

export default function Alert(
  {
    // handleClose,
    // handleSubmit,
    // isOpen,
    // hasTwoButtons = false,
    // submitButtonText,
    // title,
    // text,
  },
) {
  const isOpen = false;
  const title = 'Temporary Title';
  const text = 'Temporary Title';
  const hasTwoButtons = false;
  const submitButtonText = 'submitButtonText';
  return (
    <Dialog
      open={isOpen}
      // transition={Transition}
      keepMounted
      // onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {hasTwoButtons && <Button color="primary">{'CANCEL'}</Button>}
        <Button color="primary">{submitButtonText}</Button>
      </DialogActions>
    </Dialog>
  );
}
