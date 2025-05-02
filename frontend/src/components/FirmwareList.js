import React, { useEffect, useState } from "react";
import { firmwareAPI } from "../apiService";
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider, CircularProgress, Alert } from "@mui/material";

const FirmwareList = () => {
  const [firmwares, setFirmwares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFirmwares();
  }, []);

  const fetchFirmwares = async () => {
    try {
      const response = await firmwareAPI.getAll();
      setFirmwares(response.data);
    } catch (err) {
      setError("Failed to fetch firmware data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
        Firmware List
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper elevation={3} sx={{ padding: 2 }}>
          <List>
            {firmwares.map((firmware, index) => (
              <React.Fragment key={firmware.id}>
                <ListItem>
                  <ListItemText
                    primary={`${firmware.name} (Version: ${firmware.version})`}
                    secondary={`Updated by: ${firmware.updated_by}`}
                  />
                </ListItem>
                {index < firmwares.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default FirmwareList;
