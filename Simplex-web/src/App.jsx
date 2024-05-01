import Notification from "./components/Notification"
import Config from "./components/Config"
import Inputs from "./components/Inputs"
import Table from "./components/Table"

import './App.css'

function App() {


  return (
    <div id="main-frame">
      <h1>Simplex</h1>
      <Notification />
      <Config />
      <Inputs />
      <Table />
    </div>
  )
}

export default App
