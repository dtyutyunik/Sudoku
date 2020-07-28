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

    let [piece, setPiece]= useState(Array.from({length: 9},()=> Array.from({length: 9}, () => '1')));
    let [result,setResult]=useState('');     //Once puzzle is solved, this will also disable hint and solve it for me buttons 
    let [answer,setAnswer]=useState();          //the answers will be stored here
    let [hints,setHints]=useState(0);          //the answers will be stored here
    let original=JSON.parse(window.localStorage.getItem("original"));  //will hold the original sudoku board for reseting purposes

       //initalize first random choice of sudoku puzzle
       useEffect(()=>{
        // eslint-disable-next-line react-hooks/exhaustive-deps 
        let puzzleChoice=Puzzles[Math.floor(Math.random()*(Puzzles.length-0)+0)];
        pickRandomPuzzle(puzzleChoice,false);
        
    },[])
    
    //A random puzzle is chosen from Puzzles.js
    function pickRandomPuzzle(puzzleChoice,resetting){
       let puzzle,ans; 

        if(resetting===true){
            puzzle=puzzleChoice;
            setPiece(puzzle)  
            setAnswer(answer)
            return;
        }else{
            puzzle=puzzleChoice.quizzes;
            ans=puzzleChoice.solutions;
        }

        let puzzleArr=Array.from({length: 9},()=> Array.from({length: 9}, () => ''));
        let ansArr=Array.from({length: 9},()=> Array.from({length: 9}, () => ''));
        let col=0,row=0;


        for(let i=0;i<puzzle.length;i++){
            let str=puzzle[i]
            let strAns=ans[i]
            
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
       
        //set the localstorage to original
        window.localStorage.setItem('original',JSON.stringify(puzzleArr));
        
    }
    
    //Selects a new puzzle and resets Result to false;
    const newPuzzle=()=>{
        let puzzleChoice=Puzzles[Math.floor(Math.random()*(Puzzles.length-0)+0)];
        pickRandomPuzzle(puzzleChoice,false);
        setResult('')
        setHints(0)
        
    }

 

    //check
    const validate=(row,column,val)=>{
            
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
        
        for(let r=0;r<9;r++){
            for(let c=0;c<9;c++){
                    if(board[r][c]===''){
                        return [r,c]
                    }
            }
        }
        
        return null;    //if it returns null that means that puzzle is not empty
    }

    function solve(board,errors){

        let currentPosition=findEmpty(board);
                //base case where the sudoku board has everything filled out correctly
                if(currentPosition===null){
                    //created a timeout to provide the illusion of calculations
                    setTimeout(()=>
                        {setResult('found')
                            setHints(0)}
                        ,1400);
                    
                    return true;
                }
                
                for(let val=1;val<=9;val++){
                        
                    if(validate(currentPosition[0],currentPosition[1],val)){
                        
                        let copy = [...board];   
                        copy[currentPosition[0]][currentPosition[1]]=val; 
                        //created a timeout to provide the illusion of calculations
                        setTimeout(()=>
                        {updateOneNumber(currentPosition[0],currentPosition[1],val)}
                        ,1000); 
                        
                        // updateOneNumber(currentPosition[0],currentPosition[1],val)
                        if(solve(copy,false)){
                        //now that we updated the value, we are rerunning solve , but now it is incremented till next '' cell   
                                return true;
                        }
                        
                        // board[currentPosition[0]][currentPosition[1]]='';   
                        // updateOneNumber(currentPosition[0],currentPosition[1],'')
                    }
                }
                
                // // updateOneNumber(currentPosition[0],currentPosition[1],'')

                board[currentPosition[0]][currentPosition[1]]='';   
                // //created a timeout to provide the illusion of calculations
                setTimeout(()=>
                {updateOneNumber(currentPosition[0],currentPosition[1],'')}
                ,1000);
                
                setTimeout(()=>
                {setResult('error')}
                ,1400);
                
                
                return false;
                

    }

    //returns the quad location based on row and column
    const getQuad=(row,column)=>{
       
        for(let i=0;i<quads.length;i++){
            let rowCheck=[quads[i][0][0],quads[i][1][0]]
            let columnCheck=[quads[i][0][1],quads[i][1][1]]
            if((row>=rowCheck[0] && row<=rowCheck[1])&&(column>=columnCheck[0] && column<=columnCheck[1])){
                return i   
            }
        }
    }

    //0(log n) to find row
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

    //used to check for all values in quad
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
    
    //0(log n) to find column
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

    //deletes a value from sudoku board that wasn't prefilled originally
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
        let columnPosition= [];
        for(let i=0;i<piece[randomRow].length;i++){
            
            if(piece[randomRow][i]===''){
                columnPosition.push(i)
            }
        }
       
        if(columnPosition.length>0){
            let randomColumn=columnPosition[Math.floor(Math.random()*(columnPosition.length-0)+0)]
            let updatedVal=answer[randomRow][randomColumn]; 
            updateOneNumber(randomRow,randomColumn,updatedVal)
            setHints(hints+1)
        }else{
            
            hint();
        }

        //Exit 
        if(findEmpty(piece)===null){
            return setResult('found');

        }

        
    }

    //updates oneNumber at a time
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

    //resets puzzle back to original/current puzzle
    const reset=()=>{
        
        pickRandomPuzzle(original,true)
        setResult('')
        setHints(0);
        
    }


    console.log('piece is', piece)
    return(
        
        <div>
            
        <div className='title'>
            <h1>Sudoku</h1>
            <h3>Only allowed numbers per quadriant can be entered</h3>
        </div>
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
                                                        // disabled={original[rows][columns]!==''?true:false}
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

                
            </div>
            <div className='buttonContainer'>
            
                     <button 
                     disabled={result?true:false}
                     onClick={hint}>Hint</button>
            
                     <button 
                     disabled={result||hints<4?true:false}
                     onClick={()=>solve(piece,false)}>Give Up!?</button>
            
                     <button onClick={reset}>Reset</button>
            
                     <button onClick={newPuzzle}>New Sudoku</button>
            </div>
                {/* <h2 className='solved'>{result==='found'?'Solved':null}</h2> */}
                <h2 className='solved'>{result==='found'?'Solved':result==='error'?'One of Your Choices is Wrong':null}</h2>
             </div>

      )
    
  }


  export default GameBoard;
