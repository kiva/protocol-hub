import React, {FunctionComponent} from 'react';
import {Grid} from "@material-ui/core";
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

interface ModalContentProps {
  title: any,
  body: any
}

const ModalContent: FunctionComponent<ModalContentProps> = (props) => {

  const renderModalContent = () => {
    return (
      <Grid
          container
          justify="center"
        >
          <Grid item xs={12}>
            <DialogTitle>
              {props.title}
            </DialogTitle>
          </Grid>
          <DialogContent>
            {props.body}
          </DialogContent>
      </Grid>
    );
  }

  return renderModalContent();
}

interface Props {
  modalAnchorEl: any,
  title?: any,
  body: any
}

const FullPageModal: FunctionComponent<Props> = React.forwardRef((props, ref) => {
  const [isModalOpen, setModalOpen] = React.useState(true);

  const closeModal = () => {
    setModalOpen(false);
  }

  const render = () => {
    return renderModal();
  }

  const renderModal = () => {
    return (
      <div>
        <Dialog
          fullScreen
          maxWidth="xl"
          open={isModalOpen}
          onClose={closeModal}
        >
          <AppBar>
            <Grid
              container
              justify="flex-end"
              direction="row"
            >
              <Grid item>
                <Toolbar>
                  <IconButton
                    edge="end"
                    className="app-bar"
                    color="inherit"
                    onClick={closeModal}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                </Toolbar>
              </Grid>
            </Grid>
          </AppBar>
          <div className="modal-content">
            <ModalContent
              title={props.title}
              body={props.body}
            />
          </div>
        </Dialog>
      </div>
    );
  }
  return render();
});

export default FullPageModal;