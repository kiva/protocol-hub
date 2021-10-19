export const appConfig = {
  tenant: '',
  client: '',
  logoUrl: '/images/logo.png',
  actions: [
    {
      icon: "docs.svg",
      title: "Docs",
      subTitle: "Learn how to develop custom integrations",
      url: "https://protocol-docs.web.app/docs/"
    },
    {
      icon: "docs.svg",
      title: "Issuer",
      subTitle: "Issue Credential",
      url: "https://pro-cluster-kiva-issue.web.app"
    },
    {
      title: "Verifier",
      subTitle: "Verify Credential",
      url: "https://pro-cluster-kiva-verify.web.app",
      icon: "docs.svg",
    },
    {
      title: "Transaction History",
      subTitle: "View Transaction History",
      route: "/transactionHistory",
      icon: "docs.svg",
    },
    {
      title: "Registry",
      subTitle: "View Registry",
      route: "/registry",
      icon: "docs.svg",
    },
  ]
}
