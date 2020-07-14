import React, {useState,useEffect} from 'react';
import './App.css';

const GameBoard=()=>{
    //this creates a 3 by 3 array/game board
    
    let arr=Array.from({length:9},(v,i)=>Array(9).fill(undefined))
    //veryeasy
    let veryEasy= [
        [undefined, undefined, 3, undefined, undefined, 8, 6, undefined, 7],
        [1, 4, undefined, 7, 2, 6, undefined, undefined, 9],
        [5, undefined, 7, 1, 3, 9, 4, 2, 8],
        [undefined, 2, 5, undefined, 8, 1, 9, undefined, 4],
        [4, 1, undefined, 9, undefined, 3, 2, undefined, 5],
        [undefined, 7, 9, 2, undefined, 5, undefined, 3, 6],
        [6, undefined, 2, undefined, 1, undefined, undefined, 9, 3],
        [7, undefined, undefined, 5, undefined, 2, undefined, undefined, 1],
        [undefined, 8, 1, 3, 6, 7, undefined, 4, undefined]
    ];
    //easy
    let easy = [
        [undefined, 3, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, 2, undefined, 9, undefined, 6, 3, undefined, undefined],
        [undefined, 6, undefined, 4, undefined, 2, undefined, 9, undefined],
        [1, undefined, undefined, undefined, 9, undefined, 4, undefined, undefined],
        [undefined, undefined, 8, 1, undefined, 3, 5, undefined, undefined],
        [undefined,undefined, 5, undefined, 7, undefined,undefined,undefined, 3],
        [undefined, 5, undefined, 3, undefined, 1, undefined, 6, undefined],
        [undefined, undefined, 4, 6, undefined, 7, undefined, 3, undefined],
        [undefined,undefined,undefined,undefined,undefined,undefined,undefined, 8, undefined]
    ];

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

    let [piece, setPiece]= useState(arr);
    // let [quadsFull,setQaudsFull]=useState([]);
    

    //this will be used as an eventListener for keydown or solve me function
    useEffect(()=>{
        // document.addEventListener("keydown", onKeyPress)
        console.log('effect acticated')
        console.log(piece)
        // console.log(piece)
      
    },piece)

    //this will be used to select a puzzle of different amount of values filled out
    useEffect(()=>{
        
        setPiece(easy)
    },[])

    const testingAllCases=()=>{
        
        //picks random quad where we will add number to 
        let randomQuad=Math.floor(Math.random()*(8-0)+0);
        //picks random number between 1 and 9 that we will add to the quad
        let randomNumber=Math.floor(Math.random()*(9-1)+1);

        // let canWeAddNumber=checkQuadraint(randomQuad,randomNumber);
        for(let number=1;number<=9;number++){
            //test 1,4,9 cause those gave us issues
            // let number=1;
            // let canWeAddNumber=checkQuadraint(8,number);
            // const checkRow=(row,val,left,right)=>{
            let canWeAddNumber=checkColumn(8,number,0,8);
            console.log(`value is ${number}, and the answer to adding number is ${canWeAddNumber}`)
            
        }
        
        

        // console.log('quad is', 2, 'randomNumber is ', randomNumber, 'canweaddNumber', canWeAddNumber);

    }

    const getUndefined=(quadriant)=>{
        let res=[];

        let startingRow=quads[quadriant][0][0]
        let endingRow=quads[quadriant][1][0]
        let startingColumn=quads[quadriant][0][1]
        let endingColumn=quads[quadriant][1][1]
        

        //quadCheck
           

        const getUndefinedCellsInRow=(row,left,right)=>{
            let obj=[];
            let midpoint=left+Math.floor((right-left)/2)
            
            //MidPoint Check
            if(piece[row][midpoint]===undefined){
                obj.push([row,midpoint]) 
            }
            
            while(left<right){
                if(piece[row][left]===undefined){
                    obj.push([row,left]) 
                }
                left++
                if(piece[row][right]===undefined){
                    obj.push([row,right])      
                }
                right--;
            }
            return obj;
        }

        for(let i=startingRow;i<=endingRow;i++){
            res.push(getUndefinedCellsInRow(i,startingColumn,endingColumn))
        }
        

        return res.flat(1);

    }

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

    //checks if every value in array has a number in it
    const solved=(board)=>{
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                if(board[i][j]===undefined){
                    return false;
                }
            }
        }
            return true;
        }

    const findEmpty=(board)=>{
        // console.log('findempty called on', board)
        for(let r=0;r<9;r++){
            for(let c=0;c<9;c++){
                    if(board[r][c]===undefined){
                        // console.log('r',r,'c',c,'board',board)
                        return [r,c]
                    }
            }
        }
        console.log('we reached the end')
        return null;
    }

    const solve=(board)=>{

        let currentPosition=findEmpty(board);
    
                //base case where the sudoku board has everything filled out correctly
                if(currentPosition===null){
                    
                    return true;
                }
                 
                for(let val=1;val<=9;val++){
                        
                    if(validate(currentPosition[0],currentPosition[1],val)){
                            
                        board[currentPosition[0]][currentPosition[1]]=val;   
                        /////double check
                        setPiece(board);
                        ////////////
                        
                        //now that we updated the value, we are rerunning solve , but now it is incremented till next empty/undefined cell
                        if(solve(board)){
                                console.log('passed',currentPosition[0],currentPosition[1],val)
                                return true;
                        }

                        // board[currentPosition[0]][currentPosition[1]]= undefined;
                    }
                }
                console.log('FAILED',currentPosition[0],currentPosition[1],board)
                // return false;
                setPiece(board);
                return board;

    }



    const addRandomNumber=()=>{
        let randomQuad=Math.floor(Math.random()*(8-0)+0);
        
        //picks random number between 1 and 9 that we will add to the quad
        // let randomNumber=Math.floor(Math.random()*(9-1)+1);

        // let choices={};
        let choices=[];
        let quadCheckingNum=4
        // let emptyquads=[];
        for(let i=1;i<=9;i++){
            if(checkQuadraint(quadCheckingNum,i)){
                // choices[i]=[]
                choices.push(i)
            }

            
        }


        console.log('all the possible numbers for this quadriant', quadCheckingNum, 'is ', choices)
        let undefinedQuad=getUndefined(quadCheckingNum);
        console.log('undefined cells are', undefinedQuad)
        // console.log('row',undefinedQuad[3][0], 'column', undefinedQuad[3][1])
        

        let quadsWithPossibleChoices=new Map();
        

        for(let i=0;i<undefinedQuad.length;i++){

            for(let j=0;j<choices.length;j++){
                // console.log(choices[j])
                let rowCheck=checkRow(undefinedQuad[i][0],choices[j],0,8)
                let columnCheck=checkColumn(undefinedQuad[i][1],choices[j],0,8)
                // console.log(`choices is ${choices[j]}, row check is ${rowCheck}. column check is ${columnCheck}`)
                if(rowCheck && columnCheck){
                    
                    if(quadsWithPossibleChoices.has(undefinedQuad[i])){

                        let get=quadsWithPossibleChoices.get(undefinedQuad[i])

                        quadsWithPossibleChoices.set(undefinedQuad[i],[...get,choices[j]])
                    }else{
                        
                        quadsWithPossibleChoices.set(undefinedQuad[i],[choices[j]])   
                    } 
                }
            }

        }
        console.log('Possible numbers for the cells are', quadsWithPossibleChoices)
        let finalMap=new Map();

        function breakDownMap(map,array,resultMap,rerun){
            console.log('rerun is', rerun)
            // if(map.size===0 && rerun){
                
            //     console.log('master exit')
            //     return resultMap;
            // }
            if(rerun){
                
                console.log('master exit')
                return resultMap;
            }
            rerun=false;
           
           
            
            //This we will use to create an array of numbers removed where value ===1            
                for(let key of map.keys()){
                    let value=map.get(key)
                    // if value.length===1 that means it is the correct answer
                   if(value.length===1){
                        resultMap.set(key,value)
                        array.push(value[0])
                        map.delete(key)
                        rerun=true;
                   }
            }

           
            //now using the array we will relook into the remaining values and remove values where they are equal to array
            for(let key of map.keys()){
                let value=map.get(key)

                for(let i=0;i<value.length;i++){
                    for(let j=0;j<array.length;j++){
                        if(value[i]===array[j]){
                            value.splice(i,1)  
                        }   
                    }
                    map.set(key,value)
                }
            }
            // console.log('map now is after removal', map)
            array.length=0
            
            // console.log('array is', array,'map is',map,'result map',resultMap) 
            // array.length=0;

            breakDownMap(map,[],resultMap,rerun);
            
        }

        breakDownMap(quadsWithPossibleChoices,[],finalMap,true);
        
        console.log('final map',finalMap)

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




    const onKeyPress=(e)=>{
        
        let id=e.target.id;
        let key=e.key;
        let row=id[2];
        let column=id[0];

        

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
            
            let validated=validate(row,column,val)

            if(!validated){
                e.preventDefault()
            }else{
                piece[row][column]=val;  

                //needs to be double checked
                setPiece(piece)      
                //////////////////
            }

        }else{
            //this will stop the cell from rerenderring
            e.preventDefault()
            
        }
        
        console.log(piece)
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
    const doNothing=()=>{
        console.log('does nothing')
    }

//  value={piece[rows][index]}    is correct way to express it
    return(
        
        <div className="main">
                {piece.map((columns,index)=>{
                    return(
                        <div className='container' key={index}>
                             <form className={`columns${index}`}>
                                {piece[index].map((values,rows)=>{
                                return(<div className={`rows${rows}`}key={[index,rows]}>
                                        
                                                <input
                                                        id={[index,rows]}
                                                        value={piece[rows][index]}    
                                                        type='text'
                                                        maxLength='1'
                                                        onKeyDown={onKeyPress}
                                                        // onChange={doNothing}
                                                        
                                                    >
                                                
                                                </input>     
                                        </div>)
                                })}
                            </form>
                        </div>
                    )
                })}
            
               <div>
                     <button onClick={addRandomNumber}>Add A Random Number</button>
                </div>
                <div>
                     <button onClick={()=>solve(piece,0)}>Solve it for me</button>
                </div>
              
                
            </div>

      )
    
  }


  export default GameBoard;
