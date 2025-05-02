import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FirmwareList from "./components/FirmwareList";
import FirmwareManager from "./components/FirmwareManager";
import AuthButton from "./components/AuthButton";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useMsal } from "@azure/msal-react";

function App() {
    const { instance } = useMsal();
    const accounts = instance.getAllAccounts();
    const isAuthenticated = accounts.length > 0;

    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Firmware Management
                    </Typography>
                    <Button color="inherit" component={Link} to="/firmwares">
                        View Firmware
                    </Button>
                    {isAuthenticated && (
                        <Button color="inherit" component={Link} to="/manage">
                            Manage Firmware
                        </Button>
                    )}
                    <AuthButton />
                </Toolbar>
            </AppBar>

            <Routes>
                <Route path="/firmwares" element={<FirmwareList />} />
                <Route path="/manage" element={<FirmwareManager />} />
            </Routes>
        </Router>
    );
}

export default App;
