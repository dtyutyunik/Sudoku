import React, {useState,useEffect} from 'react';
import './App.css';
import Puzzles from './Puzzles.js';

const GameBoard=()=>{
    const quads=[[[0,0],[2,2]],
               [[0,3],[2,5]],
               [[0,6],[2,8]],
               [[3,0],[5,2]],
               [[3,3],[5,5]],
               [[3,6],[5,8]],
               [[6,0],[8,2]],
               [[6,3],[8,5]],
               [[6,6],[8,8]]
              ]

    let [piece, setPiece]= useState(Array.from({length: 9},()=> Array.from({length: 9}, () => '')));
    let [result,setResult]=useState(false);
    let [answer,setAnswer]=useState();          //the answers will be stored here
    let [original,setOriginal]=useState();      //will hold the original sudoku board for reseting purposes

    //A random puzzle is chosen from Puzzles.js
    function pickRandomPuzzle(puzzleChoice){
        let puzzle=puzzleChoice.quizzes;
        let answer=puzzleChoice.solutions;
        
        let puzzleArr=Array.from({length: 9},()=> Array.from({length: 9}, () => ''));
        let ansArr=Array.from({length: 9},()=> Array.from({length: 9}, () => ''));
        let col=0,row=0;
        
        for(let i=0;i<puzzle.length;i++){
            let str=puzzle[i]
            let strAns=answer[i]
            
            if(str==='0'){
                str=''
                puzzleArr[col][row]=str;
            }else{
                puzzleArr[col][row]=Number(str);
            }
            
            ansArr[col][row]=Number(strAns);

            row++
            
            if((i+1)%9===0 && i!==0){
                col++;
                row=0;
            }
            
        }

        setPiece(puzzleArr)
        setAnswer(ansArr)
        setOriginal(puzzleChoice)
        
    }
    
    //newPuzzle needs to be updated
    const newPuzzle=()=>{
        setResult(false);
        console.log('new puzzle clicked')
    }


    useEffect(()=>{
        let puzzleChoice=Puzzles[Math.floor(Math.random()*(Puzzles.length-0)+0)];
        pickRandomPuzzle(puzzleChoice);
        
        console.log('random puzzle was ran')
    },[])

    // const getUndefined=(quadriant)=>{
    //     let res=[];

    //     let startingRow=quads[quadriant][0][0]
    //     let endingRow=quads[quadriant][1][0]
    //     let startingColumn=quads[quadriant][0][1]
    //     let endingColumn=quads[quadriant][1][1]
        
        
    //     const getUndefinedCellsInRow=(row,left,right)=>{
    //         let obj=[];
    //         let midpoint=left+Math.floor((right-left)/2)
            
    //         //MidPoint Check
    //         if(piece[row][midpoint]===undefined){
    //             obj.push([row,midpoint]) 
    //         }
            
    //         while(left<right){
    //             if(piece[row][left]===undefined){
    //                 obj.push([row,left]) 
    //             }
    //             left++
    //             if(piece[row][right]===undefined){
    //                 obj.push([row,right])      
    //             }
    //             right--;
    //         }
    //         return obj;
    //     }

    //     for(let i=startingRow;i<=endingRow;i++){
    //         res.push(getUndefinedCellsInRow(i,startingColumn,endingColumn))
    //     }
        

    //     return res.flat(1);

    // }

    const validate=(row,column,val)=>{
            //checks
            let rowCheck=checkRow(row,val,0,8);
            let columnCheck=checkColumn(column,val,0,8)
            let quad=getQuad(row,column);
            let quadCheck=checkQuadraint(quad,val)

            if(rowCheck&&columnCheck&&quadCheck){
                return true;
            }
            return false;
    }

    const findEmpty=(board)=>{
        // console.log('findempty called on', board)
        for(let r=0;r<9;r++){
            for(let c=0;c<9;c++){
                    if(board[r][c]===''){
                        // console.log('r',r,'c',c,'board',board)
                        return [r,c]
                    }
            }
        }
        return null;
    }

    function solve(board){

        let currentPosition=findEmpty(board);
                //base case where the sudoku board has everything filled out correctly
                if(currentPosition===null){
                    console.log('soduku finished succesfully')
                    setResult(true)
                    // setTimeout(()=>
                    //     {setResult(true)}
                    //     ,3000);
                    return true;
                }
                //  console.log(currentPosition)
                for(let val=1;val<=9;val++){
                        
                    if(validate(currentPosition[0],currentPosition[1],val)){
                        
                        let copy = [...board];   
                        copy[currentPosition[0]][currentPosition[1]]=val; 
                        //delays it from updating by .1 sec 
                        // setTimeout(()=>
                        // {updateOneNumber(currentPosition[0],currentPosition[1],val)}
                        // ,500); 
                        
                        updateOneNumber(currentPosition[0],currentPosition[1],val)
                        if(solve(copy)){
                        //now that we updated the value, we are rerunning solve , but now it is incremented till next '' cell   
                                return true;
                        }

                        // board[currentPosition[0]][currentPosition[1]]='';   
                        // updateOneNumber(currentPosition[0],currentPosition[1],'')
                    }
                }
                board[currentPosition[0]][currentPosition[1]]='';   
                updateOneNumber(currentPosition[0],currentPosition[1],'')
                //delays it from updating by .1 sec 
                // setTimeout(()=>
                // {updateOneNumber(currentPosition[0],currentPosition[1],'')}
                // ,500);
                
                
                return false;
                

    }

    const getQuad=(row,column)=>{
       
        for(let i=0;i<quads.length;i++){
            let rowCheck=[quads[i][0][0],quads[i][1][0]]
            let columnCheck=[quads[i][0][1],quads[i][1][1]]
            if((row>=rowCheck[0] && row<=rowCheck[1])&&(column>=columnCheck[0] && column<=columnCheck[1])){
                return i   
            }
        }
    }

    const checkRow=(row,val,left,right)=>{
        let obj=new Set();
        let midpoint=left+Math.floor((right-left)/2)
        
        //MidPoint Check
        if(piece[row][midpoint]!==undefined){
            if(piece[row][midpoint]===val){
                return false;
            }else{
                obj.add(piece[row][midpoint])
            }
        }
        
        while(left<right){
            if(piece[row][left]===undefined){
                left++
            }else{
                if(piece[row][left]===val){
                    return false;
                }else{
                    obj.add(piece[row][left])
                    left++
                }
            }
            
            if(piece[row][right]===undefined){
                right--;
            }else{
                if(piece[row][right]===val){
                    return false;
                }else{
                    obj.add(piece[row][right])
                    right--;
                    
                }               
            }
        }
        return true;

    }

    const checkQuadraint=(quadriant,val)=>{
    
        let startRow=quads[quadriant][0][0]
        let endRow=quads[quadriant][1][0]
        let startColumn=quads[quadriant][0][1]
        let endColumn=quads[quadriant][1][1]

        for(let i=startRow;i<=endRow;i++){
            
            let rows=checkRow(i,val,startColumn,endColumn);
            if(rows===false){
                return false;
            }
        }
        return true;

    }

    const checkColumn=(column,val,left,right)=>{
        let obj=new Set();
       
        let midpoint=left+Math.floor((right-left)/2)
       
        //MidPoint Check
        if(piece[midpoint][column]!==undefined){
            
            if(piece[midpoint][column]===val){
                return false;
            }else{
                obj.add(piece[midpoint][column])
            }
        }
        
        while(left<right){
            if(piece[left][column]===undefined){
                left++
            }else{
                if(piece[left][column]===val){
                    return false;
                }else{
                    obj.add(piece[left][column])
                    left++
                }
            }
            
            if(piece[right][column]===undefined){
                right--;
            }else{
                if(piece[right][column]===val){
                    return false;
                }else{
                    obj.add(piece[right][column])
                    right--;
                    
                }               
            }
        }
        return true;

    }

    const deleteVal=(row,column,e)=>{
        let key=e.key;
        if(key==='Backspace' || key==='Delete'){
           
            let copy = [...piece];
            copy[row][column] = '';
            setPiece(copy)     
        }
    }

    //need to add localstorage to hint to speed up hint randomization
    const hint=()=>{
        
        let randomRow=Math.floor(Math.random()*(9-0)+0);
        
        let choices= [];
        for(let i=0;i<piece[randomRow].length;i++){
            
            if(piece[randomRow][i]===''){
                choices.push(i)
            }
        }
        
        if(choices.length>0){
            let randomColumn=choices[Math.floor(Math.random()*(choices.length-0)+0)]
            let updatedVal=answer[randomRow][randomColumn]; 
            updateOneNumber(randomRow,randomColumn,updatedVal)
            
        }else{
            console.log('hint was rerun')
            hint();
        }

        //Exit 
        if(findEmpty(piece)===null){
            return setResult(true);

        }

        
    }

    const updateOneNumber=(row,col,val)=>{
        let copy=[...piece]
        copy[row][col]=val;
        return setPiece(copy);        
    }

    const handleChange=(row,column,e)=>{
        let key=e.target.value;
        
        let regex='^([1-9])$';
        if(key.match(regex)){
            let val=Number(key)
            let validated=validate(row,column,val)

            if(!validated){
                e.preventDefault()
            }else{
                let copy = [...piece];
                copy[row][column] = Number(val);
                setPiece(copy)      
            }

        }else{
            //this will stop the cell from rerenderring
            e.preventDefault()
        }
        
    }

    const reset=()=>{
        pickRandomPuzzle(original)
        setResult(false)
        
    }



    return(
        <div>
        <div className="main">
                {piece.map((index,columns)=>{
                    return(
                        <div className='container' key={columns}>
                             <form className={`columns${columns}` }>
                                {piece[columns].map((values,rows)=>{
                                return(<div className={`rows${rows}`}key={[columns,rows]}>
                                        
                                                <input
                                                        id={[columns,rows]}
                                                        //disables the pieces so the original ones can not be changed
                                                        // disabled={piece[rows][columns]!=='' && piece[rows][columns]===easy[rows][columns]?true:false}
                                                        value={piece[rows][columns]}    
                                                        type='text'
                                                        maxLength='1'                     
                                                        onKeyDown={e => deleteVal(rows, columns, e)}
                                                        onChange={e => handleChange(rows, columns, e)}
                                                    >
                                                
                                                </input>     
                                            
                                        </div>)
                                })}
                            </form>
                        </div>
                    )
                })}
            
                <div>
                     <button 
                     disabled={result?true:false}
                     onClick={hint}>Hint</button>
                </div>

                <div>
                     <button 
                     disabled={result?true:false}
                     onClick={()=>solve(piece)}>Solve it for me</button>
                </div>
                <div>
                     <button onClick={reset}>Reset</button>
                </div>
                <div>
                     <button onClick={newPuzzle}>Generate new Sudoku</button>
                </div>
              
               
              
                
            </div>
             <div>
                <h1>{result===true?'Solved':null}</h1>
             </div>
             </div>

      )
    
  }


  export default GameBoard;
