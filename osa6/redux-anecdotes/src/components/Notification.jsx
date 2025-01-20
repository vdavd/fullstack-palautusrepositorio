
import { useSelector } from 'react-redux'

const Notification = () => {

  const { notification, visibility} = useSelector(state => state.notification)
  console.log(notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    visibility: visibility
  }
  return (
    <div style={style}>

      {notification}
    </div>
  )
}

export default Notification