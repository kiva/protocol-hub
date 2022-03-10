import { toParams } from './utils';
import React, { FunctionComponent, createRef } from "react";
import Listen from "../../utils/Listen";
import { store } from "../../index";
import './silentAuthIframe.scss';

interface SilentAuthIframeProps {
  id: string,
  url: string,
  isCrossOrigin?: boolean
  locationKey: string,
  onSuccess: Function,
  onFailure: Function
}

let response: string | null;
const SilentAuthIframe: FunctionComponent<SilentAuthIframeProps> = (props) => {
  let iid: number | null | undefined;
  const iframeRef = createRef<HTMLIFrameElement>();

  const handlePostMessage = (event: any) => {
    if (event.data.message === 'deliverResult') {
      response = event.data.result;
    }
  }

  const poll = () => {
    new Promise((resolve, reject) => {
      const w = iframeRef?.current?.contentWindow;

      iid = window.setInterval(() => {
        try {
          // Cross origin auth flows need to be handled differently
          if (props.isCrossOrigin) {
            if (response) {
              const params = toParams(response);
              resolve(params);
              stopPolling();
            } else {
              w?.postMessage({ message: 'requestResult' }, '*');
              return;
            }
          } else {
            if (w!.location.href === props.url || w!.location.pathname === 'blank') {
              // location unchanged, still polling
              return;
            }
            if (!['search', 'hash'].includes(props.locationKey)) {
              reject(new Error(`Cannot get data from location.${props.locationKey}, check the responseType prop`));
              stopPolling();
              return;
            }

            const locationValue = w!.location;
            const params = toParams(locationValue);
            resolve(params);
            stopPolling();
          }
        } catch (error) {
          const err = error as Error;
          // Log the error to the console but remain silent
          if (err.name === 'SecurityError' && err.message.includes('Blocked a frame with origin')) {
            console.warn('Encountered a cross-origin error, is your authorization URL on a different server? Use the "isCrossOrigin" property, see documentation for details.');
          } else {
            console.error(error);
          }
        }
      }, 500);
    })
    .then((res: any) => {
      props.onSuccess(res);
    }).catch((res: any) => {
      props.onFailure(res);
    })
  }

  const render = () => {
    if (props.isCrossOrigin) {
      window.addEventListener('message', handlePostMessage);
    }
    const iframe = () => {
      return (
        <iframe
          id="iframe"
          title="Silent Auth Iframe"
          onLoad={handleIframeOnload}
          ref={iframeRef}
          className="silent-auth-iframe"
          src={props.url}>
        </iframe>
      )
    }
    return iframe();
  }
  const handleIframeOnload = () => {
      if (iframeRef.current) {
          const w = iframeRef.current.contentWindow;
          Listen(window, "message", e => {
            if (e.data.access_token) {
              w!.postMessage({
                  token: store.getState().session.token
              }, props.url);
            }
          });
      }
  }

  const stopPolling = () => {
    window.removeEventListener('message', handlePostMessage);
    if (iid) {
      window.clearInterval(iid);
      iid = null;
    }
  }

  poll();
  return render();
}

export default SilentAuthIframe;