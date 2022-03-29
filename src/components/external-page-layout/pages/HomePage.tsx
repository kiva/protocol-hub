/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { FunctionComponent, useState, createRef } from "react";
import "./HomePage.scss";
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {CONSTANTS} from '../../../constants/constants';
import FullPageModal from "../FullPageModal";
import {store} from "../../../index";
import Listen from "../../../utils/Listen";
import _ from "lodash";

export type AppOption =
  {
    icon: string;
    title: string;
    subTitle: string;
    url?: string,
    route?: string,
  }

const HomePage: FunctionComponent<RouteComponentProps> = ({history}) => {
  const [modalBodyContent, setModalBodyContent] = useState<any>("");
  const [modalOpen, setModalOpen] = useState<any>(false);

  const openAndSendMessage = (target: string) => {
    // React apps append /app to their URLs - we need to do the same in order to persist a handler
    const iframeRef = createRef<HTMLIFrameElement>();
    const iframe = () => {
      return (
        <iframe
          id="iframe"
          allow="camera"
          title="Action Workflow Modal"
          onLoad={handleIframeOnload}
          ref={iframeRef}
          className="action-workflow-iframe"
          src={target}>
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
      <a data-testid={option.title.toLowerCase().split(' ').join('_')}
         key={option.title}
         className="app-link"
         onClick={handleOptionClick(option)}>
        <img src={imageUrl} alt=""/>
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
        openState={[modalOpen, setModalOpen]}
      ></FullPageModal>)
    }
    return
  }

  const handleOptionClick = (option: AppOption) => () => {
    if (option.route) {
      switch (option.route) {
        case "/registry":
          history.push("/registry");
          break;
        case "/transactionHistory":
          history.push("/transactionHistory");
          break;
      }
    } else if (option.url) {
      if (store.getState().session.token) {
        openAndSendMessage(option.url);
      } else {
        alert("No authentication token was detected within your session.\nPlease disable popup blocking for this site and try logging in again.");
      }
    }
  }
  const hubOptions = _.map(CONSTANTS.actions, createHubOption);
  return (
    <div className="home-page">
      {hubOptions}
      {renderModal()}
    </div>
  );
}

export default withRouter(HomePage);
