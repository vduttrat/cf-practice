import './App.css'
import { useState, useEffect } from "react"

let handle = 'vduttrat'

let divi = {
    2: [],
    3: [],
    4: []
}
let accepted = [];
let probs = Array(10000).fill(null).map(()=>[])

export default function App() {
    let [div, setDiv] = useState(2)
    let [pr, setPr] = useState('A')
    let [curP, currentProbs] = useState([])
    useEffect(()=>{
        async function fn(){
            await fetch(`https://codeforces.com/api/user.status?handle={handle}`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                data.result.forEach((val)=>{
                    if (val.verdict=='OK') accepted.push(JSON.stringify(val.problem))
                })
            })
            .catch(error => {
                console.log("error")
            }
            )

            await fetch('https://codeforces.com/api/contest.list')
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

            await fetch('https://codeforces.com/api/problemset.problems')
                .then((response)=>{
                    return response.json();
                })
                .then((data)=>{
                    let problems = data.result.problems;
                    problems.forEach((val)=>{
                        if (!accepted.includes(JSON.stringify(val))) (probs[val.contestId]).push(val)
                    })
                })
                .catch(()=>{
                    console.log("Error in loading Problems")
                })
        }
        fn();
    },[])
    const handleSubmit = (ev)=>{
        ev.preventDefault();
        //div -> division,  pr -> problem index
        currentProbs(new Array())
        divi[div].forEach((val)=>{
            probs[val].forEach((p)=>{
                if (pr.includes(p.index)){
                    currentProbs(curP => [...curP,p])
                }
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
                <select name="division" id="division" className='mb-20 mr-10' onChange={(ev)=>setDiv(ev.target.value)}>
                    <option value="2" className="bg-black text-amber-50">Div. 2</option>
                    <option value="3" className="bg-black text-amber-50">Div. 3</option>
                    <option value="4" className="bg-black text-amber-50">Div. 4</option>
                </select>
                <select name="problem" id="problem" className='mb-20' onChange={(ev)=>setPr(ev.target.value)}>
                    <option value='A1A2A3' className="bg-black text-amber-50">A</option>
                    <option value='B1B2B3' className="bg-black text-amber-50">B</option>
                    <option value='C1C2C3' className="bg-black text-amber-50">C</option>
                    <option value='D1D2D3' className="bg-black text-amber-50">D</option>
                    <option value='E1E2' className="bg-black text-amber-50">E</option>
                    <option value='F1G1H1F2G2H2' className="bg-black text-amber-50">F+</option>
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
