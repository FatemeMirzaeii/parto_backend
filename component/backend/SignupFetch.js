import useSWR from "swr";
import { useDispatch, useSelector } from "react-redux";
import { SetToken } from "../../redux/actions/SetToken";

export default async function SignupFetch(user) {
  //   const user = useSelector((state) => state.user);
  //   const dispatch = useDispatch();
  //   console.log(user);
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
  const url = "https://api.partobanoo.com/user/signUp/fa";
  var response;
  try {
    response = await fetch(url, options);
  } catch {
    return { status: 500 };
  }
  var tokenId;
  var userId;
  var status = response.status;
  if (status === 200) {
    tokenId = response.headers.get("x-auth-token");
    var json = await response.json();
    userId =json.data.id
    // console.log("up:"+userId)
  }

  return { status: status, tokenId: tokenId, userId: userId };
}
