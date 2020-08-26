import { useRouter } from "next/router";
import style from "../../styles/Home.module.css";
import Head from "next/head";

//sign up is done successfule and user is ready for interview
export default function MainPage() {
  //   const router = useRouter();
  return (
    <div className={style.container}>
      <Head>
        <title>پرتو من</title>
      </Head>
      <div>صفحه اصلی</div>
      <br />
    </div>
  );
}
