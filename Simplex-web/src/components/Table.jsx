import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import '../styles/Table.css'

const Table = () => {

    const [showTable, setShowTable] = useState(false)

    const [steps, setSteps] = useState(undefined) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    const [currentStep, setCurrentStep] = useState(0) // 0
    const [data, setData] = useState(undefined) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9

    // llena data de informacion de una matrix de simplex
    const header = useSelector((state) => state.table.header)
    const fullHeader = ['BVS',...header, "RHS"]
    const BVS = useSelector((state) => state.table.BVS)
    const matrix =useSelector((state) => state.table.matrix)    
    //data = data[data.length - 1]


    useEffect(() => {
        if (header.length > 0 && BVS.length > 0 && matrix.length > 0){   
            console.log(BVS);
            setSteps(matrix)
            setData(matrix[0].map((row, i) => [i, BVS[i], ...row]))
            setShowTable(true)
        }
        
    }, [matrix, BVS, header])


    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
            setData(steps[currentStep])
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
            setData(steps[currentStep])
        }
    }

    const reset = () => {
        setCurrentStep(0)
        setData(steps[0])
        setShowTable(false)
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
                {data.map((row, key) => (
                    <tr key={key}>
                        {row.map((item, key) => (
                            <td key={key}>{item}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
            <div style={{display: "flex", justifyContent:"space-between"}}>
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