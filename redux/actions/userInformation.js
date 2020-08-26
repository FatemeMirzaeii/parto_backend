export const USER_SIGNUP = "USER_SIGNUP";

//Action Creator
export const userSignup = (username, password, email, phone) => (dispatch) =>
  dispatch({
    type: USER_SIGNUP,
    payload: {
      username: username,
      email: email,
      phone: phone,
      password: password,
    },
  });
