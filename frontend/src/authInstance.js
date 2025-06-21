// authInstance.js
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";

export const instance = new PublicClientApplication(msalConfig);

