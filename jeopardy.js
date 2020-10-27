// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
let numCols = 6;
let initialID = 11531;
let gameCategories = []


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds(initialID) {
    const res = await axios.get('http://jservice.io/api/categories', {params: {count: 100, offset: initialID}})
    for (let i =0; i< res.data.length; i++) {
        categories.push(res.data[i].id)
    }
    return res.data[res.data.length-1].id
}

async function addThreeHundredCategories() {
    let x = await getCategoryIds(initialID)
    let y = await getCategoryIds(x)
    await getCategoryIds(y)
    getGameCategories()  
}



/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

function getGameCategories() {
    // assure there's no duplicates
    for (let i=0; i<6; i++) {
        let x = Math.floor(Math.random()*300)
        if (!gameCategories.includes(categories[x])) {
            gameCategories.push(categories[x])    
        }
    } 
}
// getGameCategories()

//set header row title
async function setHeaderRow(gameCat) {
    
    for (let i=0; i< gameCat.length; i++) {
        // get game category
        let x = gameCat[i]
        let res = await axios.get('http://jservice.io/api/category', { params: {id: x}})
        
        // set header
        const header = document.querySelector(`#header-${i}`)
        header.innerHTML = res.data.title
        header.style.verticalAlign = 'middle' 
    }
}

 // Functionality to show question or solution
 $(document).click(async function(event) {
    let IDName = $(event.target).get()[0].id;
    console.log(IDName) ////////////
    console.log(gameCategories)
    if (IDName.slice(0,4) === 'cell') {
        let category = IDName.slice(7,8)  // column
        let clue = IDName.slice(5,6) // row

        console.log(`Category: ${category} \n Clue:${clue}`) ///////////
        
        let res = await axios.get('http://jservice.io/api/category', { params: {id: gameCategories[category]}})
        console.log(res.data)
        
        let cell = document.getElementById(IDName)
        
        cell.style.lineHeight = '1em'
        cell.style.verticalAlign = 'middle'
        
        if (cell.className === 'visibleQuestion') {    
            cell.style.fontSize = '1.25em'
            cell.innerHTML = res.data.clues[clue].answer
            cell.classList.add('visibleSolution')
        } else {
            cell.style.fontSize = '1em'
            cell.innerHTML = res.data.clues[clue].question
            cell.classList.add('visibleQuestion')
        }     
        
    }
});


// for (let j=0; j<6; j++) {
//     console.log(res.data.clues[j].question)
//     document.getElementById(`cell-${i}.${j}`).innerText = res.data.clues[j].question
// }

/* Fill the HTML table#jeopardy with the categories & cells for questions.
 
  - The <thead> should be filled w/a <tr>, and a <td> for each category
  - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
   each with a question for each category in a <td>
    (initally, just show a "?" where the question/answer would go.)
*/ 

// async function fillTable() {
//     for (let i=0; i< gameCat.length; i++) {
//         let x = gameCat[i]
//         let res = await axios.get('http://jservice.io/api/category', { params: {id: x}})
//         document.querySelector(`#header-${i}`).innerHTML = res.data.title
//     }
// }


/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */








// Start game:

const btn = document.querySelector('button')
btn.addEventListener('click', async function() {
    console.log('button clicked')
    await addThreeHundredCategories()
    await setHeaderRow(gameCategories)
    
    document.getElementById('table').style.visibility = "visible"

    let button = document.querySelector('button')
    button.style.backgroundColor = 'red'
    button.innerText = 'Restart'

})



/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

async function setupAndStart() {
    
    
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO



