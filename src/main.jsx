import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import RoomTable from "./components/RoomTable.jsx";
import RoomList from "./components/RoomList.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster />
      <ChatProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/room" element={<RoomTable />} />
          <Route path="/room/list" element={<RoomList />} />
          <Route path="*" element={<h1>404 Page not found!!</h1>} />
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  </StrictMode>
);
