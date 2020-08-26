import useSWR from "swr";
import { useDispatch, useSelector } from "react-redux";
import { SetToken } from "../../redux/actions/SetToken";

export default function SignUp(flag) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      phone: user.phone,
      name: user.username,
      password: user.password,
      imei: "",
    }),
  };
  const fetcher = (url) => fetch(url, options).then((r) => r.json());
  const { data, error } = useSWR(
    "https://api.partobanoo.com/user/signUp/fa",
    fetcher,
    // { suspense: true }
  );
  // if (data) console.log(data.message +data.id );
  // if (data) dispatch(SetToken(data.id));
  return { data, error };
}
