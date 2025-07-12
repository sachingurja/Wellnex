import React, { useContext, useEffect, useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const Login = () => {

//   const navigate=useNavigate()

//   const {backendUrl, token, setToken}=useContext(AppContext)

//   const [state, setState] = useState('Sign Up')

//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const[showpassword,setShowPassword]=useState(false);

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();

//     try{
//         if(state=='Sign Up'){
//           const {data}=await axios.post(backendUrl+'/api/user/register',{name,email,password})
//           if(data.success){
//             localStorage.setItem('token',data.token)
//             setToken(data.token)
//           }else{
//             toast.error(data.message)
//           }
//         }
//         else{
//           const {data}=await axios.post(backendUrl+'/api/user/login',{email,password})
//           if(data.success){
//             localStorage.setItem('token',data.token)
//             setToken(data.token)
//           }else{
//             toast.error(data.message)
//           }
//         }
//     }catch(error){
//         toast.error(error.message)
//     }

//   }

//   useEffect(()=>{
//     if(token){
//       navigate('/')
//     }

//   },[token])

//   return (
//     <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
//       <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
//         <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
//         <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
//         {state === 'Sign Up'
//           ? <div className='w-full '>
//             <p>Full Name</p>
//             <input onChange={(e) => setName(e.target.value)} value={name} className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" required />
//           </div>
//           : null
//         }
//         <div className='w-full '>
//           <p>Email</p>
//           <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" required />
//         </div>
//         <div className='w-full '>
//           <p>Password</p>
//           <div className='relative'>
//             <input
//               onChange={(e) => setPassword(e.target.value)}
//               value={password}
//               className='border border-zinc-300 rounded w-full p-2 mt-1 pr-10'
//               type={showpassword ? 'text' : 'password'}
//               required
//             />
//             <span
//               className='absolute right-3 top-[50%] translate-y-[-50%] text-xl cursor-pointer text-zinc-600'
//               onClick={() => setShowPassword(!showpassword)}
//             >
//               {showpassword ? <FaRegEyeSlash /> : <FaRegEye />}
//             </span>
//           </div>
//         </div>  
//         <div className='w-full'>
//         <button type='submit' className='bg-primary text-white w-full py-2  mt-3 mb-4 rounded-md text-base'>{state === 'Sign Up' ? 'Create account' : 'Login'}</button>
//         {state === 'Sign Up'
//           ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
//           : <p>Create an new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
//         }
//       </div>
//       </div>
//     </form>
//   )
// }

// export default Login

const Login = () => {
  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // NEW:
  const [step, setStep] = useState('form') // 'form' or 'otp'
  const [otp, setOtp] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === 'Sign Up') {
        if (step === 'form') {
          // Register & send otp
          const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
          if (data.success) {
            toast.success("OTP sent to your email")
            setStep('otp')
          } else {
            toast.error(data.message)
          }
        } else if (step === 'otp') {
          // Verify OTP
          const { data } = await axios.post(backendUrl + '/api/user/verify-otp', { email, otp, password, name })
          if (data.success) {
            localStorage.setItem('token', data.token)
            setToken(data.token)
            toast.success("Registered successfully")
            navigate('/')
          } else {
            toast.error(data.message)
          }
        }
      } else {
        // Login flow
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        {state === 'Sign Up' && step === 'otp'
          ? <p>Enter the OTP sent to your email</p>
          : <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
        }

        {state === 'Sign Up' && step === 'form' && (
          <>
            <div className='w-full'>
              <p>Full Name</p>
              <input onChange={(e) => setName(e.target.value)} value={name} className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" required />
            </div>
            <div className='w-full'>
              <p>Email</p>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" required />
            </div>
            <div className='w-full'>
              <p>Password</p>
              <div className='relative'>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className='border border-zinc-300 rounded w-full p-2 mt-1 pr-10'
                  type={showPassword ? 'text' : 'password'}
                  required
                />
                <span
                  className='absolute right-3 top-[50%] translate-y-[-50%] text-xl cursor-pointer text-zinc-600'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
              </div>
            </div>
          </>
        )}

        {state === 'Sign Up' && step === 'otp' && (
          <div className='w-full'>
            <p>OTP</p>
            <input onChange={(e) => setOtp(e.target.value)} value={otp} className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" required />
          </div>
        )}

        {state === 'Login' && (
          <>
            <div className='w-full'>
              <p>Email</p>
              <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" required />
            </div>
            <div className='w-full'>
              <p>Password</p>
              <div className='relative'>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className='border border-zinc-300 rounded w-full p-2 mt-1 pr-10'
                  type={showPassword ? 'text' : 'password'}
                  required
                />
                <span
                  className='absolute right-3 top-[50%] translate-y-[-50%] text-xl cursor-pointer text-zinc-600'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
              </div>
            </div>
          </>
        )}

        <div className='w-full'>
          <button type='submit' className='bg-primary text-white w-full py-2 mt-3 mb-4 rounded-md text-base'>
            {state === 'Sign Up'
              ? (step === 'otp' ? 'Verify OTP' : 'Create Account')
              : 'Login'}
          </button>
          {state === 'Sign Up'
            ? <p>Already have an account? <span onClick={() => { setState('Login'); setStep('form') }} className='text-primary underline cursor-pointer'>Login here</span></p>
            : <p>Create a new account? <span onClick={() => { setState('Sign Up'); setStep('form') }} className='text-primary underline cursor-pointer'>Click here</span></p>
          }
        </div>
      </div>
    </form>
  )
}

export default Login