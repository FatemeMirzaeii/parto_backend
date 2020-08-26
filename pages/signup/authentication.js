import { useEffect, useState } from "react";
import Head from "next/head";
import style from "../../styles/Home.module.css";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useSelector } from "react-redux";
import GetVerify from "../../component/backend/GetVerify";

//authenticate mobile number
//store data in backend
//get token-id from backend
// const { tokenId , error } = useSWR(
//   "https://api.github.com/repos/vercel/swr",
//   fetcher
// );
// if (error) return "متاسفانه اطلاعات شما ثبت نشد. دوباره تلاش کنید.";
// if (!tokenId) return "چند لحظه صبر کنید";
//store username and token-id in redux
//go to inter view pages

export default function Authentication() {
  const [falseCode, setFalseCode] = useState(false);
  const [secondDelayFlag, setSecondDelayFlag] = useState(false);
  const [code, setCode] = useState(0);
  const [mainCode, setMainCode] = useState(0);
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const { data, error } = GetVerify(user.phone, user.email);
  if (error) {
    // setSecondDelayFlag(true);
    return (
      <div>
        متاسفانه درخواست شما ثبت نشد، لطفا دوباره تلاش کنید.
        {/* <br /> */}
        {/* <button onclick={router.push("nup/signup")}>دوباره</button> */}
      </div>
    );
  }

  if (!data) return "چند لحظه صبر کنید";

  console.log(data.code + data.message + data.header);

  function authenticate(event) {
    event.preventDefault();
    if (code == data.code) router.push("/signup/successful");
    else return setFalseCode(true);
    //to do
    //if entered code is ot correct
  }
  // useEffect(() => {
  // if (data) setMainCode(data.code);
  // var timer1 = setTimeout(() => {
  //   setFirstDelayFlag(true);
  // }, 2000);
  // var timer2 = setTimeout(() => {
  //   setFirstDelayFlag(false);
  //   setSecondDelayFlag(true);
  // }, 3000);
  // if (secondDelayFlag) router.push("/signup/successful");
  // return () => {
  //   clearTimeout(timer1);
  //   clearTimeout(timer2);
  // };
  // authenticate mobile number
  // }, [user]);

  return (
    <div className={style.container}>
      <Head>
        <title>ثبت نام</title>
      </Head>
      {/* to do
      link for change phone or email */}
      {/* {secondDelayFlag && (
        <div>متاسفانه درخواست شما ثبت نشد، لطفا دوباره تلاش کنید.</div>
      )} */}
      <div>
        کد ارسال شده برای ایمیل یا تلفن همراه خود را وارد کنید
        <form onSubmit={authenticate}>
          <input
            type="number"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input type="submit" value="تایید کد" />
        </form>
        {falseCode && <p>کد وارد شده صحیح نمی باشد</p>}
      </div>
    </div>
  );
}
