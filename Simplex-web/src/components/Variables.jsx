import { useSelector, useDispatch } from "react-redux"
import { setVariables } from "../reducers/simplexReducer"

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
    <div>
      <h2>Variables</h2>
      <div>
        <form onSubmit={handleSubmit}>
        {
          Array.from({length: variables}, (_, i) => (
            
              <span key={i}>
                <label htmlFor={`input-x${i}`}>X{i + 1}:</label>
                <input id={`input-x${i}`} type="number" />
              </span>
          ))
        }
          <button type="submit">Guardar</button>
        </form>
      </div>
    </div>
  )
}

export default Variables