import { useRouter } from "next/router";
import style from "../../styles/Home.module.css";
import Head from "next/head";

//change passwaord
export default function ChangePass() {
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
          router.push("/signup/pass-changed");
        }}
      >
        رمز عبور جدید
        <input type="text" />
        <br />
        ارسال
        <input type="submit" />
      </form>
    </div>
  );
}
