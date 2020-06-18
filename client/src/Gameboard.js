import React, {useState,useEffect} from 'react';
import './App.css';

const GameBoard=()=>{
    //this creates a 3 by 3 array/game board
    const [piece, setPiece]= useState([]);
    let arr=Array.from({length:3},(v,i)=>Array(3).fill(i))
    console.log(arr)

    useEffect(()=>{
        console.log('effect acticated')

        for(let i=0;i<arr.length;i++){
            
            for(let j=0;j<arr[i].length;j++){
                
                setPiece(piece=>[...piece,arr[i][j]])
            }
        }
    },[])



    const handleChange=(e)=>{
        console.log(e.target.value)
        let [value]=[e.target]
        console.log(value)
        // setPiece(=>[...piece,e.target.value])
    }

    return(
        <div className="main">
                {arr.map((columns,index)=>{
                    return(
                        <div>
                             <form className='columns'>
                                {arr[index].map((values,rows)=>{
                                return(<div className='rows' key={[index,rows]}>
                                        
                                                <input value={[index,rows]}
                                                        type='text'
                                                        onChange={handleChange}
                                                    >
                                                
                                                </input> 
                                            
                                            
                                        </div>)
                                })}
                            </form>
                        </div>
                    )
                })}
        </div>

      )
    
  }


  export default GameBoard;

//   {columns.map(rows)=>{
//     return(<div className='row'>
//         number, {rows}
//     </div>)
// }}