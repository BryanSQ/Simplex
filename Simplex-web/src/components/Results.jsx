import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Results = () => {

  const [showResults, setShowResults] = useState(false);

  const results = useSelector((state) => state.table.results);

  useEffect(() => {
    if (results.BVS.length) {
      setShowResults(true);
    }
  }, [results]);



  if (!showResults) {
    return null;
  }

  return (
    <div>
      <h2>Resultados</h2>
      <table>
        <thead>
          <tr>
            <th>BVS</th>
            <th>RHS</th>
          </tr>
        </thead>
        <tbody>
          {results.BVS.map((item, key) => (
            <tr key={key}>
              <td>{item}</td>
              <td>{results.RHS[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}

export default Results;