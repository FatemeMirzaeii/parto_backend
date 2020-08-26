import { useRouter } from "next/router";
import style from "../../styles/Home.module.css";
import Head from "next/head";

//get days of period
export default function PeriodLength() {
  const router = useRouter();
  return (
    <div className={style.container}>
      <Head>
        <title>مصاحبه</title>
      </Head>
      <div>?</div>
      <div>
        <p>میانگین روزهای پریود شما چند روز است؟</p>
        <p>(معمولا ۴ تا ۷ روز)</p>
      </div>
      <div>استپر روز</div>
      <br />
      <div>
        <a>فراموش کردم</a>
      </div>

      <div>
        <button
          onClick={() => {
            router.push("/interview//cycle-length");
          }}
        >
          قبلی
        </button>
        <button
          onClick={() => {
            router.push("/interview/last-period");
          }}
        >
          بعدی
        </button>
      </div>
    </div>
  );
}
