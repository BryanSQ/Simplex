import { useSelector, useDispatch } from "react-redux"
import { setVariables } from "../reducers/simplexReducer"

import '../styles/Variables.css'

const Variables = () => {
  const dispatch = useDispatch()

  const variables = useSelector(state => state.config.variables)

  const handleSubmit = (e) => {
    e.preventDefault()
    // get data from inputs
    const inputs = Array.from(e.target.elements)
    inputs.pop()

    const variables = []
    inputs.forEach((input, key) => {
      let var_object = {}
      var_object[`x${key+1}`] = input.value
      variables.push(var_object)
    })
    
    dispatch(setVariables(variables))

  }

  return (
    <div id="variables-container">
      <h2>Variables</h2>
      <div>
        <form onSubmit={handleSubmit}>
        {
          Array.from({length: variables}, (_, i) => (
            
              <span key={i}>
                <input id={`input-x${i}`} type="number" />
                <label htmlFor={`input-x${i}`}>X{i + 1}</label>
              </span>
          ))
        }
        <div>
          <button type="submit">Guardar</button>
        </div>
        </form>
      </div>
    </div>
  )
}

export default Variables