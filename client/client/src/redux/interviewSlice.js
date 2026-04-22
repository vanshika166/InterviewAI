import { createSlice } from "@reduxjs/toolkit";

export const interviewSlice = createSlice({
    name:"interview",
    initialState:{
        interviewStats:null,
        interviewList:null
    },
    reducers:{
        setInterviewStats:((state,action)=>{
            state.interviewStats = action.payload
        }),
        setInterviewList:((state,action)=>{
            state.interviewList = action.payload
        })
    }
})

 export const {setInterviewStats,setInterviewList} = interviewSlice.actions;

export default interviewSlice.reducer;