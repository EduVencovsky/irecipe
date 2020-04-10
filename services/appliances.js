import axios from 'axios'

export const getAppliancesList = async (name, top = 10) => {
  return axios.get(
    `http://127.0.0.1:3000/api/appliance/list?name=${name}&top=${top}`,
  )
}

export const getAppliancesById = async (_id) => {
  return axios.get(
    'http://127.0.0.1:3000/api/appliance' + (_id ? `/${_id}` : ''),
  )
}

export const updateUserAppliances = async (userId, appliances) => {
  return axios.put(`http://127.0.0.1:3000/api/user/appliances/${userId}`, {
    appliances,
  })
}
