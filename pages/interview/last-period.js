import { useRouter } from "next/router";
import style from "../../styles/Home.module.css";
import Head from "next/head";

//get days of period
export default function LastPeriod() {
  const router = useRouter();
  return (
    <div className={style.container}>
      <Head>
        <title>مصاحبه</title>
      </Head>
      <div>?</div>
      <div>
        <p> تاریخ شروع آخرین پریود خود را وارد کنید. </p>
      </div>
      <div>تقویم</div>
      <br />
      <div>
        <a>فراموش کردم</a>
      </div>

      <div>
        <button
          onClick={() => {
            router.push("/interview/period-length");
          }}
        >
          قبلی
        </button>
        <button
          onClick={() => {
            router.push("/main/main-page");
          }}
        >
          ادامه
        </button>
      </div>
    </div>
  );
}
