import { useContext, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { UserContext } from "./App";

const useAuth = () => {
  const { user } = useContext(UserContext);
  return user.loggedIn;
};

const ProtectedRoutes = () => {
  const location = useLocation();
  const isAuth = useAuth();
  const { setvisible, setRedirectPath } = useContext(UserContext); // Context to control modal and redirect path

  useEffect(() => {
    if (!isAuth) {
      setRedirectPath(location.pathname); // Store the current path
      setvisible(true); // Open the login modal
    }
  }, [isAuth, location, setvisible, setRedirectPath]);

  return isAuth ? <Outlet /> : null;
};

export default ProtectedRoutes;
