import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import {Analyzer,ListGraphs} from './components/index.ts'


function App() {
  const [ page, setPage] = useState(1);
  const [ graph, setGraph] = useState(0);


  return (
      <div>
          {page === 1 && (<ListGraphs user_id={1} setPage={setPage} setGraph={setGraph}/>)}
          {page === 2 && (<Analyzer graph={graph} setPage={setPage}/>)}
      </div>  
  )
}

export default App
