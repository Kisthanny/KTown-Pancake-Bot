import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Syrup from "./routes/Syrup";
import MyWallet from "./routes/MyWallet";
import MyTransfer from "./routes/MyTransfer";
import NotificationProvider from "./components/Notification/NotificationProvider";

ReactDOM.render(
  <NotificationProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
          <Route path="syrup" element={<Syrup />} />
          <Route path="wallet" element={<MyWallet />} />
          <Route path="transfer" element={<MyTransfer />} />
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
  </NotificationProvider>,
  document.getElementById('root')
);
