export interface Constants {
    controllerUrlBase: string,
    externalUrls: ExternalUrls,
    authorizationMethod: string
}

interface ExternalUrls {
    issuer: string,
    verifier: string
}

export interface MessageMap {
    [index: string]: string
}