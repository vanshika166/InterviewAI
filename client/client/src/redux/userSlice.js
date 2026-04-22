import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        loading:true,
        userCredits:null
    },
    reducers:{
        setUserData:((state,action)=>{
            state.userData = action.payload
        }),
         setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserCredits:((state,action)=>{
        state.userCredits = action.payload;
    })
    }
})

export const {setUserData,setLoading,setUserCredits} = userSlice.actions;

export default userSlice.reducer;