import { Link } from "react-router-dom";

// import { motion } from "framer-motion";
const Navbar = () => {
    return (
        <>
            <div className="flex items-center justify-between py-2 bg-transparent px-5">
                <h1 className="text-4xl font-semibold  text-white drop-shadow-lg">
                    Serenity<span className="text-[#FFD6A5]">Hub</span>
                </h1>
                <ul className="flex gap-8 text-xl ml-4 text-gray-200 font-semibold">
                  <Link to={"/about"} ><li className="hover:text-[#fecb8d] transition transform hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer">About</li></Link>
                    <li className="hover:text-[#fecb8d] transition transform hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer">Recommendations</li>
                    <li className="hover:text-[#fecb8d] transition transform hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer">Survey</li>
                    <li className="hover:text-[#fecb8d] transition transform hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer">Chat</li>
                    <Link to={"/login"}><li className="hover:text-[#fecb8d] transition transform hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer">Login</li></Link>
                    {/* <li className="hover:text-[#fecb8d] transition transform hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer">Profile</li> */}
                </ul>
            </div>

        </>

    )
}

export default Navbar;