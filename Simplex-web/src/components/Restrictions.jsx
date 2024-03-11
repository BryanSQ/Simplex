import { useSelector } from "react-redux"

const Restrictions = () => {
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
        else if (j === Number(variables) + 1){
          rest['res'] = inputs[k].value
        }
        else{
          console.log({k});
          rest[`x${j + 1}`] = inputs[k].value        
        }
        k++
      }
      rests.push(rest)
      console.log('---');
    }
    console.log(rests)
    const values = inputs.map(input => input.value)
    console.log(values)
  }

  return (
    <div>
      <h1>Restricciones</h1>
      <div>
        <form onSubmit={handleSubmit}>
        {
          Array.from({length: restricciones}, (_, i) => (
            <div key={i}>
              {
                Array.from({length: variables}, (_, j) => (
                  <div key={j}>
                    <label htmlFor={`input-restriccion-${i}-${j}`}>X{j + 1}:</label>
                    <input id={`input-restriccion-${i}-${j}`} type="number" />
                  </div>
                ))
              }
              <select id={`select-${i}`}>
                <option value="<=">{"<="}</option>
                <option value=">=">{">="}</option>
                <option value="=">{"="}</option>
              </select>
              <input type="number" id={`input-res${i+1}`}/>              
            </div>            
          ))          
        }
        <button type="submit">Enviar</button>
        </form>   
      </div>
    </div>
  )
}

export default Restrictions
