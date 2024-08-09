import { Outlet } from "react-router-dom";
import NavBar from "./compoments/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <div className="p-5 h-screen">
        <Outlet />
      </div>
    </>
  );
}

export default App;
