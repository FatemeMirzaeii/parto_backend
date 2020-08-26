import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import SigninFetch from "../component/backend/SigninFetch";
import InterviewCheck from "../component/backend/InterviewCheck";
import useSWR from "swr";
import { SetToken } from "../redux/actions/SetToken";
import { SetUserId } from "../redux/actions/SetUserId";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState(0);

  const dispatch = useDispatch();
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      try {
        navigator.serviceWorker.register("../serviceWorker.js");
      } catch (err) {
        console.error("Service worker registration failed", err);
      }
    } else console.log("Service worker not supported");
    /* connect to indexedDB
      if there is id
        if interview has value
          if pregnant
            redirect to pregnancy weeks
          else
            redirect to period calender
        else
          redirect to interview

      
       */
    // router.push("/interview/mobile/welcom");
  });
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");

  async function handleSignin() {
    event.preventDefault();

    const response = await SigninFetch(email, phone, pass);
    // sigin is ok
    if (response.status === 200) {
      dispatch(SetToken(response.tokenId));
      dispatch(SetUserId(response.userId));
      const res = await InterviewCheck(response.userId, response.tokenId);
      //user has pass interview
      if (res.status === 200) {
        router.push({
          pathname: "/main/main-page",
        });
      }
      //user does not pass interview
      if (res.status === 404)
        router.push({
          pathname: "/interview/welcome",
        });
      //userId or tokenId for interview checkis not correct
      if (res.status === 400) setStatus(401);
      //interview check lost in network
      if (res.status === 500) setStatus(500);
    }
    //user or pass is not correct
    if (response.status === 404) setStatus(400);
    //signin lost in network
    if (response.status === 500) setStatus(500);
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>پرتو من</title>
        <link rel="icon" href="/logo.jpeg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#317EFB" />
        <link rel="apple-touch-icon" href="/logo.jpeg"></link>
      </Head>

      {/* 
        ورود
        ثبت نام
       */}
      <div>سلام</div>
      <br />
      {/* to do
      after login render interview or period calender or pregnancy weeks according to user state */}
      <form
        onSubmit={() => {
          handleSignin();
        }}
      >
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
          type="text"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <br></br>
        ورود
        <input type="submit" value="ورود" />
      </form>
      <br />
      <button
        onClick={() => {
          router.push("/signup/forget-pass");
        }}
      >
        رمز عبور را فراموش کرده ام
      </button>
      <button
        onClick={() => {
          router.push("/signup/signup");
        }}
      >
        ثبت نام
      </button>
      <br />
      <br />
      {status === 100 && <div>چند لحظه صبر کنید ... </div>}
      {status === 400 && <div>اطلاعات وارد شده صحیح نیست.</div>}
      {status === 401 && <div>خطای درون برنامه ای</div>}
      {status === 500 && <div>خطا در شبکه، دوباره تلاش کنید.</div>}
    </div>
  );
}
