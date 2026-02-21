import {React, useEffect, useState} from 'react'
import {ROUTES} from '../../routes.ts'

interface optionGraphsProps{
    graphs : Array<{name : string, id : string | number, date : any}>
    setPage : (value : number)=> void,
    setGraph : (value : number | string)=> void,
}

const OptionGraphs : React.FC = ({graphs, setGraph, setPage} : optionGraphsProps)=> {
    
    const handlerClick = (e)=> {
        console.log(e.target.value);
        setGraph(e.target.value);
        setPage(2);
    }

    return (
        <div>
            {graphs.sort((a,b)=> b.date - a.date).map((graph)=> (
                <button value={graph.id} onClick={handlerClick}>{graph.name}</button>
            ))}
        </div>
    )
}

export const ListGraphs : React.FC= ({user_id= 1, setPage, setGraph} : any)=> {
    const [graphs, setGraphs] = useState([]);
    useEffect(()=> {
        const getGraphs = async ()=> {
            const response = await fetch(`${ROUTES.get_graphs}?user_id=${user_id}`);
            const data = await response.json();
            setGraphs(data);
            console.log(data);
        }
        getGraphs();
    },[]);

    return (

        <div>
            <button>Nuevo Análisis</button>
            <OptionGraphs graphs={graphs} setGraph={setGraph} setPage={setPage}/>
        </div>
    )
}