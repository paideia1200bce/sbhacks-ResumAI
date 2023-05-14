const initialState = {
  users: [],
  activeSearch: "",
  chatbot: "active",
};

export default function searchResultsReducer(
  state = initialState,
  action: any
) {
  console.log("Current state:", state); // Log the current state
  console.log("Action:", action); // Log the received action
  switch (action.type) {
    case "SET_SEARCH_RESULTS":
      return {
        ...state,
        users: action.payload,
      };
    case "SET_ACTIVE_SEARCH":
      return {
        ...state,
        activeSearch: action.payload,
      };
    case "SET_CHATBOT":
      return {
        ...state,
        chatbot: action.payload,
      };
    default:
      return state;
  }
}
