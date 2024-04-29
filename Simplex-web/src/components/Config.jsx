import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setVariables, setRestricciones, setTarget, setMethod } from '../reducers/configReducer'

// import '../styles/Config.css'

const Config = () => {

    const [selectedValue, setSelectedValue] = useState("max")
    const [simplexMethod, setSimplexMethod] = useState("simplex")

    const dispatch = useDispatch()

    const handleVariables = (e) => {
      dispatch(setVariables(e.target.value))
    }

    const handleRestricciones = (e) => {
      dispatch(setRestricciones(e.target.value))
    }

    const handleTarget = (e) => {
      setSelectedValue(e.target.value)
      dispatch(setTarget(e.target.value))
    }

    const handleMethod = (e) => {
      setSimplexMethod(e.target.value)
      dispatch(setMethod(e.target.value))
    }

    return (
      <section className='container'>
        <h2>Configuración</h2>
        <form>
          <div>
            <label htmlFor="select-Target">Objetivo:</label>
            <select id="select-Target" value={selectedValue} onChange={handleTarget}>
              <option value="max" >Maximizar</option>
              <option value="min">Minimizar</option>
            </select>
          </div>
          <div>
            <label htmlFor="method">Método:</label>
            <select id="method" value={simplexMethod} onChange={handleMethod}>
              <option value="simplex">Simplex</option>
              <option value="big-m">Gran M</option>
              <option value="two-phase">Dos Fases</option>
            </select>
          </div>
          <div>
            <label htmlFor="input-variables">Variables:</label>
            <input id="input-variables" type="number" min="1" onChange={handleVariables} />
          </div>
          <div>
            <label htmlFor="input-restricciones">Restricciones:</label>
            <input id="input-restricciones" type="number" min="1" onChange={handleRestricciones} />            
          </div>
        </form>
      </section>
    )
}

export default Config