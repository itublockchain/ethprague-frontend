import { EthyleneProvider } from "ethylene/utils";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "store";
import "styles/index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <EthyleneProvider>
        <App />
      </EthyleneProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
