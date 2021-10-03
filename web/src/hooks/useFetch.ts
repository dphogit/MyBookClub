import { useEffect, useReducer, useRef } from "react";

type Cache<T> = { [url: string]: T };

interface State<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

type Action<T> =
  | { type: "START" }
  | { type: "FINISH"; payload: T }
  | { type: "ERROR"; payload: Error };

const useFetch = <T>(url: string) => {
  const cache = useRef<Cache<T>>({});

  const initialState: State<T> = {
    isLoading: false,
    data: null,
    error: null,
  };

  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case "START":
        return { ...initialState };
      case "FINISH":
        return { ...initialState, data: action.payload };
      case "ERROR":
        return { ...initialState, error: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    let cancel = false;
    if (!url) {
      return;
    }

    const fetchData = async () => {
      dispatch({ type: "START" });

      if (cache.current[url]) {
        const data = cache.current[url];
        dispatch({ type: "FINISH", payload: data });
        return;
      }

      try {
        const response = await fetch(url);
        const data: T = await response.json();
        cache.current[url] = data;

        if (cancel) {
          return;
        }

        dispatch({ type: "FINISH", payload: data });
      } catch (error) {
        if (cancel) {
          return;
        }

        dispatch({ type: "ERROR", payload: error as Error });
      }
    };

    fetchData();

    return () => {
      cancel = true;
    };
  }, [url]);

  return { state };
};

export default useFetch;
