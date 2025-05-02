import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import axios from "axios";

const ExampleComponent = () => {
  const [message, setMessage] = useState("");
  const { instance } = useMsal();

  const fetchData = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        scopes: ["api://c0b855d9-d4ce-4d41-a3e3-b998b4113ca6/access_as_user"], // Replace with your backend scope
      });

      const token = response.accessToken;

      const result = await axios.get("http://localhost:8000/api/example/", {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      setMessage(result.data.message);
    } catch (error) {
      console.error("Error fetching data from example_view:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 
  return (
    <div>
      <h1>Example View Test</h1>
      <p>{message}</p>
    </div>
  );
};

export default ExampleComponent;
