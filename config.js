const serverVars = {
    authUrl: 'local_auth_url',
    apiUrl: 'https://xender-app.herokuapp.com/api/',
};

const localVars = {
    authUrl: 'local_auth_url',
    apiUrl: 'http://192.168.33.8:8000/api/',
};

export function getConfiguration() {
    if (process.env.NODE_ENV === 'production') {
        return serverVars;
    }

    return localVars;
}

export const tbusersURL = 'tbusers' 
export const xwardamaniakans = 'xwardamaniakans' 
export const pswlas = 'pswlas' 
export const kwrses = 'kwrses' 
export const subpswlas = 'subpswlas' 
