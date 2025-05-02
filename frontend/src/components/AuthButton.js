import React from "react";
import { useMsal } from "@azure/msal-react";
import Button from "@mui/material/Button";
import { loginRequest } from "../authConfig";

const AuthButton = () => {
    const { instance } = useMsal();
    const accounts = instance.getAllAccounts();
    const isAuthenticated = accounts.length > 0;

    const handleLogin = () => {
        instance.loginPopup(loginRequest).catch((error) => console.error("Login failed:", error));
    };

    const handleLogout = () => {
        instance.logoutPopup().catch((error) => console.error("Logout failed:", error));
    };

    return (
        <>
            {isAuthenticated ? (
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
            ) : (
                <Button color="inherit" onClick={handleLogin}>
                    Login
                </Button>
            )}
        </>
    );
};

export default AuthButton;
