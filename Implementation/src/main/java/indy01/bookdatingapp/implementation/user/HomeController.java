package indy01.bookdatingapp.implementation.user;

import indy01.bookdatingapp.implementation.book.Book;
import indy01.bookdatingapp.implementation.book.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/home")
@CrossOrigin(origins = "http://localhost:8080")
public class HomeController {

    @Autowired
    private BookService bookService;

    private int currentIndex = 0;

    @GetMapping()
    public String showHomePage(Model model) {
        Book book = bookService.getBookByIndex(currentIndex);
        model.addAttribute("book", book);
        return "home";
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