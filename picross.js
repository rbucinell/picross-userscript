// ==UserScript==
// @name         PICROSS Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Ryan Bucinell
// @match        http://liouh.com/picross/
// @grant        none
// ==/UserScript==

const SquareState = {
    ON: "s2",
    OFF: "s1",
    UNSET: "s0"
}

class Square {
    constructor( state , locked )
    {
        //SquareState
        this.state = state;

        //Boolean
        this.locked = locked;
    }
}

let data = {
    cols: 0,
    rows: 0,
    clues : {
        top: [], //{ 'clues' : keys, 'sum' : keysum }
        left: [] //{ 'clues' : keys, 'sum' : keysum }
    },
    grid: [] //Square
};

function loadData( puzzleElement )
{
    //Load top clues
    let topKeys = puzzleElement.getElementsByClassName( 'key top');
    data.clues.top = [];
    data.cols = topKeys.length;
    for( let i = 0; i < topKeys.length; i++ )
    {
        let keys = topKeys[i].innerText.split('\n').map( x => parseInt(x) );
        let keysum = keys.reduce((x,y)=> x+y,0) + keys.length-1;
        data.clues.top.push( { 'clues' : keys, 'sum' : keysum } );
    }

    //load left clues
    let leftKeys = puzzleElement.getElementsByClassName( 'key left');
    data.clues.left = [];
    data.rows = leftKeys.length;
    for( let i = 0; i < leftKeys.length; i++ )
    {
        let keys = leftKeys[i].innerText.split(' ').map( x => parseInt(x));
        let keysum = keys.reduce((x,y)=> x+y,0) + keys.length-1;
        data.clues.left.push({ 'clues' : keys, 'sum' : keysum } );
    }

    //load partial submission
    data.grid = [];
    for( let r = 0; r < data.rows; r++ )
    {
        let row = [];
        for( let c = 0; c < data.cols; c++ )
        {
            let td = puzzleElement.querySelector( `table > tbody > tr:nth-child(${2 + r}) >td:nth-child(${2 + c})` );
            if( td.classList.contains( SquareState.ON ) )
            {
                row.push( new Square( SquareState.ON, true ) );
            }
            else if( td.classList.contains( SquareState.OFF ) )
            {
                row.push( new Square( SquareState.OFF, true ) );
            }
            else
            {
                row.push( new Square( SquareState.UNSET, false) );
            }
        }
        data.grid.push( row );
    }

}

function displaySums( puzzleElement )
{
    let parent = puzzleElement.parentElement;
    let puzzleContainer = document.createElement('div');
    puzzleContainer.id = 'puzzleContainer';
    puzzleContainer.style.display = "grid";
    puzzleContainer.style.width = "100%";
    puzzleContainer.style.height = "490px";
    puzzleContainer.style.gridTemplateAreas = "'corner topSums' 'leftSums content' ";
    puzzleContainer.style.display = "grid";

    parent.removeChild( puzzleElement );
    puzzleContainer.appendChild( puzzleElement );
    parent.appendChild( puzzleContainer );



}

(function() {
    'use strict';

    let puzzle = document.getElementById('puzzle');
    loadData( puzzle );
    displaySums( puzzle );

    console.log( data );

    // Your code here...
})();