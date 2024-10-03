import { createContext, useState } from "react";
import Navbar from "./Components/NavBar";
import Views from "./Views";
// import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { isAuthTokenPresent ,getUserDetails} from "./helpers/axios_helper";
import Footer from "./Components/Footer";

export const UserContext = createContext();


function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ loggedIn: isAuthTokenPresent(), details: getUserDetails() });
  const [visible,setvisible] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");
  return (
    <UserContext.Provider
    value={{ user, setUser, visible, setvisible, redirectPath, setRedirectPath }}
  >
      {/* Wrap everything inside LoginModalProvider to manage the login modal state */}
        <Navbar />
        <Views />
        <Footer/>
    </UserContext.Provider>
  );
}

export default App;
