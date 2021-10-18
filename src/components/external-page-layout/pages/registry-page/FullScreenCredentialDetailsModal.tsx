import React, {FunctionComponent, useEffect, useCallback} from 'react';
import I18n from "utils/I18n";
import {CONSTANTS} from 'constants/constants';
import {store} from "index";
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import CloseIcon from '@material-ui/icons/Close';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import axios from 'axios';
import {Grid, TextField, Button} from "@material-ui/core";
import _ from "lodash";
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import './FullScreenCredentialDetailsModal.scss';

export interface PIImap {
  [index: string]: PIIdefinition
}

interface PIIdefinition {
  name: string,
  dataType?: string,
}

const PII: PIImap =  {
  "id": {
    "name": "Credential ID",
    "dataType": "text"
  },
  "firstName": {
    "name": "First Name",
    "dataType": "text"
  },
  "lastName": {
    "name": "Last Name",
    "dataType": "text"
  },
  "companyEmail": {
    "name": "Company Email",
    "dataType": "text"
  },
  "currentTitle": {
    "name": "Current Title",
    "dataType": "text"
  },
  "team": {
    "name": "Team",
    "dataType": "text"
  },
  "hireDate": {
    "name": "Hire Date",
    "dataType": "date"
  },
  "officeLocation": {
    "name": "Office Location",
    "dataType": "text"
  },
  "phoneNumber": {
    "name": "Phone Number",
    "dataType": "text"
  },
  "type": {
    "name": "Type",
    "dataType": "text"
  },
  "endDate": {
    "name": "End Date",
    "dataType": "date"
  },
  "createdAt": {
    "name": "Created At",
    "dataType": "text"
  }
};

interface ModalContentProps {
  credentialData: any,
  loading: any,
  setLoading: any
}

const ModalContent: FunctionComponent<ModalContentProps> = (props) => {
  const [credentialStatus, setCredentialStatus] = React.useState<any>("-");
  const [credentialStatusLoading, setCredentialStatusLoading] = React.useState(true);
  const token = store.getState().session.token;
  let axiosConfig: any;
  let axiosInstance: any;
  if (token) {
    const config: any = {
      baseURL: CONSTANTS.controllerUrlBase,
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
    axiosConfig = config;
    axiosInstance = axios.create(axiosConfig);
  }

  const fetchCredentialStatus = useCallback(async() => {
    setCredentialStatusLoading(true);
    if (token) {
      const id = props.credentialData.getValue('id');
      const status = props.credentialData.getValue('status');
      try {
        const revokeStatus = await axiosInstance.get(`/v2/kiva/api/revoke/state/${id}`);
        setCredentialStatusLoading(false);
        if (revokeStatus.data.state === 'revoked') {
          return 'Revoked';
        } else {
          return status;
        }
      } catch (error) {
        return `${status} (Revocation status failed to return)`;
      }
    }
  }, [axiosInstance, props.credentialData, token]);


  const revokeCredential = async (event:any) => {
    props.setLoading(true);
    if (token) {
      try {
        const revokeRes = await axiosInstance.post('/v2/kiva/api/revoke', {
          "credential_exchange_id": event.currentTarget.id,
          "publish": true
        });
        props.setLoading(false);
        fetchCredentialStatus();
        return revokeRes;
      } catch (error) {
        props.setLoading(false);
        return error;
      }
    }
  }

  const getCredentialPhoto = () => {
    try {
      let image = JSON.parse(
        String(
          props.credentialData.getValue('photo~attach')
        )
      );
      image = `data:${image.type};${image.encoding}, ${image.data}`;
      return <img width="200px" alt="credential face shot" src={image}></img>
    } catch {
      return (
        <div>
          {I18n.getKey('photoFailedToRender')}
        </div>
      );
    }
  }

  const renderModalContent = () => {
    return (
      <Grid
          container
          justify="center"
        >
          <Grid item xs={12}>
            <DialogTitle>
              {I18n.getKey('credentialDetails')}
            </DialogTitle>
          </Grid>
          <DialogContent>
            <Grid
              container
            >
              <Grid item sm={3} xs={3}>
                { getCredentialPhoto() }
                <div className="actions-bar">
                    <Button
                      disabled={credentialStatus === 'Revoked' || credentialStatusLoading}
                      className="primary-button"
                      onClick={revokeCredential}
                      id={props.credentialData.data['id']}
                    >
                      {I18n.getKey('revoke')}
                    </Button>
                </div>
              </Grid>
              <Grid item sm={6} xs={6}>
                <Grid
                  container
                  alignItems="center"
                >
                  { _.keys(PII).map((key, index) => {
                    return (
                      <Grid key={key} item sm={6} xs={6}>
                        <TextField
                          className="registry-page-field"
                          label={PII[key].name}
                          value={ props.credentialData.data[key] }
                          InputProps={{
                            disableUnderline: true,
                            readOnly: true,
                            fullWidth: true
                          }}
                        />
                      </Grid>
                    );
                    })
                  }
                  <Grid item key='status' sm={6} xs={6}>
                    <TextField
                      className="registry-page-field"
                      label='Status'
                      value={credentialStatus}
                      InputProps={{
                        disableUnderline: true,
                        readOnly: true,
                        fullWidth: true
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </Grid>
    );
  }

  useEffect( () => {
    if (credentialStatusLoading) {
      const fetchStatus = async() => {
        let response = props.credentialData.data.status;
        if (response === "Issued") {
          response = await fetchCredentialStatus();
        }
        setCredentialStatus(response);
      }
      fetchStatus();
    }
  }, [credentialStatusLoading, setCredentialStatusLoading, props.credentialData.data.status, fetchCredentialStatus]);
  return renderModalContent();
}

interface Props {
  modalAnchorEl: any,
  credentialData: any,
  open: any,
  handleClose: any
}

const FullScreenCredentialDetailsModal: FunctionComponent<Props> = React.forwardRef((props, ref) => {
  const [loading, setLoading] = React.useState(false);
 
  const render = () => {
    return renderModal();
  }

  const renderModal = () => {
    return (
      <div>
        <Dialog
          fullScreen
          maxWidth="xl"
          open={props.open}
          onClose={props.handleClose}
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
                    onClick={props.handleClose}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                </Toolbar>
              </Grid>
            </Grid>
          </AppBar>
          <div className="modal-content">
            {loading && <LinearProgress />}
            <ModalContent
              loading={loading}
              setLoading={setLoading}
              credentialData={props.credentialData}
            />
          </div>
        </Dialog>
      </div>
    );
  }

  return render();
});

export default FullScreenCredentialDetailsModal;