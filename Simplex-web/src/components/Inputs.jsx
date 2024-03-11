import { useSelector } from "react-redux"
import Restrictions from "./Restrictions"

const Inputs = () => {
  const variables = useSelector(state => state.config.variables)
  const objetivo = useSelector(state => state.config.objetivo)

  return (
    <div>
      Inputs
      <div>
        {
          Array.from({length: variables}, (_, i) => (
            <div key={i}>
              <label htmlFor={`input-x${i}`}>X{i + 1}:</label>
              <input id={`input-x${i}`} type="number" />
            </div>
          ))
        }
      </div>
      <div>
        <Restrictions />
      </div>
      <p>Objetivo: {objetivo}</p>
    </div>
  )
}

export default Inputs