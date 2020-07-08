import React, {useState,useEffect} from 'react';
import './App.css';

const GameBoard=()=>{
    //this creates a 3 by 3 array/game board
    
    // const 
    let arr=Array.from({length:2},(v,i)=>Array(9).fill(undefined))
    let [piece, setPiece]= useState(arr);

    useEffect(()=>{

        console.log('effect acticated')
        
      
    },piece)


    const onKeyPress=(e)=>{
        
        let id=e.target.id;
        let key=e.key;
        let row=id[0];
        let column=id[2];

        console.log(id,key)
        let regex='^([1-9])$';
        if(key.match(regex)){
            console.log('value is 1 to 9', key)
            arr[row][column]=Number(key)
            setPiece(arr)
            // changed=true;
        }else{
            //this will stop the cell from rendiner
            e.preventDefault()
            
        }
        
        console.log(piece)
    }


    return(
        <div className="main">
                {arr.map((columns,index)=>{
                    return(
                        <div key={index}>
                             <form className='columns'>
                                {arr[index].map((values,rows)=>{
                                return(<div className='rows' key={[index,rows]}>
                                        
                                                <input
                                                        id={[index,rows]}
                                                        value={piece[index][rows]}    
                                                        type='text'
                                                        maxLength='1'
                                                        onKeyPress={onKeyPress} 
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
