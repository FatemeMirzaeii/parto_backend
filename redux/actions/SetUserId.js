export const SET_USERID = "SET_USERID";

//Action Creator
export const SetUserId = (userId) => (dispatch) =>
  dispatch({
    type: SET_USERID,
    payload: {
      userId: userId,
    },
  });
