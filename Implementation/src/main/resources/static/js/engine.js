let currentIndex = 0;
let endIndex = 0;
const bookCardsContainer = document.querySelector('.book-cards-container');
const bookCards = document.querySelector('.book-cards');
const prevArrow = document.querySelector('#prev-arrow');
const nextArrow = document.querySelector('#next-arrow');

// Function to update carousel state
function updateCarousel() {
    const cards = document.querySelectorAll('.book-carousel .book-card');

    // Get the width of the current card
    const currentCard = cards[currentIndex];
    const cardWidth = currentCard.getBoundingClientRect().width; // Get the width of the current card

    cards.forEach((card, index) => {
        // Reset styles for all cards
        card.classList.remove('active');
        card.style.transform = 'scale(0.9)';
        card.style.opacity = '0.5';

        if (index === currentIndex) {
            // Style the active card
            card.classList.add('active');
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
        }
    });

    // Update container's translateX to center the active card
    bookCards.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

// Handle navigation
prevArrow.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});

nextArrow.addEventListener('click', () => {
    if (currentIndex < document.querySelectorAll('.book-carousel .book-card').length - 1) {
        currentIndex++;
        updateCarousel();
    }
});

// Add new book card
function addBookCard(book) {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    const img = document.createElement('img');
    img.src = book.thumbnailUrl;
    img.alt = `Cover of ${book.title}`;
    img.addEventListener('click', () => {
        window.location.href = `/book/${book.id}`;
    });
    bookCard.appendChild(img);
    bookCards.appendChild(bookCard);

    updateCarousel();
}

// Automatically iterate through book cards
function autoIterate() {
    const cards = document.querySelectorAll('.book-carousel .book-card');
    if (currentIndex < document.querySelectorAll('.book-carousel .book-card').length - 1) {
        const cards = document.querySelectorAll('.book-carousel .book-card');

        // Get the width of the current card
        const currentCard = cards[currentIndex];
        const cardWidth = currentCard.getBoundingClientRect().width; // Get the width of the current card

        currentIndex++;

        cards.forEach((card, index) => {
            // Reset styles for all cards
            card.classList.remove('active');
            card.style.transform = 'scale(0.9)';
            card.style.opacity = '0.5';

            if (index === currentIndex) {
                // Style the active card
                card.classList.add('active');
                card.style.transform = 'scale(1)';
                card.style.opacity = '1';
            }
        });
        // Update container's translateX to center the active card
        bookCards.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        // Schedule the next iteration
        setTimeout(autoIterate, 500); // Adjust the timing (e.g., 3000ms = 3 seconds)
    }
}

// Fetch next book and update
function fetchNextBook(action) {
    const bookId = document.querySelector('input[name="bookId"]').value;
    const userId = document.querySelector('input[name="userId"]').value;

    // Fetch next book details first
    fetch(`/home/next-book?action=${action}`, {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').getAttribute('content')
        }
    })
        .then(response => response.json())
        .then(nextBook => {
            if (nextBook) {
                // Add the current book to the library if the action is 'accept'
                if (action === 'accept') {
                    fetch(`/profile/addBookToLibrary`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').getAttribute('content')
                        },
                        body: JSON.stringify({ userId: userId, bookId: bookId })
                    }).catch(error => {
                        console.error('Error adding book to library:', error);
                    });
                }

                // Update the UI with the next book details
                addBookCard(nextBook);
                endIndex = document.querySelectorAll('.book-card').length - 1;

                document.querySelector('input[name="bookId"]').value = nextBook.id;
                document.querySelector('.title').textContent = nextBook.title;
                document.querySelector('.author').textContent = nextBook.author;
                document.querySelector('.genre').textContent = nextBook.genres;
                document.querySelector('.description').textContent = nextBook.description || 'No description available';
                document.querySelector('.book-image img').src = nextBook.thumbnailUrl;

                autoIterate();
            } else {
                alert('No more books in the list.');
            }
        })
        .catch(error => {
            console.error('Error fetching next book:', error);
        });
}

// Modal handling (optional)
function showModal() {
    const modal = document.getElementById('description-modal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('description-modal');
    modal.style.display = 'none';
}

// Optional: Close the modal when clicking outside of it
window.onclick = function (event) {
    const modal = document.getElementById('description-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

function loadTrendingBooks() {
    fetch('/home/trending-books', {
        method: 'GET',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').getAttribute('content')
        }
    })
        .then(response => response.json())
        .then(books => {
            books.forEach(book => {
                addTrendingBookCard(book);
            });
        })
        .catch(error => console.error('Error fetching trending books:', error));
}

// Add Trending Book Card
function addTrendingBookCard(book) {
    const trendingContainer = document.querySelector('.trending-books-carousel .book-cards');
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');

    const img = document.createElement('img');
    img.src = book.thumbnailUrl;
    img.alt = `Cover of ${book.title}`;
    img.addEventListener('click', () => {
        window.location.href = `/book/${book.id}`;
    });

    bookCard.appendChild(img);
    trendingContainer.appendChild(bookCard);
}

// Call this function to populate trending books on page load
document.addEventListener('DOMContentLoaded', loadTrendingBooks);