import '../styles/Table.css'
import { useSelector } from 'react-redux'

const Table = () => {
    // llena data de informacion de una matrix de simplex
    const header = useSelector((state) => state.table.header)
    const BVS = useSelector((state) => state.table.BVS) 
    const data = useSelector((state) => state.table.matrix)
   
    return (
        <table>
        <thead>
            <tr>
            {header.map((item, key) => (
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
    )
}

export default Table