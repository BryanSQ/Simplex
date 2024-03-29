import { useSelector } from "react-redux"
import Restrictions from "./Restrictions"
import Variables from "./Variables"

const Inputs = () => {
  const objetivo = useSelector(state => state.config.objetivo)

  return (
    <div>      
      <div>
        <Variables />
      </div>
      <div>
        <Restrictions />
      </div>
      <p>Objetivo: {objetivo}</p>
    </div>
  )
}

export default Inputs