import { useRouter } from "next/router";
import style from "../../styles/Home.module.css";
import Head from "next/head";
//get date of user birthday
export default function Birth() {
  const router = useRouter();
  return (
    <div className={style.container}>
      <Head>
        <title>مصاحبه</title>
      </Head>
      <div>?</div>
      <div>
        <p>
          لطفا با وارد کردن تاریخ تولدت به ما در بالا بردن دقت تحلیل ها کمک کن
        </p>
      </div>
      <div>استپر تاریخ تولد</div>
      <br />
      <div>
        <a>بعدا وارد می کنم</a>
      </div>
      <div>
        <p>توجه</p>
        <p>
          دوست عزیز پرتو برای نوجوانان نسخه ی مناسب و جذابی دارد که می توانید آن
          را دانلود کنید.
        </p>
      </div>
      <div>
        <button
          onClick={() => {
            router.push("/interview/welcome");
          }}
        >
          قبلی
        </button>
        <button
          onClick={() => {
            router.push("/interview/cycle-length");
          }}
        >
          بعدی
        </button>
      </div>
    </div>
  );
}
