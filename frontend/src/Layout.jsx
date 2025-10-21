import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
    return (
        <>
            <div className="backGroundImage">

                <Navbar />
                <Outlet/>
            </div>
        </>
    )
}

export default Layout;