import { createContext, useEffect } from "react";
export const AppContext = createContext();
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin]=useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [credit,setCredit]=useState(false)


    const backendUrl = 'http://localhost:4000'

    const navigate = useNavigate()

    const loadCreditsData=async()=>{
        try{
            const {data}=await axios.get(backendUrl+'/api/user/credits',{
                headers:{token}
            })
            if(data.success){
                setCredit(data.credits)
                setUser(data.user)
            }
        }catch(error){
            (error)
            toast(error.message)
        }
    }

    const generateImage=async(prompt)=>{
        try{
           const {data} = await axios.post(backendUrl+'/api/image/generate-image',{prompt},{headers:{token}})

           if(data.success){
            loadCreditsData()
            return data.resultImage
           }else{
            toast.error(data.message)
            loadCreditsData()
            if(data.creditBalance===0){
                navigate('/buy')
            }
           }
        }catch(error){
            toast.error(error.message)
        }
    }

    const logout = ()=>{
        setToken('')
        setUser(null)
        localStorage.removeItem('token')
    }

    useEffect(()=>{
        if(token){
            loadCreditsData()
        }
    },[token])

    const value= {
        user,setUser,showLogin,setShowLogin,backendUrl,token,setToken,credit,setCredit,loadCreditsData,logout,generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;