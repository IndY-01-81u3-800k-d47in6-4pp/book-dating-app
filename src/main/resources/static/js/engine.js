let currentIndex = 0;
let endIndex = 0;
const bookCardsContainer = document.querySelector('.book-cards-container');
const bookCards = document.querySelector('.book-cards');
const prevArrow = document.querySelector('#prev-arrow');
const nextArrow = document.querySelector('#next-arrow');

// Function to update carousel state
function updateCarousel() {
    const cards = document.querySelectorAll('.book-card');

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
    if (currentIndex < document.querySelectorAll('.book-card').length - 1) {
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
}

// Automatically iterate through book cards
function autoIterate() {
    const cards = document.querySelectorAll('.book-card');
    if (currentIndex - 1 < endIndex) {
        currentIndex++;
        updateCarousel();

        // Schedule the next iteration
        setTimeout(autoIterate, 500); // Adjust the timing (e.g., 3000ms = 3 seconds)
    }
}

// Fetch next book and update
function fetchNextBook(action) {
    const bookId = document.querySelector('input[name="bookId"]').value;
    const userId = document.querySelector('input[name="userId"]').value;

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

    fetch(`/home/next-book?action=${action}`, {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]').getAttribute('content')
        }
    })
        .then(response => response.json())
        .then(book => {
            if (book) {
                // Start automatic iteration
                addBookCard(book);
                endIndex = document.querySelectorAll('.book-card').length - 1;
                autoIterate();

                document.querySelector('input[name="bookId"]').value = book.id;
                document.querySelector('.title').textContent = book.title;
                document.querySelector('.description').textContent = book.description || 'No description available';
                document.querySelector('.book-image img').src = book.thumbnailUrl;
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
