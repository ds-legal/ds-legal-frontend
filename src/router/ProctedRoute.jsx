import React from 'react'
import { UseAuth } from '../store/auth.context'
import { Navigate } from 'react-router-dom';

const ProctedRoute = ({children}) => {
const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if(!token && !user){
    return <Navigate to="/login" replace/>
  }
 
  return  children
}

export default ProctedRoute
