import { useState, useContext } from "react"
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
const Login = () => {
    const [emailId, setEmailId] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);
    async function login(e){
        e.preventDefault();
        const response = await fetch(import.meta.env.VITE_API_URL+'/login', {
            method: 'POST',
            body: JSON.stringify({emailId, password}),
            headers: {'Content-type':'application/json'},
            credentials: 'include',
        })
        if(response.ok){
            response.json().then(userInfo=>{
                setUserInfo(userInfo);
                setRedirect(true);
            })
        } else{
            alert('wrong credentials');
        }
    }
    if(redirect){
        return <Navigate to={'/about'} /> 
    } 
    return (
        <>
            <div className="bg-gradient-to-br from-[#FFECCB] via-[#FFD6A5] to-[#efcab6] h-[92.2vh] flex justify-center items-center">
               <form className="bg-gray-800 p-8 rounded-lg w-full max-w-md" onSubmit={login}>
                    <h1 className="text-2xl font-bold text-white mb-6 text-center">Login</h1>
                    <div className="login-input mb-4">
                        <label htmlFor="email" className="sr-only"></label>
                        <input
                            type="text" id="email" placeholder="Enter email" value={emailId} onChange={(e) => setEmailId(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD6A5]"
                        />
                    </div>
                    <div className="login-input mb-6">
                        <label htmlFor="login-password" className="sr-only"></label>
                        <input type="password" id="login-password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD6A5]"
                        />
                    </div>
                    <div className="flex justify-center">
                         <button className=" bg-[#FFD6A5] text-gray-900 font-semibold py-2 rounded-md p-2">
                        Login
                    </button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Login;
