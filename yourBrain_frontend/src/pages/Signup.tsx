import { useRef } from "react"; 
import { Button } from "../components/Button"; 
import { Input } from "../components/Input"; 
import axios from "axios"; 
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";


export function Signup() {
//@ts-ignore
    const usernameRef = useRef<HTMLInputElement>(); 
    //@ts-ignore
    const passwordRef = useRef<HTMLInputElement>();

    
    const navigate = useNavigate();

  
    async function signup() {
        const username = usernameRef.current?.value; 
        console.log(usernameRef.current);
        const password = passwordRef.current?.value; 


        await axios.post(BACKEND_URL + "/api/v1/signup", {
            username, 
            password  
        });


        navigate("/signin");

        alert("You have signed up!");
    }

    return (
        <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
            <div className="bg-white rounded-xl border min-w-48 p-8">

                <Input reference={usernameRef} placeholder="Username" />
                
                
                <Input reference={passwordRef} placeholder="Password" />

                
                <div className="flex justify-center pt-4">
                    <Button onClick={signup} loading={false} variant="primary" text="Signup" fullWidth={true} />
                </div>
                <div className="flex justify-center pt-4">
                    <span className="text-sm text-gray-600">Already have an account? <Link to="/signin" className="text-purple-600 underline">Sign in</Link></span>
                </div>
            </div>
        </div>
    );
}