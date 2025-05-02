import React, { useState, useEffect } from "react";
import { firmwareAPI } from "../apiService";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";

const FirmwareManager = () => {
  const [firmwares, setFirmwares] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    version: "",
    updated_by: "",
    note: "",
    fw_package: null,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchFirmwares();
  }, []);

  // Fetch firmware entries from the API
  const fetchFirmwares = async () => {
    setLoading(true);
    try {
      const response = await firmwareAPI.getAll();
      setFirmwares(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch firmware data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submission (Create/Update firmware)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (selectedId) {
        await firmwareAPI.update(selectedId, data);
        setSuccessMessage("Firmware updated successfully!");
      } else {
        await firmwareAPI.create(data);
        setSuccessMessage("Firmware created successfully!");
      }

      setFormData({ name: "", version: "", updated_by: "", note: "", fw_package: null });
      setSelectedId(null);
      fetchFirmwares();
    } catch (err) {
      setError("Error processing request.");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing firmware entry
  const handleEdit = (firmware) => {
    setFormData({
      name: firmware.name,
      version: firmware.version,
      updated_by: firmware.updated_by,
      note: firmware.note,
    });
    setSelectedId(firmware.id);
  };

  // Handle deleting firmware entry
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this firmware?")) {
      setLoading(true);
      try {
        await firmwareAPI.delete(id);
        setSuccessMessage("Firmware deleted successfully!");
        fetchFirmwares();
      } catch (err) {
        setError("Error deleting firmware.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
        Manage Firmware
      </Typography>

      <Paper elevation={3} sx={{ padding: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Version"
                name="version"
                value={formData.version}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Updated By"
                name="updated_by"
                value={formData.updated_by}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Note"
                name="note"
                value={formData.note}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Upload Firmware Package
                <input type="file" name="fw_package" hidden onChange={handleChange} required />
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {selectedId ? "Update Firmware" : "Create Firmware"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mt: 3 }}>{successMessage}</Alert>}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Typography variant="h5" sx={{ mt: 4 }}>
        Existing Firmware
      </Typography>

      <Paper elevation={3} sx={{ padding: 2 }}>
        <List>
          {firmwares.map((firmware) => (
            <React.Fragment key={firmware.id}>
              <ListItem>
                <ListItemText primary={`${firmware.name} (Version: ${firmware.version})`} />
                <Button onClick={() => handleEdit(firmware)} variant="outlined" sx={{ marginRight: 2 }}>
                  Edit
                </Button>
                <Button onClick={() => handleDelete(firmware.id)} variant="outlined" color="error">
                  Delete
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default FirmwareManager;

// import React, { useState, useEffect } from "react";
// import { firmwareAPI } from "../apiService";
// import { useMsal } from "@azure/msal-react";
// import { loginRequest } from "../authConfig";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Grid,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   Alert,
//   CircularProgress,
//   Box,
// } from "@mui/material";

// const FirmwareManager = () => {
//   const { instance } = useMsal();
//   const [firmwares, setFirmwares] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     version: "",
//     updated_by: "",
//     note: "",
//     fw_package: null,
//   });
//   const [selectedId, setSelectedId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);

//   useEffect(() => {
//     fetchFirmwares();
//   }, []);

//   // Fetch firmware entries from the API
//   const fetchFirmwares = async () => {
//     setLoading(true);
//     try {
//       const response = await firmwareAPI.getAll();
//       setFirmwares(response.data);
//       setError(null);
//     } catch (err) {
//       setError("Failed to fetch firmware data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   // Function to acquire token safely
//   const acquireToken = async () => {
//     try {
//       const accounts = instance.getAllAccounts();
//       if (accounts.length === 0) {
//         await instance.loginPopup(loginRequest);
//       }
//       const tokenResponse = await instance.acquireTokenSilent(loginRequest);
//       return tokenResponse.accessToken;
//     } catch (error) {
//       console.error("Authentication failed. Please log in again.", error);
//       setError("Authentication failed. Please log in again.");
//       throw error;
//     }
//   };

//   // Handle form submission (Create/Update firmware)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const token = await acquireToken();

//       const data = new FormData();
//       Object.keys(formData).forEach((key) => {
//         data.append(key, formData[key]);
//       });

//       if (selectedId) {
//         await firmwareAPI.update(selectedId, data, token);
//         setSuccessMessage("Firmware updated successfully!");
//       } else {
//         await firmwareAPI.create(data, token);
//         setSuccessMessage("Firmware created successfully!");
//       }

//       setFormData({ name: "", version: "", updated_by: "", note: "", fw_package: null });
//       setSelectedId(null);
//       fetchFirmwares();
//     } catch (err) {
//       setError("Error processing request.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle editing firmware entry
//   const handleEdit = (firmware) => {
//     setFormData({
//       name: firmware.name,
//       version: firmware.version,
//       updated_by: firmware.updated_by,
//       note: firmware.note,
//     });
//     setSelectedId(firmware.id);
//   };

//   // Handle deleting firmware entry
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this firmware?")) {
//       setLoading(true);
//       try {
//         const token = await acquireToken();
//         await firmwareAPI.delete(id, token);
//         setSuccessMessage("Firmware deleted successfully!");
//         fetchFirmwares();
//       } catch (err) {
//         setError("Error deleting firmware.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
//         Manage Firmware
//       </Typography>

//       <Paper elevation={3} sx={{ padding: 3 }}>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Version"
//                 name="version"
//                 value={formData.version}
//                 onChange={handleChange}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="Updated By"
//                 name="updated_by"
//                 value={formData.updated_by}
//                 onChange={handleChange}
//                 required
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 multiline
//                 rows={3}
//                 label="Note"
//                 name="note"
//                 value={formData.note}
//                 onChange={handleChange}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <Button variant="contained" component="label">
//                 Upload Firmware Package
//                 <input type="file" name="fw_package" hidden onChange={handleChange} required />
//               </Button>
//             </Grid>

//             <Grid item xs={12}>
//               <Button type="submit" variant="contained" color="primary" disabled={loading}>
//                 {selectedId ? "Update Firmware" : "Create Firmware"}
//               </Button>
//             </Grid>
//           </Grid>
//         </form>
//       </Paper>

//       {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
//       {successMessage && <Alert severity="success" sx={{ mt: 3 }}>{successMessage}</Alert>}
//       {loading && (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
//           <CircularProgress />
//         </Box>
//       )}

//       <Typography variant="h5" sx={{ mt: 4 }}>
//         Existing Firmware
//       </Typography>

//       <Paper elevation={3} sx={{ padding: 2 }}>
//         <List>
//           {firmwares.map((firmware) => (
//             <React.Fragment key={firmware.id}>
//               <ListItem>
//                 <ListItemText primary={`${firmware.name} (Version: ${firmware.version})`} />
//                 <Button onClick={() => handleEdit(firmware)} variant="outlined" sx={{ marginRight: 2 }}>
//                   Edit
//                 </Button>
//                 <Button onClick={() => handleDelete(firmware.id)} variant="outlined" color="error">
//                   Delete
//                 </Button>
//               </ListItem>
//               <Divider />
//             </React.Fragment>
//           ))}
//         </List>
//       </Paper>
//     </Container>
//   );
// };

// export default FirmwareManager;
