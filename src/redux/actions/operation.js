import axios from 'axios'
export const OPERATION_ADD_PENDING = 'OPERATION_ADD_PENDING'
export const OPERATION_ADD_SUCCESS = 'OPERATION_ADD_SUCCESS'
export const OPERATION_DELETE_PENDING = 'OPERATION_DELETE_PENDING'
export const OPERATION_DELETE_SUCCESS = 'OPERATION_DELETE_SUCCESS'
export const OPERATION_UPDATE_PENDING = 'OPERATION_UPDATE_PENDING'
export const OPERATION_UPDATE_SUCCESS = 'OPERATION_UPDATE_SUCCESS'
export const OPERATION_SELECT_PENDING = 'OPERATION_SELECT_PENDING'
export const OPERATION_SELECT_SUCCESS = 'OPERATION_SELECT_SUCCESS'

export function add (url,params){
    return {
        type: 'OPERATION_ADD_PENDING',
        payload: {
            promise: axios.post(url,params)
        }
    }
}

export function addSuccess(data){
    return {
        type: 'OPERATION_ADD_SUCCESS',
        payload: {
            data
        }
    }
}

export function Delete(url,params){
    return {
        type: 'OPERATION_DELETE_PENDING',
        payload: {
            promise: axios.delete(url,params)
        }
    }
}

export function deleteSuccess(data){
    return {
        type: '',
        payload: {
            data
        }
    }
}

export function update(url,params){
    return {
        type: 'OPERATION_UPDATE_PENDING',
        payload: {
            promise: axios.put(url,params)
        }
    }
}

export function updateSuccess(data){
    return {
        type: 'OPERATION_UPDATE_SUCCESS',
        payload: {
            data
        }
    }
}


export function select(url,params){
    return {
        type: 'OPERATION_SELECT_PENDING',
        payload: {
            promise: axios.get(url,params)
        }
    }
}

export function selectSuccess(data){
    return {
        type: 'OPERATION_SELECT_SUCCESS',
        payload: {
            data
        }
    }
}