import Head from "next/head";
import { useRouter } from "next/router";
import style from "../../styles/Home.module.css";
//first step of interview
export default function Welcome() {
  const router = useRouter();
  return (
    <div className={style.container}>
      <Head>
        <title>مصاحبه </title>
      </Head>
      <div>خوش آمدی دوست عزیز</div>
      <div>به ما بگو در کدوم یکی از موارد زیر می تونیم به شما کمک کنیم.</div>
      <br />
      <button
        onClick={() => {
          router.push("/interview/birth");
        }}
      >
        <p>ثبت دوره</p>
        <p>تصمیم به بارداری ندارم</p>
      </button>
      <br />
      <button
        onClick={() => {
          router.push("/interview/birth");
        }}
      >
        <p>باردار هستم</p>
        <p>می خواهم شرایطم را ثبت کنم</p>
      </button>
      <br />
      <button
        onClick={() => {
          router.push("/interview/birth");
        }}
      >
        <p>تلاش برای بارداری</p>
        <p>بعضی روزها برایم مهم تر است</p>
      </button>
    </div>
  );
}
