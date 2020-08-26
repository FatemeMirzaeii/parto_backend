import { combineReducers } from "redux";
import { USER_SIGNUP } from "../actions/userInformation";
import { SET_TOKEN } from "../actions/SetToken";
import { SET_USERID } from "../actions/SetUserId";

const initialUser = {
 
  birthdate: "",
  avg_cycle_length: 0,
  avg_period_length: 0,
  avg_sleeping_hour: 0,
  pms_length: 0,
  height: 0,
  weight:0,
  pregnant: 0,
  pregnancy_try: 0,
  use_lock: 0,

  // email: { key: "email", value: "" },
  // phone: { key: "phone", value: "" },
  // password: { key: "password", value: "" },
  // username: { key: "username", value: "" },
  email: "",
  phone: "",
  username: "",
  password: "",

  tokenId: "",
  userId:"",
};

export const userReducer = (state = initialUser, { type, payload }) => {
  switch (type) {
    case USER_SIGNUP:
      return {
        ...state,
        email: payload.email,
        username: payload.username,
        phone: payload.phone,
        password: payload.password,
      };
    case SET_TOKEN:
      return {
        ...state,
        tokenId: payload.tokenId,
      };
    case SET_USERID:
      return {
        ...state,
        userId: payload.userId,
      };
    default:
      return state;
  }
  // return { ...state };
};

const reducers = {
  user: userReducer,
};

export default combineReducers(reducers);
