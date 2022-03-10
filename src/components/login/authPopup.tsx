import React, { FunctionComponent } from "react";
import { toParams, toQuery } from './utils';

interface AuthPopupProps {
  id: string,
  url: string,
  isCrossOrigin?: boolean,
  locationKey: string,
  onSuccess: Function,
  onFailure: Function
}

const AuthPopup: FunctionComponent<AuthPopupProps> = (props) => {
  let iid: number | null | undefined = null;
  let popupWindow: any;
  let response: string | null = null;
  const render = () => {
    return (
      <div>
      </div>
    );
  }

  const close = () => {
    cancel();
    popupWindow.close();
    window.removeEventListener('message', handlePostMessage);
  }

  const poll = () => {
    new Promise((resolve, reject) => {
      iid = window.setInterval(() => {
        try {
          const popup = popupWindow;

          if (!popup || popup.closed !== false) {
            close();

            reject(new Error('The popup was closed for an unexpected reason'));

            return;
          }

          // Cross origin auth flows need to be handled differently
          if (props.isCrossOrigin) {
            if (response) {
              const params = toParams(response);
              resolve(params);
              close();
            } else {
              popup.postMessage({ message: 'requestResult' }, '*');
              return;
            }
          } else {
            if (popup.location.href === props.url || popup.location.pathname === 'blank') {
              // location unchanged, still polling
              return;
            }
            if (!['search', 'hash'].includes(props.locationKey)) {
              reject(new Error(`Cannot get data from location.${props.locationKey}, check the responseType prop`));
              close();
              return;
            }

            const location = popup.location as any;
            const locationValue = location[props.locationKey];
            const params = toParams(locationValue);
            resolve(params);
            close();
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

  const handlePostMessage = (event: any) => {
    if (event.data.message === 'deliverResult') {
      response = event.data.result;
    }
  }


  const cancel = () => {
    if (iid) {
      window.clearInterval(iid);
      iid = null;
    }
  }

  const open = () => {
    const width = 680;
    const height = 680;
    const left = window.screenX + ((window.outerWidth - width) / 2);
    const top = window.screenY + ((window.outerHeight - height) / 2.5);
    if (props.isCrossOrigin) {
      window.addEventListener('message', handlePostMessage);
    }
    popupWindow = window.open(props.url, props.id, toQuery({
      height, width, top, left,
    }, ','));
  }

  open();
  poll();
  return render();
}

export default AuthPopup;