import { useSelector } from "react-redux"

import '../styles/Notification.css'

const Notification = () => {
  const notification = useSelector(state => state.notification.message)

  if (notification === null) {
    return null
  }

  return (
    <div className="container notification-container">
      {notification}
    </div>
  )
}

export default Notification