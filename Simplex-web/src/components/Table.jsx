import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { resetTable } from '../reducers/tableReducer'
import '../styles/Table.css'

const Table = () => {

    const dispatch = useDispatch()

    const [showTable, setShowTable] = useState(false)
    const [currentStep, setCurrentStep] = useState(0) // 0
    const [data, setData] = useState([])

    const header = useSelector((state) => state.table.header)
    const fullHeader = ['i', 'BVS', ...header, "RHS"]
    let steps = useSelector((state) => state.table.steps)

    useEffect(() => {
        if (steps.length > 0) {
            setShowTable(true)
            setData(steps)
        }
    }, [steps])


    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const reset = () => {
        setCurrentStep(0)
        setShowTable(false)
        setData([])
        dispatch(resetTable())
    }

    if (!showTable) {
        return null
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        {fullHeader.map((item, key) => (
                            <th key={key}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data[currentStep].map((row, key) => (
                        <tr key={key}>
                            {row.map((item, key) => (
                                <td key={key}>{item}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button onClick={prevStep}>
                    Anterior
                </button>
                <button onClick={nextStep}>
                    Siguiente
                </button>
                <div>
                    <p>Paso {currentStep + 1} de {steps.length}</p>
                </div>
                <button onClick={reset}>
                    Reiniciar
                </button>
            </div>
        </div>
    )
}

export default Table