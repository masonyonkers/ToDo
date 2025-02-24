import React from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useState } from "react";
import { Link } from "react-router-dom";

const userProfile = {
  userName: "default",
  imgUrl: "picture",
  email: "email",
};

function Login() {
  const [visable, setVisable] = useState(false);
  const [profile, setProfile] = useState();

  const handleGsignin = (event) => {
    const credential = jwtDecode(e.credential);
    let firstName = credential.given_name;
    let lastName = credential.family_name;
    let imgUrl = credential.picture;
    let email = credential.email;
  };

  const handleSignin = (event) => {
    event.preventDefault();
    let username = event.target[0].value;
    let password = event.target[1].value;
    console.log(username);
    console.log(password);
  };

  return (
    <>
      <div className="w-[628px] h-[689px] p-6 rounded-2xl flex-col justify-center items-center gap-[42px] inline-flex">
        <div className="self-stretch h-[52px] flex-col justify-start items-start gap-4 flex">
          <div className="self-stretch text-[#110c2a] text-[40px] font-semibold font-['DM Sans']">
            Log In
          </div>
        </div>

        <form
          onSubmit={handleSignin}
          className="self-stretch flex-col justify-start items-start gap-4 flex"
        >
          <label>Username:</label>
          <input
            id="username"
            autoComplete="off"
            type="text"
            className="self-stretch px-4 py-3 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border border-[#cfd4dc] justify-start items-center gap-2 inline-flex overflow-hidden"
          />

          <label>Password:</label>
          <input
            id="password"
            autoComplete="off"
            type={visable ? "text" : "password"}
            className="self-stretch px-4 py-3 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border border-[#cfd4dc] justify-start items-center gap-2 inline-flex overflow-hidden"
          />
          <button type="button" onClick={() => setVisable(!visable)}>
            Hide Password
          </button>

          <input
            type="submit"
            value="Log In"
            className="cursor-pointer self-stretch grow shrink basis-0 h-12 px-4 py-3 bg-[#7e56d8] rounded-xl justify-center items-center gap-3 flex text-white"
          />
        </form>

        <GoogleLogin
          onSuccess={handleGsignin}
          onError={() => console.log("Login Failed")}
        />

        <div className="self-stretch">
          <span className="text-[#110c2a] text-base font-normal font-['DM Sans']">
            Don't have an account?{" "}
          </span>
          <Link className="text-[blue] font-bold" to="/signup">Sign up</Link>
        </div>
      </div>
    </>
  );
}

export default Login;
