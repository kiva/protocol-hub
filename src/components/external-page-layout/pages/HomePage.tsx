/* eslint-disable jsx-a11y/anchor-is-valid */

import React, {FunctionComponent} from "react";
import "./HomePage.scss";
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {appConfig} from '../../../config/config';
import FullPageModal from "../FullPageModal";
import {store} from "../../../index";
import Listen from "../../../utils/Listen";
import _ from "lodash";

type AppOption =
{
  icon: string;
  title: string;
  subTitle: string;
  url?: string,
  route?: string,
}

const HomePage: FunctionComponent<RouteComponentProps> = ({history}) => {
  const [modalBodyContent, setModalBodyContent] = React.useState<any>("");
  const [modalOpen, setModalOpen] = React.useState<any>(false);


  const pollOpenedWindow = (w: Window | null, tgt: string) => {
    w?.postMessage("are you set?", tgt);
  }

  const goToRegistry = () => {
    history.push("/registry");
  };


  const openAndSendMessage = (target: string) => {
    // React apps append /app to their URLs - we need to do the same in order to persist a handler
    const iframeRef = React.createRef<HTMLIFrameElement>();
    const iframe = () => {
      return (
        <iframe
          id="iframe"
          allow="camera"
          title="Action Workflow Modal"
          onLoad={handleIframeOnload}
          ref={iframeRef}
          className="action-workflow-iframe"
          src={target + '/app'}>
        </iframe>
      )
    }
    const pollOpenedWindow = (w: any | null, tgt: string) => {
      w?.postMessage("are you set?", tgt);
    }
    const handleIframeOnload = () => {
      if (iframeRef.current) {
        iframeRef.current.style.height = iframeRef.current.style.height + 'px' || '1000px'
        const w = iframeRef.current.contentWindow;
        // Set an interval for polling
        let poll: any = setInterval(() => {
          pollOpenedWindow(w, target);
        }, 1000);
  
        // Setting up a listener for a response from the opened window
        // If the data satisfies our requirements, we clear the "poll" interval
        Listen(window, "message", e => {
          console.log(e);
          if (e.data.allSet) {
            clearInterval(poll);
            w!.postMessage({
              token: store.getState().session.token
            }, target);
          }
        });
  
        // The listener's set up? Let's send our first postMessage
        pollOpenedWindow(w, target);
      }
    }
    setModalBodyContent(iframe);
    setModalOpen(true);
  }

  const createHubOption = (option: AppOption) => {
    const imageUrl = "/images/" + option.icon;
    return <>
      <a className="app-link"
         onClick={handleOptionClick(option)}>
        <img src={imageUrl} />
        <span className="title">{option.title}</span>
        <span className="description">{option.subTitle}</span>
      </a>
    </>
  }
  const renderModal = () => {
    if (modalOpen) {
      return (<FullPageModal
        modalAnchorEl="home-page"
        body={modalBodyContent}
      ></FullPageModal>)
    }
    return
  }

  const handleOptionClick = (option: AppOption) => () => {
    if(option.route) {
      history.push("/registry");
    } else if(option.url) {
      if (store.getState().session.token) {
        openAndSendMessage(option.url);
      } else {
        alert("No authentication token was detected within your session.\nPlease disable popups for this site and try logging in again.");
      }
    }
  }
  const hubOptions = _.map(appConfig.actions, createHubOption);
  return (
    <div className="home-page">
      {hubOptions}
      {renderModal()}
      <a className="app-link" onClick={goToRegistry}>
        <span className="title">Registry</span>
        <span className="description">Manage the list of individuals.</span>
      </a>
      <div className="app-link"
         onClick={()=> {
           handleOpen(CONSTANTS.externalUrls.issuer);
         }}>
        <span className="title">Issue Credentials</span>
        <span className="description">Register individuals</span>
      </div>
      <div className="app-link"
         onClick={()=> {
           handleOpen(CONSTANTS.externalUrls.verifier);
         }}>
        <span className="title">Verify</span>
        <span className="description">Verify the individual’s credentials</span>
      </div>
    </div>
  );
}

export default withRouter(HomePage);
