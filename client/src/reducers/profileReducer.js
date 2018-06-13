import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_PROFILES
} from "../actions/types";

const initialState = {
  loading: false,
  profile: null,
  profiles: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };
    case CLEAR_CURRENT_PROFILE:
      return {
        ...state,
        profile: null
      };
      case GET_PROFILES:
      return {
        ...state,
        loading: false,
        profiles: action.payload
      };
      case GET_PROFILE:
      return {
        ...state,
        loading: false,
        profile: action.payload
      };
    default:
      return state;
  }
}
