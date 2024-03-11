import { useDispatch } from 'react-redux'
import { setVariables, setRestricciones, setObjetivo } from '../reducers/configReducer'

const Config = () => {
    const dispatch = useDispatch()


    const handleVariables = (e) => {
      dispatch(setVariables(e.target.value))
    }
    const handleRestricciones = (e) => {
      dispatch(setRestricciones(e.target.value))
    }

    const handleObjetivo = (e) => {
      dispatch(setObjetivo(e.target.value))
    }

    return (
        <section>
            <h1>Config</h1>
            <form>
              <div>
                <label htmlFor="input-variables">Variables:</label>
                <input id="input-variables"  type="number" min="1" onChange={handleVariables}/>
              </div>
              <div>
                <label htmlFor="input-restricciones">Restricciones:</label>
                <input id="input-restricciones" type="number" min="1" onChange={handleRestricciones}/>
              </div>
              <div>
                <label htmlFor="select-objetivo">Objetivo:</label>                
                <select id="select-objetivo" onChange={handleObjetivo}>
                  <option value="max">Maximizar</option>
                  <option value="min">Minimizar</option>
                </select>
              </div>
            </form>
        </section>
    )
}

export default Config