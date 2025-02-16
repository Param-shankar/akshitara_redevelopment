import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../utils/api";

const useFetch = (endpoint) => {
  const [data, setData] = useState(null); // Initialize data with null for clarity
  const [loading, setLoading] = useState(true); // Optional: add a loading state
  const [error, setError] = useState(null); // Optional: add an error state

  useEffect(() => {
    if (!endpoint) return; // Prevent call if endpoint is undefined or empty

    const makeApiCall = async () => {
      // console.log("API call made to endpoint:", endpoint);
      setLoading(true);
      try {
        const res = await fetchDataFromApi(endpoint);
        setData(res);
      } catch (err) {
        setError(err); // Capture error if any
      } finally {
        setLoading(false);
      }
    };

    makeApiCall();
  }, [endpoint]); // Only re-fetch when endpoint changes

  return { data, loading, error };
};

export default useFetch;
