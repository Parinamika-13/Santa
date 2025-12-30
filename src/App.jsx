import { BrowserRouter, Routes, Route } from "react-router-dom";
import SnowBackground from "./components/SnowBackground";

import Dashboard from "./pages/Dashboard";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import RoomLobby from "./pages/RoomLobby";
import Memories from "./pages/Memories";
import Results from "./pages/Results";
import Suggestions from "./pages/Suggestions";

export default function App() {
  return (
    <BrowserRouter>
      <SnowBackground />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/room/:id" element={<RoomLobby />} />
        <Route path="/results" element={<Results />} />
        <Route path="/memories" element={<Memories />} />
        <Route path="/suggestions" element={<Suggestions />} />
      </Routes>
    </BrowserRouter>
  );
}
