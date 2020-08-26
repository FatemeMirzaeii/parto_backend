export default async function SigninFetch(email, phone, pass) {
  
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      phone: phone,
      password: pass,
    }),
  };
  const url = "https://api.partobanoo.com/auth/signIn/fa";
  var response;
  try {
    response = await fetch(url, options);
  } catch {
    return { status: 500 };
  }

  var status = response.status;
  var tokenId;
  var userId;
  if (status === 200) {
    tokenId = response.headers.get("x-auth-token");
    var json = await response.json();
    userId = json.data.id
    // console.log(userId + " " +tokenId)
  }

  return { status: status, tokenId: tokenId, userId: userId };
}
