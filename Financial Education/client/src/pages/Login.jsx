import React, { useState } from "react";
import * as Components from "../components/login/Components";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import Api from "../api/index";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Login() {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [signIn, toggle] = useState(true);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);
  const handleClickShowLoginPassword = () =>
    setShowLoginPassword((show) => !show);
  const [btnName, setBtnName] = useState("Log In");

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log(signupInfo);
    if (
      !signupInfo.name ||
      !signupInfo.email ||
      !signupInfo.password ||
      !signupInfo.phone
    ) {
      toast.error("Please fill all the fields");
      toggle(false);
      return;
    }
    if (signupInfo.password !== confirmPassword) {
      toast.error("Passwords do not match");
      toggle(false);
      return;
    }
    await Api.registerUser(signupInfo)
      .then((res) => {
        console.log(res);
        toast.success("Account created successfully");
        toggle(true);
        setSignupInfo({
          name: "",
          email: "",
          password: "",
          phone: "",
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(loginInfo);
    setBtnName("Logging In...");
    if (!loginInfo.email || !loginInfo.password) {
      toast.error("Please fill all the fields");
      setBtnName("Log In");
      return;
    }
    await Api.loginUser(loginInfo)
      .then(async (res) => {
        console.log(res.data);
        if (res.data.message === 'success' && res.data.token) {
            toast.success("Logged in successfully!");
            localStorage.setItem('token', res.data.token);
            const decodedToken = jwtDecode(res.data.token);
            localStorage.setItem('user', JSON.stringify(decodedToken));
            console.log("Decoded Token:", decodedToken);
            setLoginInfo({ email: '', password: ''});
            navigate("/home");
        } else {
            toast.error(res.data.message || "Login failed, please try again.");
        }
        setBtnName("Log In");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.message || "Login failed, please try again.");
        setBtnName("Log In");
      });
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Components.Container>
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form>
            <Components.Title>Create Account</Components.Title>
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              margin="normal"
              fullWidth
              size="small"
              onChange={(e) =>
                setSignupInfo({ ...signupInfo, name: e.target.value })
              }
            />
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              margin="normal"
              size="small"
              fullWidth
              onChange={(e) =>
                setSignupInfo({ ...signupInfo, email: e.target.value })
              }
            />
            <TextField
              id="outlined-basic"
              label="Phone"
              variant="outlined"
              margin="normal"
              size="small"
              fullWidth
              onChange={(e) =>
                setSignupInfo({ ...signupInfo, phone: e.target.value })
              }
            />
            <div className="relative w-full">
              <TextField
                className="w-full "
                label="Password"
                variant="outlined"
                margin="normal"
                size="small"
                type={showPassword ? "text" : "password"}
                value={signupInfo.password}
                onChange={(e) =>
                  setSignupInfo({ ...signupInfo, password: e.target.value })
                }
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: "18px",
                  right: "5px",
                }}
                onClick={handleClickShowPassword}
              >
                {showPassword ? (
                  <VisibilityOff sx={{ fontSize: "20px" }} />
                ) : (
                  <Visibility sx={{ fontSize: "20px" }} />
                )}
              </IconButton>
            </div>
            <div className="relative w-full">
              <TextField
                className="w-full "
                label="Confirm Password"
                variant="outlined"
                margin="normal"
                size="small"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: "18px",
                  right: "5px",
                }}
                onClick={handleClickShowConfirmPassword}
              >
                {showConfirmPassword ? (
                  <VisibilityOff sx={{ fontSize: "20px" }} />
                ) : (
                  <Visibility sx={{ fontSize: "20px" }} />
                )}
              </IconButton>
            </div>
            <Components.Button
              onClick={handleSignup}
              style={{
                marginTop: "1rem",
              }}
            >
              Sign Up
            </Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        <Components.SignInContainer signinIn={signIn}>
          <Components.Form>
            <Components.Title
              style={{
                fontSize: "1.5rem",
              }}
            >
              Sign in
            </Components.Title>
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              margin="normal"
              fullWidth
              onChange={(e) =>
                setLoginInfo({ ...loginInfo, email: e.target.value })
              }
            />
            <div className="relative w-full">
              <TextField
                className="w-full "
                label="Password"
                variant="outlined"
                margin="normal"
                type={showLoginPassword ? "text" : "password"}
                value={loginInfo.password}
                onChange={(e) =>
                  setLoginInfo({ ...loginInfo, password: e.target.value })
                }
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: "22px",
                  right: "8px",
                }}
                onClick={handleClickShowLoginPassword}
              >
                {showLoginPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
            <Components.Button
              onClick={handleLogin}
              style={{
                marginTop: "1rem",
              }}
            >
              {btnName}
            </Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Title>Welcome Back!</Components.Title>
              <Components.Paragraph>
                Create Once, Share Everywhere - Amplify Your Digital Presence.
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(true)}>
                Sign In
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title>Welcome to Innosave!</Components.Title>
              <Components.Paragraph>
                One Click, Infinite Connections - Your Content, Everywhere!
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(false)}>
                Sign Up
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </div>
  );
}

export default Login;
