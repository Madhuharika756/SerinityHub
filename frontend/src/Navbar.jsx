import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "./UserContext"

// import { motion } from "framer-motion";
const Navbar = () => {
    const {setUserInfo, userInfo} = useContext(UserContext);
    useEffect(()=>{
        fetch(import.meta.env.VITE_API_URL+'/profile',{
            credentials: 'include',
        }).then(response=>{
            response.json().then(userInfo=>{
                setUserInfo(userInfo);
            });
        })
    }, []);
    function logout(){
        fetch(import.meta.env.VITE_API_URL+'/logout', {
            method: 'POST',
            credentials: 'include',
        }).then(()=>{
            setUserInfo(null);
            navigate('/');
        })
    }

    const navigate = useNavigate();
    const emailId = userInfo?.emailId;

    return (
        <>
            <div className="flex items-center justify-between py-2 bg-transparent px-5">
                <h1 className="text-4xl font-semibold  text-white drop-shadow-lg">
                    Serenity<span className="text-[#FFD6A5]">Hub</span>
                </h1>
                <ul className="flex gap-8 text-xl ml-4 text-gray-200 font-semibold">
                  <Link to={"/about"} ><li className="hover:text-[#fecb8d] transition transform hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer">About</li></Link>
                  <Link to={"/moodTrackerPage"}>
                    <li className="hover:text-[#fecb8d] transition transform hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer">Mood Trcker</li>
                  </Link>
                    <li className="hover:text-[#fecb8d] transition transform hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer">Recommendations</li>
                  <Link to={"/chat"} ><li className="hover:text-[#fecb8d] transition transform hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer">Chat</li></Link> 
                    {emailId && (
                        <>
                            {/* {emailId} */}
                            <a onClick={logout} className="hover:text-[#fecb8d] transition transform hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer">
                                <button>Logout</button>
                            </a>
                        </>
                    )}
                    {!emailId && (
                        <>
                            <Link to={"/register"}><li className="hover:text-[#fecb8d] transition transform hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer">Register</li></Link>
                        </>
                    )}
                    
                    {/* <li className="hover:text-[#fecb8d] transition transform hover:-translate-y-1 hover:scale-110 duration-300 cursor-pointer">Profile</li> */}
                </ul>
            </div>

        </>

    )
}

export default Navbar;