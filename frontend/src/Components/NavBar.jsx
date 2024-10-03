import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaMoon, FaSun, FaSearch, FaUserCircle } from 'react-icons/fa'; // FontAwesome Icons
import { UserContext } from "../App";
import { Form, Link, replace } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Request, setAuthHeader, getAuthToken, getJwtCookie, flushCookies, setUserDetails } from '../helpers/axios_helper';
import { useNavigate, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { message } from 'antd';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const { user, setUser, visible, setvisible, redirectPath, setRedirectPath } = useContext(UserContext); // Use variables from UserContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phonenumber , setphonenumber] = useState('');
  const [confirmpassword,setconfirmpassword] = useState('')
  const [fullName, setfullName] = useState('')
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false); // Tracks search modal visibility
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup forms
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Tracks dropdown visibility for profile
  const searchRef = useRef(null); // To track the modal container

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark'); // Toggles the dark mode class on root element
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible); // Toggle search modal visibility
  };

  const openLoginModal = () => {
    setvisible(true); // Open login/signup modal using context
  };

  const closeLoginModal = () => {
    setvisible(false); // Close login/signup modal using context
  };

  const switchToSignup = () => {
    setIsLogin(false); // Switch to the signup form
  };

  const switchToLogin = () => {
    setIsLogin(true); // Switch back to the login form
  };
  
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearchVisible(false)
      navigate(`/filters?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('')
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === '') {
      toast.error('Please enter the email');
    } else if (password === '') {
      toast.error('Please enter the password');
    } else {
      const data = { email, password };
      try {
        setLoading(true);
        const res = await Request('POST', '/user/login', data, setUser);
        if (res.status === 200) {
          toast.success(res.data.message);
          setAuthHeader(res.data.accessToken);
          setUserDetails(res.data.user)
          setUser({ loggedIn: true,details:res.data.user });
          setLoading(false);
          setvisible(false);
          if (redirectPath) {
            navigate(redirectPath, replace);
          }
          else {
            navigate('/filters', { replace: true });
          }
        } else {
          toast.error(res.data.error);
          setLoading(false);
        }
      } catch (error) {
        console.error('Login request failed:', error);
        setLoading(false);
        toast.error('Login request failed');
      }
    }
  };

  const handleSignUp = async (e)=>{
    e.preventDefault();
    if (email === '') {
      toast.error('Please enter the email');
    } else if (password === '') {
      toast.error('Please enter the password');
    } else {
      const data = { email, password,fullName,phonenumber };
      try {
        setLoading(true);
        const res = await Request('POST', '/user/register', data, setUser);
        if (res.status === 200) {
          toast.success(res.data.message);
          setIsLogin(true);
          setLoading(false);
        } else {
          toast.error(res.data.error);
          setLoading(false);
        }
      } catch (error) {
        console.error('register request failed:', error);
        setLoading(false);
        toast.error('register request failed');
      }
    }
  }
  // Use useEffect to detect click outside the search modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchVisible(false); // Close the modal if the click is outside
      }
    };

    if (isSearchVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchVisible]);

  
  const handleLogout = async () => {
    try {
      await Request('POST', '/user/logout');
      flushCookies();
      setUser({ loggedIn: false });
      message.success('Logged out successfully');
      navigate('/',replace)
    } catch (error) {
      message.error('Error logging out');
    }
  };

  if (loading) {
    return (
      <div className="flex space-x-2 justify-center items-center h-screen dark:invert">
        <span className="sr-only">Loading...</span>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
      </div>
    );
  }

  return (
    <>
      {/* Upper Navbar */}
      <nav className="bg-[#3E2723] border-b-2 border-[#D7CCC8] dark:bg-[#212121]">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="border-2 dark:border-[#4b3f34] border-[#d3b89b] px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 lg:px-12 lg:py-4">
              <span className="dark:text-[#4b3f34] text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide sm:tracking-wider md:tracking-widest font-normal text-[#d3b89b]">
                CoffeeCup
              </span>
            </div>
          </a>

          {/* Right side: Dark Mode Toggle, Search Icon, Login/Profile Button */}
          <div className="flex items-center space-x-6 md:space-x-8 lg:space-x-10 rtl:space-x-reverse">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 md:p-3 lg:p-4 text-[#D7CCC8] dark:text-gray-300 hover:text-[#A1887F] dark:hover:text-white focus:outline-none"
            >
              {isDarkMode ? <FaMoon size={20} /> : <FaSun size={20} />}
            </button>

            {/* Search Icon */}
            <button
              onClick={toggleSearch}
              className="p-2 md:p-3 lg:p-4 text-[#D7CCC8] dark:text-gray-300 hover:text-[#A1887F] dark:hover:text-white focus:outline-none"
            >
              <FaSearch size={20} />
            </button>

            {/* Login/Profile Button */}
            {!user.loggedIn ? (
              <button onClick={openLoginModal} className="p-3 text-sm text-[#A1887F] hover:underline">
                Login
              </button>
            ) : (
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownVisible(true)}
                onMouseLeave={() => setIsDropdownVisible(false)}
              >
                <button className="p-2 md:p-3 lg:p-4 text-sm text-[#D7CCC8] dark:text-gray-300">
                  <FaUserCircle size={24} />
                </button>

                {/* Profile Dropdown */}
                {isDropdownVisible && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/wish-list"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          wishList
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/cart"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Cart
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Lower Navbar (Centered) */}
      <nav className="bg-[#D7CCC8] dark:bg-[#424242]">
        <div className="max-w-screen-xl px-4 py-3 mx-auto">
          <div className="flex justify-center">
            <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm text-[#3E2723] dark:text-[#D7CCC8]">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/filters" className="hover:underline">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/brandspage" className="hover:underline">
                  Brands
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Spotlight-style Search Modal */}
      {isSearchVisible && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
          <div ref={searchRef} className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow bg-[#EFEBE9] dark:bg-gray-900 dark:text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A1887F]"
              />
              <button
                onClick={handleSearch}
                className="ml-2 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              >
                <FaSearch size={20} />
              </button>
              <button
                onClick={toggleSearch}
                className="ml-2 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login/Signup Modal */}
      {visible && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
            {isLogin ? (
              <>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Login</h2>
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-3 w-full p-2 bg-[#EFEBE9] dark:bg-gray-900 dark:text-white rounded-md"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-3 w-full p-2 bg-[#EFEBE9] dark:bg-gray-900 dark:text-white rounded-md"
                />
                <button className="w-full bg-[#3E2723] text-white py-2 rounded-md" onClick={handleLogin}>
                  Login
                </button>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  Don't have an account?{' '}
                  <button onClick={switchToSignup} className="text-[#A1887F] hover:underline">
                    Sign Up
                  </button>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Sign Up</h2>
                <input
                  type="text"
                  placeholder="fullName"
                  value={fullName}
                  onChange={(e) => setfullName(e.target.value)}
                  className="mb-3 w-full p-2 bg-[#EFEBE9] dark:bg-gray-900 dark:text-white rounded-md"
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-3 w-full p-2 bg-[#EFEBE9] dark:bg-gray-900 dark:text-white rounded-md"
                />
                <input
                  type="text"
                  placeholder="phonenumber"
                  value={phonenumber}
                  onChange={(e)=> setphonenumber(e.target.value)}
                  className="mb-3 w-full p-2 bg-[#EFEBE9] dark:bg-gray-900 dark:text-white rounded-md"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-3 w-full p-2 bg-[#EFEBE9] dark:bg-gray-900 dark:text-white rounded-md"
                />
                
                <button className="w-full bg-[#3E2723] text-white py-2 rounded-md" onClick={handleSignUp}>Sign Up</button>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  Already have an account?{' '}
                  <button onClick={switchToLogin} className="text-[#A1887F] hover:underline">
                    Login
                  </button>
                </p>
              </>
            )}
            <button onClick={closeLoginModal} className="mt-4 text-sm text-gray-600 dark:text-gray-300 hover:underline">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
