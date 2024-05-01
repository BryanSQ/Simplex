import { useSelector } from "react-redux"

import '../styles/Notification.css'

const Notification = () => {
  const notification = useSelector(state => state.notification.message)

  const style = {
    position: 'fixed',
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

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