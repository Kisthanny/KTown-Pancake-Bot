import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Syrup from "./routes/Syrup";
import MyWallet from "./routes/MyWallet";
import MyTransfer from "./routes/MyTransfer";
import Intro from "./routes/Intro";
import NotificationProvider from "./components/Notification/NotificationProvider";
import MyTest from "./routes/Test";
import { Provider } from "react-redux";
import store from "./state/store";

ReactDOM.render(
  <NotificationProvider>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} >
            <Route path="home" element={<Intro />} />
            <Route path="syrup" element={<Syrup />} />
            <Route path="wallet" element={<MyWallet />} />
            <Route path="transfer" element={<MyTransfer />} />
            <Route path="test" element={<MyTest />} />
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </NotificationProvider>,
  document.getElementById('root')
);

