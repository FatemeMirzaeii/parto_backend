import { useRouter } from "next/router";
import style from "../../styles/Home.module.css";
import Head from "next/head";

//get days between priod
export default function CycleLength() {
  const router = useRouter();
  return (
    <div className={style.container}>
      <Head>
        <title>مصاحبه</title>
      </Head>
      <div>?</div>
      <div>
        <p>میانگین فاصله دوره هایتان چند روز است؟</p>
        <p>(معمولا ۲۶ تا ۳۰ روز)</p>
      </div>
      <div>استپر روز</div>
      <br />
      <div>
        <a>فراموش کردم</a>
      </div>

      <div>
        <button
          onClick={() => {
            router.push("/interview/birth");
          }}
        >
          قبلی
        </button>
        <button
          onClick={() => {
            router.push("/interview/period-length");
          }}
        >
          بعدی
        </button>
      </div>
    </div>
  );
}
