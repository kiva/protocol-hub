import React, {FunctionComponent} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { Button, DialogActions } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import I18n from "utils/I18n";
import './ConfirmModal.scss';

interface ModalContentProps {
  modalContent: any,
  response?: any
}

const ModalContent: FunctionComponent<ModalContentProps> = (props) => {
  const renderResponseModalContent = () => {
    const response = props.response;
    let responseModalContent = "";
    let responseModalTitle = "";
    if (response.status === 201 || response.status === 200) {
      responseModalTitle = "Credential was successfully revoked."
    } else {
      try {
        responseModalTitle = response.response.data.code
        responseModalContent = response.response.data.message
      } catch {
        responseModalContent = response.toString();
      }
    }
    
    return (
      <div>
        <DialogTitle>{responseModalTitle}</DialogTitle>
        <DialogContent>{responseModalContent}</DialogContent>
      </div>
    );
  };

  const renderModalContent = () => {
    if (props.response) {
      return renderResponseModalContent();
    }
    return props.modalContent;
  }

  return renderModalContent();
}

interface Props {
  confirmHandler: Function,
  triggerEl: any,
  modalContent: any,
  confirmText?: string,
  cancelText?: string
}

const ConfirmModal: FunctionComponent<Props> = React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false);
  const [actionConfirmed, setActionConfirmed] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState<string | undefined>(props.confirmText || I18n.getKey('ok'));
  const [cancelText, setCancelText] = React.useState<string | undefined>(props.cancelText || I18n.getKey('cancel'));
  const [loading, setLoading] = React.useState(false);
  const [confirmButtonEnabled, setConfirmButtonEnabled] = React.useState(true);
  const [actionResponse, setActionResponse] = React.useState(null);

  const resetModalState = () => {
    setActionConfirmed(false);
    setActionResponse(null);
    setConfirmText(props.confirmText);
    setCancelText(props.cancelText);
  }

  const handleOpen = () => {
    resetModalState();
    setOpen(true);
    return render();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const render = () => {
    return renderModal();
  }

  const handleConfirm = async () => {
    if (!actionConfirmed) {
      setConfirmButtonEnabled(false);
      setLoading(true);
      const result = await props.confirmHandler();
      setActionResponse(result)
      setActionConfirmed(true);
      setConfirmText("OK");
      setConfirmButtonEnabled(true);
      setLoading(false);
    } else {
      handleClose();
    }
  }

  const renderModal = () => {
    return (
      <div>
        <div onClick={handleOpen}>
          {props.triggerEl}
        </div>
        <Dialog
          maxWidth="xl"
          open={open}
          onClose={handleClose}
        >
          <div>
            {loading && <LinearProgress />}
            <ModalContent
              modalContent={props.modalContent}
              response={actionResponse}
            />
            <DialogActions>
              <Button onClick={handleClose} className="secondary-button">
                {cancelText}
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!confirmButtonEnabled}
                id="confirmButton"
                className="primary-button"
              >
                {confirmText}
              </Button>
            </DialogActions>
          </div>
        </Dialog>
      </div>
    );
  }

  return renderModal();
});

export default ConfirmModal;