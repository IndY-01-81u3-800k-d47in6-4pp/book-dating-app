const shelfContainer = document.querySelector('.shelf-select');
const addShelfBtn = document.querySelector('.add-shelf');
const deleteBookBtn = document.querySelector('.delete-book');

let activeShelf = null;

let shelves = [
    {
        title: "Shelf Name",
        books: [
            {title: "The Pillars of the Earth", cover: "img/pillar.jpg"}
        ]
    }
]

function switchShelf(event) {
    const selectedShelf = event.target.closest('.shelf');

    if (selectedShelf.classList.contains('shelf')) {

        if (selectedShelf !== activeShelf) {
            if (activeShelf) {
                activeShelf.classList.remove('active');
            }

            selectedShelf.classList.add('active');

            activeShelf = selectedShelf;
        }
    }
}
function addShelf() {
    const newName = prompt("Enter New Shelf Name");
    
    const newShelf = document.createElement('button');
    newShelf.classList.add('shelf');
    
    const shelfImg = document.createElement('img');
    shelfImg.src = 'img/shelf_icon.png';

    const shelfP = document.createElement('p');
    shelfP.classList.add('shelf-name');
    shelfP.textContent = newName;

    newShelf.appendChild(shelfImg);
    newShelf.appendChild(shelfP);

    shelfContainer.appendChild(newShelf);

    const shelf = {
        title: newName,
        books: []
    }
    shelves.push(shelf);
}
function deleteBooks() {
    const checkboxes = document.querySelectorAll(".checkbox");
    console.log(checkboxes.length);

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {

            const book = checkbox.closest('.book');
            const title = book.querySelector('.book-title').textContent;
            console.log(title);
            removeFromCurrentShelf(title);

            book.remove();
        }
    })
}
function removeFromCurrentShelf(title) {
    let shelfName = activeShelf.querySelector('.shelf-name').textContent;
    console.log(shelfName);
    shelves.forEach(shelf => {
        if (shelf.title === shelfName) {
            shelf.books = shelf.books.filter(book => book.title !== title);
            return;
        }
    })
}
function enumerateBooks() {
    let currentShelfName = activeShelf.querySelector('.shelf-name').textContent;
}
shelfContainer.addEventListener('click', switchShelf);
addShelfBtn.addEventListener('click', addShelf);
deleteBookBtn.addEventListener('click', deleteBooks);
