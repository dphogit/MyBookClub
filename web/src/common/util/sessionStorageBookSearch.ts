import { SearchedSessionStorage } from "../types";

const KEY = "searched";

export const getSearchedSessionStorage = () => {
  return sessionStorage.getItem(KEY);
};

export const setSearchedSessionStorage = (data: SearchedSessionStorage) => {
  sessionStorage.setItem(KEY, JSON.stringify(data));
};

export const clearSearchedSessionStorage = () => {
  sessionStorage.removeItem(KEY);
};
