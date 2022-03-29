import { AppOption } from "components/external-page-layout/pages/HomePage";
import { PIImap } from "components/external-page-layout/pages/registry-page/FullScreenCredentialDetailsModal";

export interface Constants {
    controllerUrlBase: string,
    actions: AppOption[],
    credentialKeyMap: PIImap,
    entity: string,
    OAuth2Config: {
        domain: string,
        clientId: string
    }
}

export interface MessageMap {
    [index: string]: string
}