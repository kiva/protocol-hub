export interface Constants {
    controllerUrlBase: string,
    externalUrls: ExternalUrls,
    OAuth2Config: any
}

interface ExternalUrls {
    issuer: string,
    verifier: string
}

export interface MessageMap {
    [index: string]: string
}