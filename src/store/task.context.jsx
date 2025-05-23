import React, { createContext, useContext, useState } from 'react'
import { createTasks, GetAllTask } from '../api/task_api'

  const TaskContext = createContext()
 export const TaskProvider = ({children}) => { 
   const [task, setTask] = useState([]) 
   const [loading, setLoading]= useState(false)
  //  console.log("task", task)
  



  const createTask  =  async(payload) => {
    const response =  await createTasks(
    {title:payload.title,
    description:payload.description,
    due_date:payload.due_date,
    priority:payload.priority,
    status:payload.status,
    category:payload.category}) 
   return response
  }


   const  getAllTask = async() => {
    try {
        setLoading(true)
      const response = await GetAllTask()
      console.log(response.data, "response task" )
      setTask(response.data)
     return response
      
    } catch (error) {
       console.log("error", error)
    }finally{
       setLoading(false)
    }
   }  
  return (
    <TaskContext.Provider value={{createTask , getAllTask,loading ,task }}>
      {children}
    </TaskContext.Provider>
  )
}

 export const useTask = () => {
     const context = useContext(TaskContext)
     if(!context){
    throw new Error("useAuth must be used within an AuthProvider");    
     }
   return context
 }
