import React, { createContext, useContext, useState } from 'react'
import { createAppointment, getAllAppointments, updateAppointment as updateAppointmentAPI, deleteAppointment as deleteAppointmentAPI } from '../api/appointment_api'

const AppointmentContext = createContext()

export const AppointmentProvider = ({children}) => { 
  const [appointments, setAppointments] = useState([]) 
  const [loading, setLoading] = useState(false)

  const createAppointmentAction = async(payload) => {
    const response = await createAppointment({
      title: payload.title,
      description: payload.description,
      date: payload.date,
      start_time: payload.start_time,
      end_time: payload.end_time,
      meeting_link: payload.meeting_link,
      via_email: payload.via_email,
      via_app: payload.via_app,
      before_value: payload.before_value,
      before_unit: payload.before_unit,
      related_task_id: payload.related_task_id
    }) 
    return response
  }

  const updateAppointmentAction = async(id, payload) => {
    const response = await updateAppointmentAPI(id, {
      title: payload.title,
      description: payload.description,
      date: payload.date,
      start_time: payload.start_time,
      end_time: payload.end_time,
      meeting_link: payload.meeting_link,
      via_email: payload.via_email,
      via_app: payload.via_app,
      before_value: payload.before_value,
      before_unit: payload.before_unit,
      related_task_id: payload.related_task_id
    });
    return response;
  }

  const deleteAppointmentAction = async(id) => {
    const response = await deleteAppointmentAPI(id);
    return response;
  }

  const getAllAppointmentsAction = async() => {
    try {
      setLoading(true)
      const response = await getAllAppointments()
      console.log(response.data, "response appointments" )
      setAppointments(response.data)
      return response
    } catch (error) {
      console.log("error", error)
    } finally {
      setLoading(false)
    }
  }  

  return (
    <AppointmentContext.Provider value={{
      createAppointment: createAppointmentAction, 
      updateAppointment: updateAppointmentAction, 
      deleteAppointment: deleteAppointmentAction, 
      getAllAppointments: getAllAppointmentsAction, 
      loading, 
      appointments 
    }}>
      {children}
    </AppointmentContext.Provider>
  )
}

export const useAppointment = () => {
  const context = useContext(AppointmentContext)
  if(!context){
    throw new Error("useAppointment must be used within an AppointmentProvider");    
  }
  return context
}
