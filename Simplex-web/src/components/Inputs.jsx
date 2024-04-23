import { useDispatch, useSelector } from "react-redux"
import { setRestrictions, setVariables } from "../reducers/simplexReducer"
import Simplex from "../simplex/simplex"

import '../styles/Inputs.css'

const Inputs = () => {
  const dispatch = useDispatch()
  const variables = useSelector(state => state.config.variables)
  const restricciones = useSelector(state => state.config.restricciones)
  const target = useSelector(state => state.config.target)

  const handleVariablesSubmit = (vars) => {
    // get data from inputs
    const inputs = vars

    const variables = []
    inputs.forEach((input, key) => {
      let var_object = {}
      var_object[`x${key + 1}`] = input.value
      variables.push(var_object)
    })
    dispatch(setVariables(variables))
  }

  const handleRestrictionsSubmit = (restrictions) => {
    // get data from inputs
    const inputs = restrictions

    const rests = []
    let k = 0
    for (let i = 0; i < restricciones; i++) {
      const rest = {}
      for (let j = 0; j < Number(variables) + 2; j++) {
        if (inputs[k].value === '>=' || inputs[k].value === '<=' || inputs[k].value === '=') {
          rest['comp'] = inputs[k].value
        }
        else if (j === Number(variables) + 1) {
          rest['res'] = inputs[k].value
        }
        else {
          rest[`x${j + 1}`] = inputs[k].value
        }
        k++
      }
      rests.push(rest)
    }
    //console.log(rests)
    dispatch(setRestrictions(rests))
    Simplex()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // filter inputs to get variables and restrictions
    const inputs = Array.from(e.target.elements)
      .filter(input => input.id.includes('input-x') || input.id.includes('input-restriccion') || input.id.includes('select') || input.id.includes('input-res'))

    // get variables
    const variables = inputs.filter(input => input.id.includes('input-x'))

    // get restrictions
    const rests = inputs.filter(input => input.id.includes('input-restriccion') || input.id.includes('select') || input.id.includes('input-res'))

    handleVariablesSubmit(variables)
    handleRestrictionsSubmit(rests)
  };


  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>

          <div className="container">
            <h2>Variables: {variables}</h2>
            <div className="item-container">
              <div className="flex-container items-row">
              {                
                Array.from({ length: variables }, (_, i) => (
                  <span key={i} className="item">
                    <input id={`input-x${i}`} type="number" />
                    <label htmlFor={`input-x${i}`}>X<sub>{i + 1}</sub></label>
                  </span>
                ))
              }
              </div>
            </div>
          </div>

          <div className="container">
            <h2>Restricciones: {restricciones}</h2>
            <div className="item-container">
              {
                Array.from({ length: restricciones }, (_, i) => (
                  <span key={i} className="flex-container items-row">
                    {
                      Array.from({ length: variables }, (_, j) => (
                        <span key={j} className="item">
                          <input id={`input-restriccion-${i}-${j}`} type="number" />
                          <label htmlFor={`input-restriccion-${i}-${j}`}>X<sub>{j + 1}</sub></label>
                        </span>
                      ))
                    }
                    <select id={`select-${i}`} className="equality">
                      <option value="<=">{"<="}</option>
                      <option value=">=">{">="}</option>
                      <option value="=">{"="}</option>
                    </select>
                    <input type="number" id={`input-res${i + 1}`} />
                  </span>
                ))
              }
            </div>
            <div className="button-container">
              <button type="submit">Iniciar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Inputs
