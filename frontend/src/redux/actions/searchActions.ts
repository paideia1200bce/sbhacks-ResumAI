export const setSearchResults = (users: any) => ({
  type: "SET_SEARCH_RESULTS",
  payload: users,
});

export const setActiveSearch = (searchType: string) => {
  return {
    type: "SET_ACTIVE_SEARCH",
    payload: searchType,
  };
};

export const setChatbotStatus = (chatbot: string) => {
  return {
    type: "SET_CHATBOT",
    payload: chatbot,
  };
};

export const setSearchType = (searchType: string) => {
  return {
    type: "SET_ACTIVE_SEARCH",
    payload: searchType,
  };
};
