import { useSelector, useDispatch } from "react-redux"
import { setRestrictions } from "../reducers/simplexReducer"
import Simplex from "../simplex"

import '../styles/Restrictions.css'

const Restrictions = () => {
  const dispatch = useDispatch()

  const restricciones = useSelector(state => state.config.restricciones)
  const variables = useSelector(state => state.config.variables)


  const handleSubmit = (e) => {
    e.preventDefault()
    // get data from inputs
    const inputs = Array.from(e.target.elements)
    inputs.pop()

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

  return (
    <div id="restrictions-container">
      <h2>Restricciones</h2>
      <div>
        <form onSubmit={handleSubmit}>
          {
            Array.from({ length: restricciones }, (_, i) => (
              <span key={i} className="restriction-row">
                {
                  Array.from({ length: variables }, (_, j) => (
                    <span key={j} className="restriction-item">
                      <input id={`input-restriccion-${i}-${j}`} type="number" />
                      <label htmlFor={`input-restriccion-${i}-${j}`}>X{j + 1}</label>
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
          <div>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Restrictions
