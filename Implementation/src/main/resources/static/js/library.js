console.log('Library.js is loaded!');

const shelfContainer = document.querySelector('.shelf-select');
const addShelfBtn = document.querySelector('.add-shelf');
const deleteBookBtn = document.querySelector('.delete-book');
const bookContainer = document.querySelector('.books-container');
const moveButton = document.querySelector('.move-book-btn');
const moveDialog = document.querySelector('.move-dialog');
const moveShelvesContainer = document.querySelector('.move-shelves-container');
const confirmMoveButton = document.querySelector('.confirm-move');

let selectedBooks = new Set();

document.querySelectorAll('.checkbox').forEach(checkbox => {
    checkbox.addEventListener('click', function () {
        selectBook(this);
    });
});


function selectBook(checkbox) {
    const bookElement = checkbox.closest('.book');
    const bookId = bookElement.getAttribute('data-id');

    if (checkbox.checked) {
        selectedBooks.add(bookId);
    } else {
        selectedBooks.delete(bookId);
    }

    console.log('Selected Books:', Array.from(selectedBooks)); // Debugging
}

function deleteSelectedBooks() {
    if (selectedBooks.size === 0) {
        alert('No books selected for deletion!');
        return;
    }

    const userId = document.querySelector('input[name="userId"]').value;
    console.log('User ID:', userId);
    const csrfToken = document.querySelector('meta[name="_csrf"]').content;

    // Send delete request to the server
    console.log('Request Body:', {
        userId: userId,
        bookIds: Array.from(selectedBooks),
    });

    fetch(`/profile/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
            userId: userId,
            bookIds: Array.from(selectedBooks),
        }),
    })
        .then(response => {
            console.log('Response:', response);
            if (response.ok) {
                selectedBooks.forEach(bookId => {
                    document.querySelector(`[data-id="${bookId}"]`).remove();
                });
                selectedBooks.clear();
                alert('Books deleted successfully!');
            } else {
                alert('Failed to delete books.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred.');
        });

}


let activeShelf = null;

let shelves = [
    {
        name: "Shelf Name",
        books: [
            {title: "The Pillars of the Earth", cover: "img/pillar.jpg"},
            {title: "Echoes of Steel", cover: "img/Echoes of Steel V1 with Title, Action.png"}
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
            enumerateBooks();
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

    const newMoveShelf = document.createElement('div');
    newMoveShelf.classList.add('shelf-to-move');

    const newMoveShelfName = document.createElement('p');
    newMoveShelfName.textContent = newName;

    const newMoveShelfCheckbox = document.createElement('input');
    newMoveShelfCheckbox.type = 'checkbox';
    newMoveShelfCheckbox.classList.add('checkbox');

    newMoveShelf.appendChild(newMoveShelfName);
    newMoveShelf.appendChild(newMoveShelfCheckbox);

    moveShelvesContainer.appendChild(newMoveShelf);

    const shelf = {
        name: newName,
        books: []
    }
    shelves.push(shelf);
}
function deleteBooks() {
    const checkboxes = bookContainer.querySelectorAll(".checkbox");

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {

            const book = checkbox.closest('.book');
            const title = book.querySelector('.book-title').textContent;
            removeFromCurrentShelf(title);

            book.remove();
        }
    })
}
function removeFromCurrentShelf(title) {
    let shelfName = activeShelf.querySelector('.shelf-name').textContent;
    shelves.forEach(shelf => {
        if (shelf.name === shelfName) {
            shelf.books = shelf.books.filter(book => book.title !== title);
            return;
        }
    })
}
function enumerateBooks() {
    bookContainer.replaceChildren();
    let currentShelfName = activeShelf.querySelector('.shelf-name').textContent;

    shelves.forEach(shelf => {
        if (shelf.name === currentShelfName) {
            displayBooks(shelf.books);
            return;
        }
    })
}
function displayBooks(books) {
    books.forEach(book => {
        const newBook = document.createElement('div');
        newBook.classList.add('book');

        const newCheckmark = document.createElement('input');
        newCheckmark.type = 'checkbox';
        newCheckmark.classList.add('checkbox');

        const newCoverImage = document.createElement('img');
        newCoverImage.src = book.cover;
        newCoverImage.classList.add('book-cover');

        const newTitle = document.createElement('p');
        newTitle.classList.add('book-title');
        newTitle.textContent = book.title;

        newBook.appendChild(newCheckmark);
        newBook.appendChild(newCoverImage);
        newBook.appendChild(newTitle);

        bookContainer.appendChild(newBook);
    })
}
function moveSelected() {
    let currentShelfName = activeShelf.querySelector('.shelf-name').textContent;
    const bookCheckboxes = bookContainer.querySelectorAll(".checkbox");
    const shelfCheckboxes = moveDialog.querySelectorAll('.checkbox');

    let booksToAdd = [];

    shelves.forEach(shelf => {
        if (shelf.name === currentShelfName) {
            bookCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    let book = {
                        title: checkbox.closest('.book').querySelector('p').textContent,
                        cover: checkbox.closest('.book').querySelector('.book-cover').src
                    }
                    booksToAdd.push(book);
                }
            })
            return;
        }
    })

    shelves.forEach(shelf => {
        shelfCheckboxes.forEach(checkbox => {
            if (checkbox.checked && (shelf.name === checkbox.closest('.shelf-to-move').querySelector('p').textContent)) {
                let temp = shelf.books.concat(booksToAdd);
                shelf.books = removeDuplicates(temp);
            }
        })
    })
}
function removeDuplicates(books) {
    const uniqueBooks = [];
    const seenTitles = new Set();

    books.forEach(book => {
        if (!seenTitles.has(book.title)) {
            uniqueBooks.push(book);
            seenTitles.add(book.title);
        }
    });

    return uniqueBooks;
}
shelfContainer.addEventListener('click', switchShelf);
addShelfBtn.addEventListener('click', addShelf);
deleteBookBtn.addEventListener('click', deleteBooks);
moveButton.addEventListener('click', () => {
    moveDialog.classList.toggle('active');
})
confirmMoveButton.addEventListener('click', moveSelected);