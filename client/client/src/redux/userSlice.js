import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        loading:true,
    },
    reducers:{
        setUserData:((state,action)=>{
            state.userData = action.payload
        }),
         setLoading: (state, action) => {
      state.loading = action.payload;
    }
    }
})

export const {setUserData,setLoading} = userSlice.actions;

export default userSlice.reducer;