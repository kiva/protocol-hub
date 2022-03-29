const configuration = {
    "controllerUrlBase": "https://sandbox-gateway.protocol-prod.kiva.org",
    "OAuth2Config": {
        "domain": "kiva-protocol.auth0.com/authorize",
        "clientId": "HpWN2R8YXDKlh46w1iBXo1UJV17G5yge"
    },
    "credentialKeyMap": {
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
    },
    "actions": [
        {
            "icon": "registry.svg",
            "title": "Registry",
            "subTitle": "Manage registered users",
            "route": "/registry"
        },
        {
            "icon": "docs.svg",
            "title": "Docs",
            "subTitle": "Learn how to develop custom integrations",
            "url": "https://protocol-docs.web.app/docs/"
        },
        {
            "title": "Issue Credentials",
            "subTitle": "Register individuals",
            "url": "https://pro-cluster-kiva-issue.web.app"
        },
        {
            "title": "Verify",
            "subTitle": "Verify the individual's credentials",
            "url": "https://pro-cluster-kiva-verify.web.app"
        }
    ]
}
export default configuration;
