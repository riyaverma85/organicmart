import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Topnav from "./components/Topnav";
import "./css/layout.css"
import Header from "./components/Header";
const Layout=()=>{
    return(
        <>
          <Header/>
          <Topnav/>
          <div id="outlet">
            <Outlet/>
          </div>
          
          <Footer/>
        </>
    )
}
export default Layout;