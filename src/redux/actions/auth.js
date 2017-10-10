import axios from 'axios'
export const FETCH_PROFILE_PENDING = 'FETCH_PROFILE_PENDING'
export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS'

export const LOGIN_PENDING = 'LOGIN_PENDING'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
axios.defaults.baseURL = 'https://www.easy-mock.com/mock/59dc63fd1de3d46fa94cf33f/api'
export function login( user,password ){
    return {
        type: 'LOGIN_PENDING',
        payload: {
            promise: axios.post('/login',{
                data: {
                    user: user,
                    password: password
                }
            })
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