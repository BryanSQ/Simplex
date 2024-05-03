import { useDispatch, useSelector } from "react-redux"
import { setRestrictions, setUnrestricted, setVariables } from "../reducers/simplexReducer"
import { setNotification } from "../reducers/notificationReducer"
import { setMethod } from "../reducers/configReducer"
import Simplex from "../simplex/simplex"

import '../styles/Inputs.css'

const Inputs = () => {
  const dispatch = useDispatch()
  const variables = useSelector(state => state.config.variables)
  const restricciones = useSelector(state => state.config.restricciones)

  const method = useSelector(state => state.config.method)

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

    const comparisons = []

    const rests = []
    let k = 0
    for (let i = 0; i < restricciones; i++) {
      const rest = {}
      for (let j = 0; j < Number(variables) + 2; j++) {
        if (inputs[k].value === '>=' || inputs[k].value === '<=' || inputs[k].value === '=') {
          rest['comp'] = inputs[k].value
          comparisons.push(inputs[k].value)
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
    return comparisons
  }

  const handleCheck = (checks) => {
    const inputs = checks
    const checked = []
    inputs.forEach((input, key) => {
      if (input.checked) {
        checked.push({ [`x${key + 1}`]: 1 })
      }
      else {
        checked.push({ [`x${key + 1}`]: 0 })
      }
    })
    dispatch(setUnrestricted(checked))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // filter inputs to get variables and restrictions
    const inputs = Array.from(e.target.elements)
      .filter(input => input.id.includes('input-x') || input.id.includes('input-restriccion')
        || input.id.includes('select') || input.id.includes('input-res')
        || input.id.includes('check-x'))

    // get variables
    const variables = inputs.filter(input => input.id.includes('input-x'))

    // get restrictions
    const rests = inputs.filter(input => input.id.includes('input-restriccion') || input.id.includes('select') || input.id.includes('input-res'))

    // get checks
    const checks = inputs.filter(input => input.id.includes('check-x'))
    handleVariablesSubmit(variables)
    const comps = handleRestrictionsSubmit(rests)
    handleCheck(checks)
    lockMethod(comps)
    Simplex()
  };

  const lockMethod = (comps) => {
    const rests = comps.length

    let lower = 0
    let equal = 0
    let greater = 0

    comps.forEach(comp => {
      if (comp === '<=') {
        lower++
      }
      else if (comp === '>=') {
        greater++
      }
      else {
        equal++
      }
    })

    if (lower === rests) {
      if (method !== 'simplex') {
        dispatch(setMethod('simplex'))
        dispatch(setNotification('Se ha cambiado el método a Simplex', 5000))
      }
    }
    else if (greater > 0 || equal > 0) {
      if (method === 'simplex') {
        dispatch(setMethod('two-phase'))
        dispatch(setNotification('Se ha cambiado el método a Dos Fases. Puede seleccionar Gran M también.', 5000))
      }
    }
  }

  return (
    ((restricciones.length > 0) && (variables.length > 0)) && (
      <div>
        <form onSubmit={handleSubmit}>

          <div className="container">
            <h2>Variables: {variables}</h2>
            <div className="item-container">
              <div className="flex-container items-row">
                {
                  Array.from({ length: variables }, (_, i) => (
                    <span key={i} className="item">
                      <input id={`input-x${i}`} type="number"/>
                      <label htmlFor={`input-x${i}`}>
                        X<sub>{i + 1}</sub>
                      </label>
                      {i < variables - 1 ? ' +' : ''}
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
                          <label htmlFor={`input-restriccion-${i}-${j}`}>
                            X<sub>{j + 1}</sub>
                          </label>
                          {j < variables - 1 ? ' +' : ''}
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
          </div>

          <div className="container">
            <h2>Variables libres</h2>
            <div className="check-container">
              {
                Array.from({ length: variables }, (_, i) => (
                  <span key={i} className="check-row">
                    <label htmlFor={`check-x${i + 1}`}>X<sub>{i + 1}</sub></label>
                    <input type='checkbox' id={`check-x${i + 1}`} />
                  </span>
                ))
              }
            </div>
          </div>

          <div className="button-container">
            <button type="submit">Iniciar</button>
          </div>
        </form>
      </div>
    )
  );
}

export default Inputs
