import { useRouter } from "next/router";
import style from "../../styles/Home.module.css";
import Head from "next/head";

//sign up is done successfule and user is ready for interview
export default function PassChanged() {
  const router = useRouter();
  return (
    <div className={style.container}>
      <Head>
        <title>تغییر رمز عبور</title>
      </Head>
      <div>رمز عبور شما با موفقیت تغییر کرد.</div>
      <br />
      {/* to do
       redirect to interview or period calnder or pregnancy weaks
       according to user state  */}
      <button
        onClick={() => {
          router.push("/main/main-page");
        }}
      >
        ادامه
      </button>
    </div>
  );
}
