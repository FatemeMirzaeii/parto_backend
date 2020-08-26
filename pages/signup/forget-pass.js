import { useRouter } from "next/router";
import style from "../../styles/Home.module.css";
import Head from "next/head";

//handle forgetting passwaord
export default function ForgetPass() {
  const router = useRouter();
  return (
    <div className={style.container}>
      <Head>
        <title>تغییر رمز عبور</title>
      </Head>
      <div></div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/signup/change-pass");
        }}
      >
        ایمیل (شماره تلفن همرا)
        <input type="text" />
        <br />
        ارسال
        <input type="submit" />
      </form>
    </div>
  );
}
