import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login"
import Success from "./pages/Success";
import Logout from "./pages/Logout"
import Post from "./pages/Post"

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<Success />} />
        <Route path="/logout" element={<Logout/>}/>
        <Route path="/post" element={<Post/>}/>
      </Routes>
    </>
  );
}

export default App;
