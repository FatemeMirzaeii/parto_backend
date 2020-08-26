import "../styles/globals.css";
import { Provider } from "react-redux";
import React from "react";
import withRedux from "next-redux-wrapper";
import { useStore } from "../redux/store";

export default function MyApp({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);
  return (
    <Provider store={store}>
      <Component {...pageProps} />;
    </Provider>
  );
}
