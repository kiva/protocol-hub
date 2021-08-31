const Listen = (element: any, eventName: string, eventHandler: (e: any) => void): void => {
    if (element.addEventListener) {
        element.addEventListener(eventName, eventHandler, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, eventHandler);
    }
}

export default Listen;
