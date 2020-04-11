import axios from 'axios'

export const getMeasurements = async () => {
  return axios.get('http://127.0.0.1:3000/api/measurement')
}

export const getMeasurementById = async (_id) => {
  return axios.get(
    'http://127.0.0.1:3000/api/measurement' + (_id ? `/${_id}` : ''),
  )
}
