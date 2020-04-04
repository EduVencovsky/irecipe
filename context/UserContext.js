import React, { useState } from 'react'
import PropTypes from 'prop-types'

export const UserContext = React.createContext({})

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
