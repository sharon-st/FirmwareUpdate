export const msalConfig = {
  auth: {
    clientId: "167adf65-9d11-4d67-8433-c33ca0d5ba0c",  
    authority: "https://login.microsoftonline.com/0d7f219a-ad11-4fbf-b91b-8d223731a2a7",
    redirectUri: "http://localhost:3000/manage", 
  },
  cache: {
    cacheLocation: "sessionStorage",  
    storeAuthStateInCookie: false,    
  },
};

export const loginRequest = {
  scopes: [
    "openid",  
    "profile", 
    "api://c0b855d9-d4ce-4d41-a3e3-b998b4113ca6/access_as_user",
  ],
};
