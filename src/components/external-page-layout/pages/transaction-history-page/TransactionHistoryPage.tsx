import React, {FunctionComponent} from 'react';
import "./TransactionHistoryPage.scss";
import axios from 'axios';
import {store} from "index";
import I18n from "utils/I18n";
import { DataGridPro, GridOverlay } from '@mui/x-data-grid-pro';
import _ from "lodash";
import LinearProgress from '@mui/material/LinearProgress';
import {Grid, Typography} from "@material-ui/core";

interface Props {

}

export interface TransactionTableData {
  [index: string]: TransactionTableDataDefinition
}

interface TransactionTableDataDefinition {
  name: string,
  dataType?: string,
}

const TxnTableData: TransactionTableData = {
  "id": {
    "name": "Credential ID",
    "dataType": "text"
  },
  "type": {
    "name": "Type",
    "dataType": "text"
  },
  "txDate": {
    "name": "Date",
    "dataType": "date"
  }
}

const TransactionHistoryPage: FunctionComponent<Props> = () => {
  const token = store.getState().session.token;
  let axiosConfigFsp: any;
  let axiosInstanceFsp: any;
  let axiosConfigTro: any;
  let axiosInstanceTro: any;
  if (token) {
    const configFsp: any = {
      baseURL: 'http://localhost:3013'
    }
    const configTro: any = {
      baseURL: 'http://localhost:3010'
    }
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*"
    }
    configFsp.headers = configTro.headers = headers;
    axiosConfigFsp = configFsp;
    axiosInstanceFsp = axios.create(axiosConfigFsp);
    axiosConfigTro = configTro;
    axiosInstanceTro = axios.create(axiosConfigTro);
  }

  const register:any = async () => {
    if (token) {
      try {
        const registerRes = await axiosInstanceFsp.post(`/v2/transaction/register`, 
        {
          "tdcPrefix": "postman",
          "tdcEndpoint": "http://tdc-controller:3015"
        });
        const connectionId = registerRes.data.connectionData.connection_id;
        return connectionId;
      } catch (error) {
        return error;
      }
    }
  }

  const onetimekey:any = async (connectionId: any) => {
    if (token) {
      try {
        await axiosInstanceFsp.post(`/v2/transaction/nonce`, 
        {
          "connectionId": connectionId,
          "oneTimeKey": "oneTimeValue",
          "tdcEndpoint": "http://tdc-controller:3015"
        });
        return startTro();
      } catch (error) {
        return error;
      }
    }
  }

  const startTro:any = async () => {
    if (token) {
      try {
        const startTroRes = await axiosInstanceTro.post(`/v1/manager`, 
        {
          "agentId": "citizen",
          "walletId": "walletId11",
          "walletKey": "walletId11",
          "adminApiKey": "adminApiKey",
          "seed": "000000000000000000000000Steward1",
          "did": "XTv4YCzYj8jqZgL1wVMGGL"
        });
        return startTroRes.data.agentId;
      } catch (error) {
        return error;
      }
    }
  }

  const connectToTdc:any = async (agentId:any) => {
    if (token) {
      try {
        const connectToTdcRes = await axiosInstanceTro.post(`/v2/transaction/${agentId}/register`, 
        {
          "tdcPrefix": "postman",
          "tdcEndpoint": "http://tdc-controller:3015"
        });
        return connectToTdcRes.data.connectionData.connection_id;
      } catch (error) {
        return error;
      }
    }
  }

  const registerOneTimeKey:any = async (connectionId:any, agentId:any) => {
    if (token) {
      try {
        await axiosInstanceTro.post(`/v2/transaction/${agentId}/registerOnetimeKey`, 
        {
          "connectionId": connectionId,
          "tdcEndpoint": "http://tdc-controller:3015",
          "oneTimeKey": "oneTimeValue"
        });
        return;
      } catch (error) {
        return error;
      }
    }
  }

  const refreshOneTimeValue:any = async (connectionId:any, agentId:any) => {
    if (token) {
      try {
        const refreshOneTimeValueRes = await axiosInstanceFsp.get(`/v2/transaction/ids/oneTimeValue`);
        return {
          key: refreshOneTimeValueRes.data.key,
          fspId: refreshOneTimeValueRes.data.tdcFspId,
          troId: refreshOneTimeValueRes.data.tdcTroId,
        };
      } catch (error) {
        return error;
      }
    }
  }

  const refreshStatusOneTimeKey:any = async (key:any, agentId:any) => {
    if (token) {
      try {
        const refreshStatusOneTimeKeyRes = await axiosInstanceTro.get(`/v2/transactions/${agentId}/ids/${key}`);
        return refreshStatusOneTimeKeyRes;
      } catch (error) {
        return error;
      }
    }
  }

  const createTxn:any = async (fspId:any) => {
    if (token) {
      try {
        const createTxnRes = await axiosInstanceFsp.post(`/v2/transaction/create`,
        {
          "fspId": fspId,
          "tdcEndpoint": "http://tdc-controller:3015",
          "typeId": "loan",
          "subjectId": "payment",
          "fspHash": "null",
          "date": "1/1/2021 11:00 AM",
          "amount": "123.00",
          "eventJson": "null"
        });
        return createTxnRes.data.transactionId;
      } catch (error) {
        return error;
      }
    }
  }

  const requestReport:any = async (fspId:any, tdcId:any) => {
    if (token) {
      try {
        const requestReportRes = await axiosInstanceFsp.post(`/v2/transaction/report`,
        {
          "fspTdcId": fspId,
          "tdcEndpoint": "http://tdc-controller:3015",
          "troTdcId": tdcId
        });
        return requestReportRes;
      } catch (error) {
        return error;
      }
    }
  }

  const reportResult:any = async (reportId:any) => {
    if (token) {
      try {
        const reportResultRes = await axiosInstanceFsp.get(`/v2/transaction/report/${reportId}/status`);
        return reportResultRes;
      } catch (error) {
        return error;
      }
    }
  }

  const getTxnTableDisplayString: any = (key:string, val:string) => {
    try {
      let piiString = val;
      if (TxnTableData[key] && TxnTableData[key].dataType === "date") {
        piiString = new Date(val).toLocaleDateString();
      }
      return piiString;
    } catch {
      return I18n.getKey('noData');
    }
  }

  const MAX_ROW_LENGTH = 500;

  const CustomLoadingOverlay = function () {
    return (
      <GridOverlay>
        <div style={{ position: 'absolute', top: 0, width: '100%' }}>
          <LinearProgress />
        </div>
      </GridOverlay>
    );
  }

  const [loading, setLoading] = React.useState(false);
  const [loadedRows, setLoadedRows] = React.useState([]);
  const mounted = React.useRef(true);
  const data = {
    columns: [{
      field: 'id',
      headerName: "ID",
      hide: true
    },
    {
      field: 'type',
      headerName: "Type",
      width: 110
    },
    {
      field: 'txDate',
      headerName: "Date",
      width: 200
    },
    {
      field: 'amount',
      headerName: "Amount",
      width: 200
    },
    {
      field: 'subject',
      headerName: "Subject",
      width: 200
    }],
    rows: []
  }

  const loadServerRows = async (newRowLength: any) => {
    setLoading(true);
    
    let fspConnectionId: any = await register();
    await onetimekey(fspConnectionId);
    const agentId = await startTro();
    const connectionId = await connectToTdc(agentId);
    await registerOneTimeKey(connectionId, agentId);
    const { key, fspId, troId } = await refreshOneTimeValue(connectionId, agentId);
    await refreshStatusOneTimeKey(key, agentId);
    await createTxn(fspId);
    const report = await requestReport(fspId, troId);
    let reportData:any = {};
    let newData:any = {
      rows: []
    };
    let pollReport: any = setInterval(async() => {
      const reportRes = await reportResult(report.data.reportId);
      if (reportRes && reportRes.data && reportRes.data.state === "completed") {
        reportData = JSON.parse(reportRes.data.content);
        reportData = _.map(reportData, report => {
          const newReport: any = {};
          _.each(report, (val, key) => {
            newReport[key] = getTxnTableDisplayString(key, val);
          });
          return newReport;
        });
        newData.rows = _.map(reportData, (row:any, idx) => {
          return {
              id: idx,
              type: row.typeId,
              txDate: row.txDate,
              amount: row.amount,
              subject: row.subjectId
          }
      })

        if (mounted.current) {
          setLoading(false);
          setLoadedRows(loadedRows.concat(newData.rows));
        }
        clearInterval(pollReport);
      }
    }, 1000);
  };

  const handleOnRowsScrollEnd = (params: any) => {
    if (loadedRows.length <= MAX_ROW_LENGTH) {
      loadServerRows(params.viewportPageSize);
    }
  };

  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <div className="txn-history-page">
      <Grid container
        justifyContent="space-between">
        <Typography component="h2"
          variant="h4">{I18n.getKey("transactionHistory")}</Typography>
      </Grid>
      <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        className="txn-table"
        {...data}
        rows={data.rows.concat(loadedRows)}
        loading={loading}
        hideFooterPagination
        onRowsScrollEnd={handleOnRowsScrollEnd}
        components={{
          LoadingOverlay: CustomLoadingOverlay,
        }}
      />
    </div>
    </div>
    
  );
}

export default TransactionHistoryPage;