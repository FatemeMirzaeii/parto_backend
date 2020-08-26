import useSWR from "swr";
import { useSelector } from "react-redux";

export default function GetVerify() {
  const user = useSelector((state) => state.user);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone: user.phone, email: user.email }),
  };
  const fetcher = (url) => fetch(url, options).then((r) => r.json());
  const { data, error } = useSWR(
    "https://api.partobanoo.com/auth/verifyCode",
    fetcher,
    // { suspense: true }
  );

  return { data, error };
}
