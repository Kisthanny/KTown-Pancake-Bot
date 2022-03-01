import { init } from "./Web3Client";
import { NavBar } from "./components/NavBar";
import { Outlet } from "react-router-dom";
import Web3 from "web3";
const web3 = new Web3(window.ethereum)

function App() {
  //localStorage.removeItem('public_address')
  init()

  return (
    <div className="App">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default App;
