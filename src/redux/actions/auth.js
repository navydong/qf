import axios from 'axios'
import qs from 'qs'
export const FETCH_PROFILE_PENDING = 'FETCH_PROFILE_PENDING'
export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS'

export const LOGIN_PENDING = 'LOGIN_PENDING'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

export function login( user,password ){
    return {
        type: 'LOGIN_PENDING',
        payload: {
            promise: axios.post('http://192.168.103.199:8765/api/jwt/auth',qs.stringify({ 'username': user ,"password": password}))
            //promise: axios.post('http://192.168.103.199:8765/login',qs.stringify({ 'username': user ,"password": password}))
        }
    }
}

export function logout( ){
    return {
        type: 'LOGOUT',
        payload: {
            promise: axios.get('/logout')
        }
    }
}

export function loginSuccess( data ){
    return {
        type: 'LOGIN_SUCCESS',
        payload: {
            data
        }
    }
}