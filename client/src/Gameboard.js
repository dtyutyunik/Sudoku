import React, {useState,useEffect} from 'react';
import './App.css';

const GameBoard=()=>{
    //this creates a 3 by 3 array/game board
    
    // const 
    let arr=Array.from({length:9},(v,i)=>Array(9).fill(undefined))
    let quads=[[[0,0],[2,2]],
               [[0,3],[2,5]],
               [[0,6],[2,8]],
               [[3,0],[5,2]],
               [[3,3],[5,5]],
               [[3,6],[5,8]],
               [[6,0],[8,2]],
               [[6,3],[8,5]],
               [[6,6],[8,8]]
              ]

    let [piece, setPiece]= useState(arr);
    

    useEffect(()=>{

        console.log('effect acticated')
        
      
    },arr)

    const getQuad=(row,column)=>{
        // let rowCheck=[quads[2][0][0],quads[2][1][0]]
        // let columnCheck=[quads[2][0][1],quads[2][1][1]]
       
        for(let i=0;i<quads.length;i++){
            let rowCheck=[quads[i][0][0],quads[i][1][0]]
            let columnCheck=[quads[i][0][1],quads[i][1][1]]
            if((row>=rowCheck[0] && row<=rowCheck[1])&&(column>=columnCheck[0] && column<=columnCheck[1])){
                return i   
            }
        }
    }


    const onKeyPress=(e)=>{
        
        let id=e.target.id;
        let key=e.key;
        let row=id[0];
        let column=id[2];

        

        //For Deleting, currently it does not rerender the boxes
        // if(key==='Backspace' || key==='Delete'){
        //     // arr[row][column]=undefined;
        //     // setPiece(arr) 
        //     console.log('backspace or delete pressed')
        // }

        let regex='^([1-9])$';
        if(key.match(regex)){
            // console.log('value is 1 to 9', key)
            let val=Number(key)
            
            //quadCheck
            let quad=getQuad(row,column);
            let quadCheck=checkQuadraint(quad,val);
            console.log('quadCheck',quadCheck);
            
            //Checks
            let rowCheck=checkRow(row,val,0,8);
            let columnCheck=checkColumn(column,val,0,8);
            
            // console.log('rowCheck',rowCheck)
            // console.log('columnCheck',columnCheck)
            if(rowCheck===false || columnCheck===false || quadCheck===false){
                e.preventDefault()
            }else{
                arr[row][column]=val;    
                setPiece(arr)      
            }

        }else{
            //this will stop the cell from rerenderring
            e.preventDefault()
            
        }
        
        // console.log(piece)
    }

    const checkRow=(row,val,left,right)=>{
        let obj=new Set();
        // let left=left;
        // let right=right;
        let midpoint=left+Math.floor((right-left)/2)
        // console.log('row midpoint',midpoint)
        //MidPoint Check
        if(arr[row][midpoint]!==undefined){
            if(arr[row][midpoint]===val){
                return false;
            }else{
                obj.add(arr[row][midpoint])
            }
        }
        
        while(left<right){
            if(arr[row][left]===undefined){
                left++
            }else{
                if(arr[row][left]===val){
                    return false;
                }else{
                    obj.add(arr[row][left])
                    left++
                }
            }
            
            if(arr[row][right]===undefined){
                right--;
            }else{
                if(arr[row][right]===val){
                    return false;
                }else{
                    obj.add(arr[row][right])
                    right--;
                    
                }               
            }
        }
        return true;

    }

    const checkQuadraint=(quadriant,val)=>{
        let obj=new Set();

        
        let startRow=quads[quadriant][0][0]
        let endRow=quads[quadriant][1][0]
        let startColumn=quads[quadriant][0][1]
        let endColumn=quads[quadriant][1][1]

        console.log(quads[quadriant],startRow,endRow,startColumn,endColumn);

        for(let i=startRow;i<=endRow;i++){
            let row=checkRow(i,val,startColumn,endColumn);
            if(row===false){
                console.log('row',i,row)
                return false;
            }
            
        }
        for(let j=startColumn;j<=endColumn;j++){
            let column=checkColumn(j,val,startRow,endRow);
            if(column===false){
                console.log('column',j,column)
                return false;
            }
           
        }

        return true;

    }

    const checkColumn=(column,val,left,right)=>{
        let obj=new Set();
        // let left=left;
        // let right=right;
        let midpoint=left+Math.floor((right-left)/2)
        // console.log('column midpoint',midpoint)
        // console.log('current column is', arr)
        //MidPoint Check
        if(arr[midpoint][column]!==undefined){
            if(arr[midpoint][column]===val){
                return false;
            }else{
                obj.add(arr[midpoint][column])
            }
        }
        
        while(left<right){
            if(arr[left][column]===undefined){
                left++
            }else{
                if(arr[left][column]===val){
                    return false;
                }else{
                    obj.add(arr[left][column])
                    left++
                }
            }
            
            if(arr[right][column]===undefined){
                right--;
            }else{
                if(arr[right][column]===val){
                    return false;
                }else{
                    obj.add(arr[right][column])
                    right--;
                    
                }               
            }
        }
        return true;

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
                                                        onKeyDown={onKeyPress} 
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
