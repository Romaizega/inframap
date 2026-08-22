import api from "./axios"

export const register = async(

    email: string,
    password: string,
    username: string,
    first_name: string,
    last_name: string
) => {
    const result = await api.post('/auth/register', {
        email,
        password,
        username,
        first_name,
        last_name
        })
        return result.data
}

export const login = async(email:string, password: string) => {
    const result = await api.post('/auth/login', {email, password})
    return result.data

}


export const getMe = async (token:string) => {
    const result = await api.get('/auth/me', {
        headers: {Authorization: `Bearer ${token}`}
    })
    return result.data
}