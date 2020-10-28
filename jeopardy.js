let categories = [];
let initialID = 11531;
let gameCategories = []
const initialHTML = document.querySelector('#tableDiv').innerHTML

// get list of 100 categories
async function getCategoryIds(initialID) {
    const {data} = await axios.get('https://jservice.io/api/categories', {params: {count: 100, offset: initialID}})
    
    for (let i =0; i< data.length; i++) {
        categories.push(data[i].id)
    }

    return data[data.length-1].id
}

// Adds 300 possible categories to categories list
async function addThreeHundredCategories() {  
    let x = await getCategoryIds(initialID)
    let y = await getCategoryIds(x)
    await getCategoryIds(y)

    getGameCategories()  
}

// Pull 6 categories to use in current game
function getGameCategories() {
    // assure there's no duplicates
    for (let i=0; i<6; i++) {
        let x = Math.floor(Math.random()*300)
        if (!gameCategories.includes(categories[x])) {
            gameCategories.push(categories[x])    
        }
    } 
}


// set header row with category title
async function setHeaderRow(gameCat) {
    for (let i=0; i< gameCat.length; i++) {
        // get game category
        let x = gameCat[i]
        let res = await axios.get('https://jservice.io/api/category', { params: {id: x}})
        
        // set header
        const header = document.querySelector(`#header-${i}`)
        header.innerHTML = res.data.title
        header.style.verticalAlign = 'middle' 
    }
}

 // Functionality to show question or solution when cell is clicked
 let tableTDs = document.querySelectorAll('td')
 $(tableTDs).click(async function(event) {
    let IDName = $(event.target).get()[0].id;
    
    let category = IDName.slice(7,8)  // column
    let clue = IDName.slice(5,6) // row
    
    let res = await axios.get('https://jservice.io/api/category', { params: {id: gameCategories[category]}})
    
    let cell = document.getElementById(IDName)
    
    cell.style.lineHeight = '1em'
    cell.style.verticalAlign = 'middle'
    
    if (cell.className === 'visibleQuestion') {    
        cell.style.fontSize = '1.25em'
        cell.innerHTML = res.data.clues[clue].answer
        cell.classList.toggle('visibleQuestion')
    } else {
        cell.style.fontSize = '1em'
        cell.innerHTML = res.data.clues[clue].question
        cell.classList.add('visibleQuestion')
    }      
    
});

// Start game functionality:
async function loadPage() {
    // debugger
    await addThreeHundredCategories()
    await setHeaderRow(gameCategories)
    
    document.getElementById('table').style.visibility = "visible"

    let button = document.querySelector('button')
    button.style.backgroundColor = 'red'
    button.innerText = 'Restart'
}

// Handle button functionality
const btn = document.querySelector('button')
btn.addEventListener('click', function(e) {
    e.preventDefault()
    if (btn.innerText === "Start Game") {
        loadPage()
    } else {
        document.querySelector('#tableDiv').innerHTML = initialHTML
        categories = []
        gameCategories = []
        loadPage()
    }
})
