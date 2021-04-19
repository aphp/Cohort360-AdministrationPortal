import axios from 'axios'

import { BACK_API_URL } from '../constants'

import { Authentication } from '../types'

export const authenticate = async (username: string, password: string): Promise<Authentication> => {

    const baseURL = BACK_API_URL

    return axios({
        method: 'POST',
        url: `${baseURL}/accounts/login/`,
        data: { username: username, password: password }
    })
}