let categories = [];
let initialID = 11531;
let gameCategories = []

// get list of 100 categories
async function getCategoryIds(initialID) {
    const res = await axios.get('https://jservice.io/api/categories', {params: {count: 100, offset: initialID}})
    for (let i =0; i< res.data.length; i++) {
        categories.push(res.data[i].id)
    }
    return res.data[res.data.length-1].id
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
 $(document).click(async function(event) {
    let IDName = $(event.target).get()[0].id;
    
    if (IDName.slice(0,4) === 'cell') {
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
    }
});

// Start game:
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

async function loadPage() {

    await addThreeHundredCategories()
    await setHeaderRow(gameCategories)
    
    document.getElementById('table').style.visibility = "visible"

    let button = document.querySelector('button')
    button.style.backgroundColor = 'red'
    button.innerText = 'Restart'
}

const initialHTML = `<table id="table" class="table table-bordered text-center ">
<thead>
      <tr>
            <th scope="col" id="header-0" class="headers">""</th>
            <th scope="col" id="header-1" class="headers">""</th>
            <th scope="col" id="header-2" class="headers">""</th>
            <th scope="col" id="header-3" class="headers">""</th>
            <th scope="col" id="header-4" class="headers">""</th>
            <th scope="col" id="header-5" class="headers">""</th>
      </tr>
</thead>
<tbody>
      <tr class="h-25">
            <td id="cell-0.0">?</td>
            <td id="cell-0.1">?</td>
            <td id="cell-0.2">?</td>
            <td id="cell-0.3">?</td>
            <td id="cell-0.4">?</td>
            <td id="cell-0.5">?</td>
      </tr>
      <tr>
            <td id="cell-1.0">?</td>
            <td id="cell-1.1">?</td>
            <td id="cell-1.2">?</td>
            <td id="cell-1.3">?</td>
            <td id="cell-1.4">?</td>
            <td id="cell-1.5">?</td>
      </tr>
      <tr>
            <td id="cell-2.0">?</td>
            <td id="cell-2.1">?</td>
            <td id="cell-2.2">?</td>
            <td id="cell-2.3">?</td>
            <td id="cell-2.4">?</td>
            <td id="cell-2.5">?</td>
      </tr>
      <tr>
            <td id="cell-3.0">?</td>
            <td id="cell-3.1">?</td>
            <td id="cell-3.2">?</td>
            <td id="cell-3.3">?</td>
            <td id="cell-3.4">?</td>
            <td id="cell-3.5">?</td>
      </tr>
      <tr>
            <td id="cell-4.0">?</td>
            <td id="cell-4.1">?</td>
            <td id="cell-4.2">?</td>
            <td id="cell-4.3">?</td>
            <td id="cell-4.4">?</td>
            <td id="cell-4.5">?</td>
      </tr>
      
</tbody>
</table>
</div>`