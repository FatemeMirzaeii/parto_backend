export default async function InterviewCheck(userId, tokenId) {
  const options = {
    method: "Get",
    headers: {
      "x-auth-token": tokenId,
    },
  };
  console.log("check "+userId + " " +tokenId)
  const url = "https://api.partobanoo.com/profile/" + userId + "/fa";
  var response;
  try {
    response = await fetch(url, options);
  } catch {
    return { status: 500 };
  }

  var status = response.status;
  var interviewFlag =false;
  if (status === 200) {
    var json = await response.json();
    console.log(json.data)
    if (json.data.birthdate === "") interviewFlag = false;
    interviewFlag = true;
    

  }

  return { status: status, interviewFlag:interviewFlag  };
}
