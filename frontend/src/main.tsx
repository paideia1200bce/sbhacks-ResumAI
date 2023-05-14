import React from "react";
import loadable from "@loadable/component";
import "./styles/transitions.css";

import ReactDOM from "react-dom/client";
//import { createRoot } from "react-dom";
import App from "./App";
import FeedbackView from "./components/Feedback";
import Uploader from "./components/Uploader";
import Layout from "./components/Layout";
import About from "./components/About";

import client from "./apollo-client";
import { BrowserRouter, Routes } from "react-router-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "@apollo/client";
import { BrowserRouter as Router, Route, Outlet } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  /*trying out different navbar views*/
  <Provider store={store}>
    <BrowserRouter>
      <ApolloProvider client={client as ApolloClient<any>}>
        <React.StrictMode>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Layout>
                    <Outlet />
                  </Layout>
                </>
              }
            >
              <Route index element={<App />} />
              <Route path="/upload" element={<Uploader />} />
              {/* <Route path="/feedback" element={<FeedbackView />} /> */}
              <Route path="/about" element={<About />} />
            </Route>
          </Routes>
        </React.StrictMode>
      </ApolloProvider>
    </BrowserRouter>
  </Provider>
);
