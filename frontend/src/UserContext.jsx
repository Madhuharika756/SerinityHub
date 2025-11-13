import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null); // null = not fetched yet
  const [loading, setLoading] = useState(true);   // loading state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/profile", {
          withCredentials: true,
        });
        setUserInfo(data);
      } catch (err) {
        setUserInfo(null); // not logged in
        console.log("No logged-in user:", err.message);
      } finally {
        setLoading(false); // finished fetching
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <p className="text-center mt-12">Loading user info...</p>;
  }

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}
