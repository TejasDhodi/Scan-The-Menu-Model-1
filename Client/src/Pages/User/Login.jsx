import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import {useDispatch} from 'react-redux'
import { saveAuthToken } from '../../Features/AuthSlice';

const Login = () => {

  const [loginInputs, setLoginInputs] = useState({
    email: '',
    password: '',
    enteredOtp: ''
  });

  const [showVerification, setShowVerification] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [authToken, setAuthToken] = useState('');


  const handleLoginInputs = (e) => {
    const { value, name } = e.target;
    setLoginInputs({
      ...loginInputs,
      [name]: value
    });
  }

  const dispatch = useDispatch();


  // To Send Otp
  const handleSendOtp = async () => {
    try {
      const response = await axios.post('https://scan-the-menu.onrender.com/api/v1/sendmail', { email: loginInputs.email }, {
        headers: {
          "Content-Type": 'application/json'
        }
      })

      if (response.status === 200) {
        setShowVerification(true);
        alert('Otp Sent')
      }
    } catch (error) {
      console.log('Error While Sending Otp To Mail');
    }
  }

  // To Verify Otp
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('https://scan-the-menu.onrender.com/api/v1/sendmail/verify', {
        email: loginInputs.email,
        enteredOtp: Number(loginInputs.enteredOtp)
      });

      const data = response.data;

      if (response.status === 200) {
        alert('Email Verified');
        setAuthToken(data?.token)
        setShowInputs(true);
        setShowVerification(false)
      }

    } catch (error) {
      console.log('Unable to verify otp : ', error);
    }
  }

  const handleLoginUser = async (e) => {
    try {
      e.preventDefault();

      const response = await axios.post('https://scan-the-menu.onrender.com/api/v1/login', loginInputs, {
        headers: {
          "Content-Type": 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      })

      const data = response.data;
      console.log('Auth Token : ', data?.token);

      if(response.status === 200) {
        alert('Login SuccessFull');
        dispatch(saveAuthToken(data?.token))
      }

    } catch (error) {
      console.log('Unable to login user');
    }
  }

  return (
    <main className='formContainer'>
      <form className='form login' onSubmit={handleLoginUser}>
        <div className={showVerification ? "inputField loginInputField hideInputField" : "inputField loginInputField"}>
          <div className="authHeader linkIcons">
            <FaUserCircle />
            <h3>Login</h3>
          </div>

          <div className="inputFields">
            <div className="inputs">
              <label htmlFor="email">Email Id</label>
              <div className="emailVal">
                <input type="email" name="email" id="email" value={loginInputs.email} onChange={handleLoginInputs} placeholder='Enter Your Email Id' autoFocus />
                {
                  showInputs ?
                    <span>✅</span> :
                    <button onClick={handleSendOtp}>{showVerification ? 'Resend' : 'Get Otp'}</button>
                }
              </div>
              {
                showVerification &&
                <div className="emailVal otpVal">
                  <input type="text" name="enteredOtp" id="enteredOtp" value={loginInputs.enteredOtp} onChange={handleLoginInputs} autoFocus />
                  <button onClick={handleVerifyOtp}>Verify</button>
                </div>
              }
            </div>

            {
              showInputs &&
              <div className="inputs">
                <label htmlFor="password">Password</label>
                <input type="password" name='password' id='password' value={loginInputs.password} onChange={handleLoginInputs} />
              </div>

            }
          </div>

          <div className="controls">
            <button type='submit' className='btn'>Login</button>
          </div>

          <div className="askAccount">
            <p>Don't have an Account?? <NavLink to='/signup'>Click Here</NavLink> </p>
          </div>
        </div>

      </form>
    </main>
  )
}

export default Login
