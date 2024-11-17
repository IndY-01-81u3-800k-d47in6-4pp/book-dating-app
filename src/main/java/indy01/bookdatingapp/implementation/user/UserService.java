package indy01.bookdatingapp.implementation.user;

import indy01.bookdatingapp.implementation.book.Book;
import indy01.bookdatingapp.implementation.book.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    private BookService bookService;

    // Save a user to the MongoDB database with an encoded password
    public void createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));  // Encode password before saving
        userRepository.save(user);
    }

    // Find a user by username
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Find a user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Find user by either email or username
    public Optional<User> findByUsernameOrEmail(String identifier) {
        return userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByUsername(identifier));
    }

    // Check login credentials based on email or username (used directly in CustomAuthenticationProvider)
    public Optional<User> login(String identifier, String password) {
        Optional<User> user = findByUsernameOrEmail(identifier);
        return user.filter(u -> passwordEncoder.matches(password, u.getPassword()));
    }

    public void addBookToUserLibrary(String userId, String bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));
        System.out.println("I will now attempt to add book");
        if (!user.getBooks().contains(bookId)) user.addBook(bookId);
        else {System.out.println("Book with ID: " + bookId +" Present");}
        userRepository.save(user);
    }

    public List<Book> getUserLibraryBooks(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));
        return bookService.getBooksByIds(user.getBooks());
    }
}