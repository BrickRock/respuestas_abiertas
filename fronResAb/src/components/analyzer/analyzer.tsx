import {useState, useEffect} from 'react'
import './analyzer.css'
import { ROUTES } from '../../routes.ts'



/*const sampleData: Data[] = [
    { id: '1', data: 'Ejemplo 1' },
    { id: '2', data: 'Ejemplo 2' },
    { id: '3', data: 'Ejemplo 3' },
    { id: '4', data: 'Ejemplo 4' },
    { id: '5', data: 'Ejemplo 5' },
];]*/
interface Data{
    data : string,
    id : string
}


function DisplayData({data} : {data: Array<Data>}){
    return(
        <div className='displayData'>
            {data.map(element => (
                <div className='displayData_data' key={element.id}>
                    {element.data}
                </div>
            ))}
        </div>
    )
}

interface ButtonTypeSampleProps {
    random: number;
    setRandom: (random: number) => void;
}

function ButtonTypeSample({ random, setRandom }: ButtonTypeSampleProps){
    return(
        <div className='buttonSample'>
            <button onClick={() => setRandom(1)} className={random === 1 ? 'active' : ''}>Aleatoria</button>
            <button onClick={() => setRandom(0)} className={random === 0 ? 'active' : ''}>Secuencial</button>
        </div>
    )
}

interface ButtonNavigateProps {
    page: number;
    pageSize: number;
    totalItems: number;
    setPage: (page: number) => void;
}

function ButtonNavigate({ page, pageSize, totalItems, setPage }: ButtonNavigateProps)
{
    const totalPages = Math.ceil(totalItems / pageSize);
    const [valueUserPage, setValue] = useState(1);

    return(
        <div>
            <button onClick={() => {setPage(prev => Math.max(1, prev - 1)); 
                setValue(page -1);
            }
            } disabled={page === 1}>Atras</button>
            <button onClick={() => {setPage(prev => Math.min(totalPages, prev + 1)); setValue(page +1);}} disabled={page === totalPages}>Siguiente</button>
            <p>
                <input type="text" value={valueUserPage} onChange={(e) => {
                    setValue(e.target.value);
                    setTimeout(()=>{
                    const newPage = parseInt(e.target.value);
                    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
                        setPage(newPage);
                        
                    }},500)
                    
                }}/> - {totalPages}
            </p>
        </div>
    )
}

const ButtonNewSampleRandom : any = ({setQuery, query} : {setQuery : any, query : boolean})=>{
    return (
        <button onClick={(e) => {
            setQuery(!query);
            console.log(query);
            
            }}>

            Otros datos
        </button>
    )
}

function DisplaySample(){
    const [sampleData, setSampleData] = useState<Data[]>([]);
    const [random, setRandom] = useState<number>(1); // 1 for random, 0 for paginated
    const [typeSample, setTypeSample] = useState<number>(0); // 0 - all data, 1 - category, 2 - current category
    const [sampleSize, setSampleSize] = useState<number>(10); // For random sampling
    const [category, setCategory] = useState<string | null>(null); // For category-based sampling
    const [page, setPage] = useState<number>(1); // For pagination
    const [pageSize, setPageSize] = useState<number>(10); // For pagination
    const [totalItems, setTotalItems] = useState<number>(0); // Total items for pagination
    const [query, setQuery] = useState(false);
    // Dummy user_id and graph_id for now, these should come from context or props
    const user_id = "1"; 
    const graph_id = "5";

    useEffect(() => {
        const fetchData = async () => {
            let url = `${ROUTES.sample}?user_id=${user_id}&graph_id=${graph_id}&sample=${typeSample}`;
            
            if (random === 1) {
                url += `&random=1&ss=${sampleSize}`;
            } else {
                url += `&random=0&page=${page}&page_size=${sampleSize}`;
            }

            if (typeSample === 1 && category) {
                url += `&category=${category}`;
            }

            try {
                let response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                let dataJson = await response.json();
                console.log(dataJson)
                setSampleData(dataJson.data);
                // Assuming the API returns total items for pagination, if not, we might need another endpoint or calculate it
                // For now, let's assume the API returns a 'total' field in the response for paginated data
                if (dataJson.total_items) { // Assuming the backend sends total_items
                    setTotalItems(dataJson.total_items);
                } else {
                    setTotalItems(dataJson.data.length); // Fallback if total_items is not provided
                }
            } catch (error) {
                console.error("Error fetching sample data:", error);
                setSampleData([]);
                setTotalItems(0);
            }
        };
        fetchData();
    }, [random, typeSample, sampleSize, category, page, pageSize, user_id, graph_id, query]) // Dependencies for useEffect
    
    return (
        <div className='Sample'>
            <h1>Selecciona un dato</h1>
            <ButtonTypeSample random={random} setRandom={setRandom} />
            <DisplayData data={sampleData} />
            {random === 0 && ( // Only show navigation buttons if in paginated mode
                <ButtonNavigate page={page} pageSize={sampleSize} totalItems={totalItems} setPage={setPage} />
            )}
            {random === 1 && (<ButtonNewSampleRandom setQuery={setQuery} query={query}/>)}
        </div>
    )
}

function SectionGraph() {
    return(
        <section className='graph'>
        </section>
    )
}


function SectionDesk() {
    return(
        <section className='desk'>
            <DisplaySample />
        </section>
    )
}

export function Analyzer() {
    

    return(
        <div className='analyzer'>
            <SectionGraph />
            <SectionDesk />
        </div>

    )
}

