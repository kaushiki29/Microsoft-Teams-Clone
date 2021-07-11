//Backend connection

export const api = process.env.REACT_APP_DJANGO_URL? process.env.REACT_APP_DJANGO_URL : 'https://www.msteams.games:9000/';
export const socketUrl = process.env.REACT_APP_SOCKET_URL? process.env.REACT_APP_SOCKET_URL: 'https://www.msteams.games:5000';