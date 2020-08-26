import Head from "next/head";
import style from "../../styles/Home.module.css";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useDispatch, useSelector } from "react-redux";
import { userSignup } from "../../redux/actions/userInformation";
import { useState } from "react";
import GetVerify from "../../component/backend/GetVerify";

const fetcher = (url) => fetch(url).then((res) => res.json());

//get user information for signup

export default function Signup() {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const router = useRouter();

  //save user data for authentication
  function handleSignup() {
    event.preventDefault();
    //store user entered data in redux
    //to prevent state passing between hooks
    dispatch(userSignup(userName, password, email, phone));

    router.push({
      pathname: "/signup/authentication",
    });
  }

  return (
    <div className={style.container}>
      <Head>
        <title>ثبت نام</title>
      </Head>
      {/* <h1>{data.id}</h1> */}
      <form
        onSubmit={() => {
          handleSignup();
        }}
      >
        <p>شما می توانید بین ایمیل و شماره همراه یکی را وارد نمایید.</p>
        نام کاربری
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <br />
        ایمیل
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        شماره همراه
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <br />
        رمز عبور
        <input
          tye="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        ثبت نام
        <input type="submit" />
      </form>
    </div>
  );
}
