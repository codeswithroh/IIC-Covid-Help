import React, { Fragment, useState } from "react";
import logoImg from "../svgs/bondhu.png";
import { Link, useHistory } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Axios from "axios";
import "./signIn.css";
import Loading from "../components/Loading";
// import GoogleLogin from "react-google-login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Signin = () => {
  const [{ origin }] = useStateContext();
  const history = useHistory();
  return (
    <>
      <div className="signIn">
        <Logo />
        <Form origin={origin} history={history} />
      </div>
    </>
  );
};

const Logo = () => {
  return (
    <section className="logoSignIn">
      <Link to="/">
        <img
          style={{
            maxWidth: "30em",
            paddingBottom: "4em",
            cursor: "pointer",
          }}
          src={logoImg}
          alt="Logo"
        />
      </Link>
      <h2>Helping people connect to the emergency services</h2>
    </section>
  );
};

const Form = ({ origin, history }) => {
  const [IsLoading, SetIsLoading] = useState(false);
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    if (email === "") {
      alert("Please enter your email");
    } else {
      if (password === "") {
        alert("Please enter the password");
      } else {
        SetIsLoading(true);
        let newUser = { Email: email, Password: password };
        Axios.post(`${origin}/login`, newUser)
          .then((response) => {
            SetIsLoading(false);
            //console.log("login response", response.data.tokens.Name);
            if (response.data.status === "Logged in successfully") {
              localStorage.setItem(
                "refreshToken",
                response.data.tokens.refreshToken
              );
              sessionStorage.setItem(
                "accessToken",
                response.data.tokens.accessToken
              );
              localStorage.setItem("userName", response.data.tokens.Name);
              history.push("/");
            } else {
              //signin error
              history.push(`error/${response.data.status}`);
            }
          })
          .catch((error) => {
            if (error) {
              console.error("Error occoured while signing in", error);
            }
          });
      }
    }
  };

  // const responseGoogle = (res) => {
  //   // console.log(`name:${res.profileObj.name}`)
  //   SetIsLoading(true);
  //   let newUser = {
  //     Email: res.profileObj.email,
  //     Password: res.profileObj.googleId,
  //   };
  //   Axios.post(`${origin}/login`, newUser)
  //     .then((response) => {
  //       SetIsLoading(false);
  //       //console.log("login response", response.data.tokens.Name);
  //       if (response.data.status === "Logged in successfully") {
  //         localStorage.setItem(
  //           "refreshToken",
  //           response.data.tokens.refreshToken
  //         );
  //         sessionStorage.setItem(
  //           "accessToken",
  //           response.data.tokens.accessToken
  //         );
  //         localStorage.setItem("userName", response.data.tokens.Name);
  //         history.push("/");
  //       } else {
  //         //signin error
  //         history.push(`error/${response.data.status}`);
  //       }
  //     })
  //     .catch((error) => {
  //       if (error) {
  //         console.error("Error occoured while signing in", error);
  //       }
  //     });
  // };

  const [forgetPassword, setForgetPassword] = useState(false);
  const [ForgottenEmail, setForgottenEmail] = useState("");
  const handleForgetPassword = (e) => {
    e.preventDefault();
    setForgetPassword(!forgetPassword);
  };
  const sendForgotPassword = (e) => {
    e.preventDefault();
    console.log("IN send Forgot Password");
    let Email = ForgottenEmail;
    axios
      .post(`${origin}/forgotPassword`, { Email: Email })
      .then((response) => {
        console.log("Response of Forgot Password", response.data);
        if (
          response.data.status ===
          "If your Email exists in our records you will recieve a mail in your inbox containig the password reset link. Remember to check your spam folder"
        ) {
          setForgetPassword(!forgetPassword);
          history.push(`/verify/${response.data.status}`);
        }
      })
      .catch((error) => {
        console.error("Could not send the request of forgot Password", error);
        history.push("/error/Could not send the request of forgot Password");
      });
  };
  return (
    <Fragment>
      {IsLoading ? (
        <Loading />
      ) : (
        <form className="form">
          {/* this is the popup for the forget password */}
          {!forgetPassword ? null : (
            <div className="fp">
              <div className="fp_content">
                <div
                  className="fp_close"
                  onClick={() => setForgetPassword(!forgetPassword)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </div>
                <input
                  className="fp_input"
                  type="email"
                  placeholder="Enter your email"
                  value={ForgottenEmail}
                  onChange={(e) => setForgottenEmail(e.target.value)}
                />
                <button
                  className="fp_button"
                  type="submit"
                  onClick={sendForgotPassword}
                >
                  Send
                </button>
              </div>
            </div>
          )}

          <input
            type="email"
            onChange={(e) => SetEmail(e.target.value)}
            className="input"
            placeholder="Email"
            required
          />
          <input
            type="password"
            onChange={(e) => SetPassword(e.target.value)}
            className="input"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            onClick={(e) => submitHandler(e)}
            className="signin"
          >
            Sign In
          </button>
          {/* <div className='google_signin'>
            <GoogleLogin
              clientId='835116192554-2rk6mqhn7b8gu0lpuu75ku709hv73n7q.apps.googleusercontent.com'
              buttonText='Sign In with Google'
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            />
          </div> */}
          <button className="forgetPassword" onClick={handleForgetPassword}>
            Forget Password?
          </button>
          <p>
            Don't Have an Account?{" "}
            <Link to="/signup" className="signup">
              Sign Up
            </Link>
          </p>
        </form>
      )}
    </Fragment>
  );
};

export default Signin;
// 1234
// abc@gmail.com
