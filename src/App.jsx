import './App.css'
import { useState, useEffect } from "react"


let divi = {
    2: [],
    3: [],
    4: []
}
let probs = Array(10000).fill(null).map(()=>[])
export default function App() {
    let [div, setDiv] = useState(2)
    let [pr, setPr] = useState('A')
    let [curP, currentProbs] = useState([])
    useEffect(()=>{
        fetch('https://codeforces.com/api/contest.list')
        .then((response)=>{
                return response.json()
        })
        .then((data) => {
                const contests = data.result
                contests.forEach((val)=>{
                    if (val.name[val.name.length-2]=='2'){
                        divi['2'].push(val.id)
                    }
                    else if (val.name[val.name.length-2]=='3'){
                        divi['3'].push(val.id)
                    }
                    else if (val.name[val.name.length-2]=='4'){
                        divi['4'].push(val.id)
                    }
                })
        })
        .catch(()=>{
                console.log("Error in loading Contests")
        })
        fetch('https://codeforces.com/api/problemset.problems')
        .then((response)=>{
                return response.json();
        })
        .then((data)=>{
                let problems = data.result.problems;
                problems.forEach((val)=>{
                    (probs[val.contestId]).push(val)
                })
        })
        .catch(()=>{
            console.log("Error in loading Problems")
        })

    },[])

    const handleSubmit = (ev)=>{
        ev.preventDefault();
        //div -> division,  pr -> problem index
        currentProbs(new Array())
        divi[div].forEach((val)=>{
            probs[val].forEach((p)=>{
                if (pr.includes(p.index))currentProbs(curP => [...curP,p])
            })
        })
    }

    const ProbCard = ({id, index, name}) => {
        return(
            <a href={`https://codeforces.com/contest/${id}/problem/${index}`} target='_blank'>
                <div className="bg-black w-80 p-10 mx-auto my-10 border-solid border-4 border-red-700 hover"> 
                        {`${id} ${index}. ${name}`}
                </div>
            </a>
        )
    }

    return (
    <>
            <h1 className='font-extrabold text-5xl underline mb-40 mt-10 text-red-600'>Codeforces Practice</h1>
            <form onSubmit={handleSubmit} className='text-2xl font-bold underline mb-30'>
                <select name="division" id="division" className='mb-20 mr-10'>
                    <option value="2" onClick={()=>{setDiv(2);console.log(divi)}}>Div. 2</option>
                    <option value="3" onClick={()=>{setDiv(3)}}>Div. 3</option>
                    <option value="4" onClick={()=>{setDiv(4)}}>Div. 4</option>
                </select>
                <select name="problem" id="problem" className='mb-20'>
                    <option value="a" onClick={()=>{setPr('A1A2A3')}}>A</option>
                    <option value="b" onClick={()=>{setPr('B1B2B3')}}>B</option>
                    <option value="c" onClick={()=>{setPr('C1C2C3')}}>C</option>
                    <option value="d" onClick={()=>{setPr('D1D2D3')}}>D</option>
                    <option value="e" onClick={()=>{setPr('E1F1G1H1E2F2G2H2')}}>E+</option>
                </select>
                <br/>
                <button type="submit" className='bg-black border-solid border-red-700 border-4 h-20 w-60 hover text-white font-bold py-2 px-4 rounded-full'>Get Problems</button>
            </form>

            {
                curP.map((val,idx)=>{
                    return(
                    <ProbCard key={idx} id={val.contestId} index={val.index} name={val.name} />
                    )
                })
            }
    </>
    )
}
