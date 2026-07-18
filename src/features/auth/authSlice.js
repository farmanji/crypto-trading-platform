import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user:null,
    token:null,
    isAuthenticated:false
}
const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        login:(state,action)=>{
            state.user=action.payload.user;
            state.token=action.payload.token;
            state.isAuthenticated=true;
        },
        logout:(state,action)=>{
            state.user=null;
            state.token=null;
            state.isAuthenticated=false;
        },
        setUser:(state,action)=>{
            state.user=action.payload;
        }

    }

})
export const {login, logout,setUser} = authSlice.actions;
export default authSlice.reducer;