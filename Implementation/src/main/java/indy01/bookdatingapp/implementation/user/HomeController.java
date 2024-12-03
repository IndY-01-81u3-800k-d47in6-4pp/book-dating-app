package indy01.bookdatingapp.implementation.user;

import indy01.bookdatingapp.implementation.book.Book;
import indy01.bookdatingapp.implementation.book.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/home")
@CrossOrigin(origins = "http://localhost:8080")
public class HomeController {

    @Autowired
    private BookService bookService;

    private int currentIndex = 0;

    @GetMapping()
    public String showHomePage(Model model) {
        // Get the currently authenticated user's username
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Book book = bookService.getBookByIndex(currentIndex);
        model.addAttribute("book", book);
        model.addAttribute("username", username); // Add username to the model
        return "home";
    }

    @GetMapping(value = "/initial-book", produces = "application/json")
    @ResponseBody
    public Book getInitialBook() {
        // Logic to fetch the first book for the user
        return bookService.getBookByIndex(currentIndex);
    }

    @GetMapping(value = "/trending-books", produces = "application/json")
    @ResponseBody
    public List<Book> getTrendingBooks() {
        return bookService.getAllBooks();
    }

    @PostMapping(value = "/next-book", produces = "application/json")
    @ResponseBody
    public Book getNextBook(@RequestParam("action") String action) {
        if ("accept".equals(action)) {
            // Here you might add logic to save the book to the user's library
            System.out.println("accept");
        }
        currentIndex++;
        return bookService.getBookByIndex(currentIndex);
    }
}