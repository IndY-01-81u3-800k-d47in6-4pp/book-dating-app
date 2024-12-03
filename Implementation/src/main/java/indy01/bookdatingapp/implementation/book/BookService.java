package indy01.bookdatingapp.implementation.book;

import indy01.bookdatingapp.implementation.user.User;
import indy01.bookdatingapp.implementation.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {
    @Value("${google.api.key}")
    private String googleApiKey;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;

    public void fetchAndSaveBooks(String searchQuery) {
        String apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" + searchQuery + "&key=" + googleApiKey;

        WebClient webClient = webClientBuilder.build();

        List<Book> books = webClient.get()
                .uri(apiUrl)
                .retrieve()
                .bodyToMono(BookResponse.class)
                .map(bookResponse -> bookResponse.getItems().stream()
                        .map(this::convertToBook)
                        .collect(Collectors.toList()))
                .block();

        bookRepository.saveAll(books);
    }

    private Book convertToBook(BookResponse.Item item) {
        BookResponse.VolumeInfo volumeInfo = item.getVolumeInfo();
        Book book = new Book();

        // Set title
        book.setTitle(volumeInfo.getTitle());

        // Handle authors (null or empty case)
        book.setAuthor(
                volumeInfo.getAuthors() != null && !volumeInfo.getAuthors().isEmpty()
                        ? String.join(", ", volumeInfo.getAuthors())
                        : "Unknown"
        );

        // Set pages
        book.setPages(volumeInfo.getPageCount());

        // Handle description (null case)
        book.setDescription(
                volumeInfo.getDescription() != null
                        ? volumeInfo.getDescription()
                        : "No description available"
        );

        // Handle genres (null or empty case)
        book.setGenres(
                volumeInfo.getCategories() != null && !volumeInfo.getCategories().isEmpty()
                        ? volumeInfo.getCategories()
                        : Collections.singletonList("Unknown")
        );

        // Handle thumbnail URL (null case)
        if (volumeInfo.getImageLinks() != null) {
            book.setThumbnailUrl(volumeInfo.getImageLinks().getThumbnail());
        } else {
            book.setThumbnailUrl(null);
        }

        return book;
    }


    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookByIndex(int index) {
        List<Book> books = getAllBooks();
        return books.size() > index ? books.get(index) : null;  // Returns the book at the current index or null
    }

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public void deleteBook(String id) {
        bookRepository.deleteById(id);
        List<User> users = userRepository.findAll();
        for (User user : users) {
            user.removeBook(id);
            userRepository.save(user);
        }
    }

    public List<Book> getBooksByIds(List<String> bookIds) {
        if (bookIds == null || bookIds.isEmpty() || bookIds.contains(null)) {
            // Handle the case where bookIds are null or contain null entries
            return Collections.emptyList(); // Or handle this in a way suitable for your application
        }
        return bookRepository.findAllById(bookIds);
    }
}
