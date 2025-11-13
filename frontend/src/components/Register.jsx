import { useState } from "react";
import { Link, Navigate } from "react-router-dom"
const Register = () => {
    const [username, setUsername] = useState('');
    const [emailId, setEmailId] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function register(e){
        e.preventDefault();
        const response = await fetch(import.meta.env.VITE_API_URL+'/register', {
            method: 'POST',
            body: JSON.stringify({username, emailId, password}),
            headers: {'Content-type':'application/json'},
        })
        if(response.status ===200){
            setRedirect(true);
            alert('registration successful');
        }else{
            alert('registration failed');
        }
    }
    if(redirect){
        return <Navigate to={'/login'} /> 
    }

    return (
        <>
            <div className="bg-[#FFD6A5] h-[92.2vh] flex justify-center items-center">
               <form className="bg-gray-800 p-8 rounded-lg w-full max-w-md" onSubmit={register}>
                    <h1 className="text-2xl font-bold text-white mb-6 text-center">Register</h1>
                    <div className="login-input mb-4">
                        <label htmlFor="username" className="sr-only"></label>
                        <input
                            type="text" id="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD6A5]"
                        />
                    </div>
                    <div className="login-input mb-4">
                        <label htmlFor="emailId" className="sr-only"></label>
                        <input
                            type="text" id="emailId" placeholder="Enter email" value={emailId} onChange={(e) => setEmailId(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD6A5]"
                        />
                    </div>
                    <div className="login-input mb-6">
                        <label htmlFor="password" className="sr-only"></label>
                        <input type="password" id="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#FFD6A5]"
                        />
                    </div>
                    <div className="flex justify-center">
                         <button className=" bg-[#FFD6A5] text-gray-900 font-semibold py-2 rounded-md p-2">
                        Register
                    </button>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Already have an account?</h2>
                        <div className="flex justify-center">
                         <button className=" bg-[#FFD6A5] text-gray-900 font-semibold py-2 rounded-md p-2">
                            <Link to={'/login'}>Sign In </Link>
                        </button>
                    </div>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Register;
