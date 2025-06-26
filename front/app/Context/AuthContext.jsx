'use client'
import axios from "axios"
import { createContext, useContext, useEffect, useState } from "react"
import getData from "../utils/getData"
export const AuthContext = createContext()
import { toast, ToastContainer } from "react-toastify"
import swal from "sweetalert"
import io from "socket.io-client"
export const AuthContextProvider = ({ children }) => {
    const [users, setUsers] = useState([])
    const [user, setUser] = useState({})
    const [userToken, setUserToken] = useState(null)
    const [isLogin, setIsLogin] = useState(false)
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const login = (email , password) => { 
        axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/login` , {email , password}).then((res) => {
            setUser(res.data)
            localStorage.setItem("user" ,JSON.stringify(res.data))
            localStorage.setItem("loginState" , "true")
            toast.success("Login Success")
            setTimeout(() => {
                window.location.href = "/"
            },2000)
        }).catch(err => {
            console.log(err)
        })
    }
    // Logout Function
    const Logout = () => {
        swal({
            title: "Are you sure?",
            text: "You are go to logout from your account !",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(willLogout => {    
                if (willLogout) {
                    setUser(null)
                    localStorage.removeItem('user')
                    localStorage.removeItem('loginState')
                    window.location.href = "/Pages/Login"
                    disconnectSocket()
                }
            })
            .catch(err => toast.error("Logout Failed"))
    }
    // Create New User Function
    const registerNewUser = async (username, email, password) => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/register`, {
                username,
                email,
                password,
            });
            swal("Good job!", res.data.message, "success");
            setTimeout(() => {
                window.location.href = "/Pages/Login";
            }, 2000);
        } catch (err) {
            swal("Oops!", err.response.data.message, "error");
        }
    }
    useEffect(() => {
        getData("auth" , setUsers)
    },[users])
    const followUser = (id) => {
        axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/follow/${id}` , {} , {headers : {authorization : `Bearer ${user.token}`}})
            .then(res => {
                toast.success(res.data.message)
            })
            .catch(err => {
                toast.error(err.response.data.message)
            })
    }
    const updatePhoto = async(photo) => {
        const formData = new FormData()
        formData.append('image' , photo)
        await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/photo`, formData,
            {
                headers:
                {
                    authorization: `Bearer ${user?.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                toast.success("Photo Updated Successfully")
                localStorage.setItem("user" , JSON.stringify({...user , profilePhoto : res.data}))
                window.location.reload()
            })
            .catch(err => {
                toast.error(err.response.data.message)
            })
    }
    const savePost = async (id) => {
        await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/save/${id}` , {} , {headers : {authorization : `Bearer ${user.token}`}})
            .then((res) => {
                toast.success(res.data.message);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const updateProfile = async (fields) => {
        const payload = {
          username: fields.username ?? user.username,
          description: fields.description ?? user.description,
          profileName: fields.profileName ?? user.profileName
        }
        try {
          const res = await axios.put(
            `${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/update`,
            payload,
            {
              headers: {
                authorization: `Bearer ${user.token}`
              }
            }
          )
      
          // دمج بيانات المستخدم الجديدة مع التوكن القديم
          const updatedUser = {
            ...res.data,      // بيانات المستخدم الجديدة من السيرفر
            token: user.token // حافظ على التوكن القديم
          }
      
          toast.success("Profile Updated Successfully.")
      
          localStorage.setItem("user", JSON.stringify(updatedUser))
          setUser(updatedUser)
          window.location.reload()
        } catch (err) {
          console.log(err)
          toast.error("Failed to update profile.")
        }
    }
    const updatePassword = async (password) => {
        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/update/pass` , {password} , {headers : {authorization : `Bearer ${user.token}`}})
            toast.success(res.data.message)
        } catch (err) {
            console.log(err)
        }
    }
    const pinPost = async (id) => {
        try {
            const res = await axios.put(`${process.env.NEXT_PUBLIC_BACK_URL}/api/auth/pin/${id}` , {} , {headers : {authorization : `Bearer ${user.token}`}})
            toast.success(res.data.message)
        } catch (err) {
            console.log(err)
        }
    }
    const connectSocket = (user) => {
        if (!user || socket?.connected) return;

        const Newsocket = io(`${process.env.NEXT_PUBLIC_BACK_URL}`, {
            query: {
                userId: user._id,
            },
        });

        Newsocket.on("connect", () => {
            console.log("Socket connected");
        });

        Newsocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });

        setSocket(Newsocket);
    };
    const disconnectSocket = () => {
        if (socket?.connected) socket.disconnect();
    };
    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) {
            const parsedUser = JSON.parse(user);
            setUser(parsedUser)
            connectSocket(parsedUser)
        }
    }, [])
    useEffect(() => {
        const storedState = localStorage.getItem("loginState");
        if (storedState === "true") {
            setIsLogin(true)
        }
        else {
            setIsLogin(false)
        }
    },[])
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                className="custom-toast-container"
                toastClassName="custom-toast"
            />
            <AuthContext.Provider value={{
                login,
                userToken,
                isLogin,
                user,
                registerNewUser,
                Logout,
                users,
                followUser,
                updatePhoto,
                savePost,
                updateProfile, updatePassword, pinPost, onlineUsers
            }}>
                {children}
            </AuthContext.Provider>
        </>
    )
}

// export default AuthContextProvider
export const useAuth = () => {
    return useContext(AuthContext)
}