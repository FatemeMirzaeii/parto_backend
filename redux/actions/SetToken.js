export const SET_TOKEN = "SET_TOKEN";

//Action Creator
export const SetToken = (tokenId) => (dispatch) =>
  dispatch({
    type: SET_TOKEN,
    payload: {
      tokenId: tokenId,
    },
  });
