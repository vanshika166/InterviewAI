import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice.js'
import interviewSlice from './interviewSlice.js'


export default configureStore({
    reducer: {
        user: userSlice,
        interview:interviewSlice
    },
})