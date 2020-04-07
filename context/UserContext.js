import React, { useState } from 'react'
import PropTypes from 'prop-types'

export const UserContext = React.createContext({})

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null)

  const getUserFullName = () => `${user.firstname} ${user.lastname}`

  const getUserAvatarText = () => user.firstname[0] + user.lastname[0]

  return (
    <UserContext.Provider
      value={{ user, setUser, getUserFullName, getUserAvatarText }}>
      {children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
