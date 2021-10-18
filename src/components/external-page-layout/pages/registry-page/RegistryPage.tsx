import React, {FunctionComponent, useEffect, useState} from 'react';
import "./RegistryPage.scss";
import FullScreenCredentialDetailsModal from "./FullScreenCredentialDetailsModal";
import {DataGrid, GridColDef, GridRowData, GridCellParams} from '@material-ui/data-grid';
import {Grid, Typography, Button} from "@material-ui/core";
import _ from "lodash";
import {store} from "index";
import {CONSTANTS} from 'constants/constants';
import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import I18n from "utils/I18n";

export interface PIImap {
  [index: string]: PIIdefinition
}

interface PIIdefinition {
  name: string,
  dataType?: string,
}

export interface StatusMap {
  [index: string]: StatusDefinition
}

interface StatusDefinition {
  displayText: string,
}

// Revocation case to be more adequately defined
const status: StatusMap = {
  "revoked": {
    displayText: "Revoked"
  },
  "offer_sent": {
    displayText: "Offered"
  },
  "offer_received": {
    displayText: "Offered"
  },
  "request_sent": {
    displayText: "Offered"
  },
  "request_received": {
    displayText: "Responded"
  },
  "credential_issued": {
    displayText: "Issued"
  },
  "credential_received": {
    displayText: "Issued"
  },
  "credential_acked": {
    displayText: "Issued"
  }
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

interface Props {

}

const RegistryPage: FunctionComponent<Props> = () => {
  const columns: GridColDef[] = [];
  const [modalAnchorEl, setModalAnchorEl] = React.useState<null | HTMLElement>(null);
  const [rows, setRows] = useState<GridRowData[]>([]);
  const [credentialData, setCredentialData] = useState<GridRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = React.useState(false);

  const tableColumnFields = [
    'firstName',
    'lastName',
    'companyEmail',
    'createdAt',
    'endDate'
  ]
  tableColumnFields.forEach((key, index) => {
    columns.push({
      field: key,
      headerName: PII[key].name,
      flex: 1
    });
  });

  columns.push({
    field: "",
    flex: 1,
    headerName: I18n.getKey('actions'),
    renderCell: (params: GridCellParams) => {
      const handleOpen = (credentialData: any) => {
        setOpen(true);
        setCredentialData(credentialData);
      };

      const openModal = async(event: React.MouseEvent<HTMLButtonElement>) => {
        setModalAnchorEl(event.currentTarget);
        handleOpen(params);
      };

      return (
          <Button className="action-link" onClick={openModal}>
            Details
          </Button>
      );
    }
  });

  const getPIIDisplayString: any = (key:string, val:string) => {
    try {
      let piiString = val;
      if (PII[key] && PII[key].dataType === "date") {
        piiString = new Date(Number(val)*1000).toLocaleDateString(
          'en-gb',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }
        );
      }
      return piiString;
    } catch {
      return I18n.getKey('noData');
    }
  }

  useEffect( () => {
    if(loading) {
      store.subscribe(async () => {
        const token = store.getState().session.token;
        if(token) {
          const config: any = {
            baseURL: CONSTANTS.controllerUrlBase,
            headers: {
                "Authorization": `Bearer ${token}`
            }
          };
          const axiosConfig: AxiosRequestConfig = config;
          const axiosInstance: AxiosInstance = axios.create(axiosConfig);
          const records: any = await axiosInstance.get('/v2/kiva/api/records');
          let mappedData = _.map(records.data, (row) => {
            const entityData = row.entityData;
            _.each(entityData, (val, key) => {
              return entityData[key] = getPIIDisplayString(key, val);
            })
            return {
              id: row.credential_exchange_id,
              firstName: entityData.firstName,
              lastName: entityData.lastName,
              companyEmail: entityData.companyEmail,
              currentTitle: entityData.currentTitle,
              team: entityData.team,
              hireDate: entityData.hireDate,
              officeLocation: entityData.officeLocation,
              phoneNumber: entityData.phoneNumber,
              "photo~attach": entityData["photo~attach"],
              type: entityData.type,
              endDate: entityData.endDate,
              createdAt: row.created_at,
              status: status[row.state].displayText || row.state.replace("_", " ")            }
          });
          const data: GridRowData[] = mappedData;
          setRows(data);
          setLoading(false);
        }
      });
    }
  }, [loading, setLoading]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="registration-page">
      <Grid container
        justifyContent="space-between">
        <Typography component="h2"
          variant="h4">{I18n.getKey("registrationEntries")}</Typography>
      </Grid>
      <DataGrid
        className="registration-table"
        rows={rows}
        columns={columns}
        pageSize={5}
        loading={loading}
      />
      <FullScreenCredentialDetailsModal
        modalAnchorEl={modalAnchorEl}
        open={open}
        handleClose={handleClose}
        credentialData={credentialData}
      />
    </div>
  );
};

export default RegistryPage;