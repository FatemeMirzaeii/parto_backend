import { useRouter } from "next/router";
import style from "../../styles/Home.module.css";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import SignupFetch from "../../component/backend/SignupFetch";
import SignUp from "../../component/backend/Signup";
import { useEffect, useState } from "react";
import { SetToken } from "../../redux/actions/SetToken";
// import { useDispatch, useSelector } from "react-redux";

//sign up is done successfule and user is ready for interview
export default function Successful() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user) 
  const [signupReady, setSignupReady] = useState(false);
  const [status, setStatus] = useState(0);

  // const { data, error } = SignUp(signupReady);
  // if (error) return "متاسفانه درخواست شما ثبت نشد، لطفا دوباره تلاش کنید..";
  // if (!data) return "چند لحظه صبر کنید";
  // // const dispatch = useDispatch();

  // // if (data)
  useEffect(() => {
    SignupFetch(user).then((x) => {
      setStatus(x.status);
      dispatch(SetToken(x.tokenId));
    });
  },user);

  return (
    <div className={style.container}>
      <Head>
        <title>ثبت نام</title>
      </Head>
      {console.log("token_id: " + status )}
      {
        status===0 &&
        <div>چند لحظه صبر کنید ... </div>
      }
      {status === 200 && (
        <div>
          <div> ثبت نام شما با موفقیت انجام شد{user.username} جان.</div>
          <br />
          <button
            onClick={() => {
              router.push("/interview/welcome");
            }}
          >
            ادامه
          </button>
        </div>
      )}
      {status === 400 && (
        <div>
          <div>این شماره تلفن/ایمیل تکراری است.</div>
          <br />
          <button
            onClick={() => {
             router.push("/signup/signup");
            }}
          >
            وارد کردن دوباره اطلاعات
          </button>
        </div>
      )}
      {status === 500 && (
        <div>
          <div>خطا در شبکه</div>
          <br />
          <button
            onClick={() => {console.log(user)
              router.push("/signup/successful");
            }}
          >
            تلاش مجدد
          </button>
        </div>
      )}
    </div>
  );
}
