package indy01.bookdatingapp.implementation.user;

import indy01.bookdatingapp.implementation.book.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:8080")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping()
    public String showProfilePage(@RequestParam("userId") String userId, Model model) {
        List<Book> books = userService.getUserLibraryBooks(userId);
        model.addAttribute("books", books);
        model.addAttribute("isLibraryEmpty", books.isEmpty());  // Flag to check if the library is empty
        return "profile";
    }
/*
    @PostMapping(value = "/addBookToLibrary")
    public String addBookToLibrary(@RequestParam("userId") String userId, @RequestParam("bookId") String bookId) {
        userService.addBookToUserLibrary(userId, bookId);
        return "redirect:/profile?userId=" + userId;
    }
*/
    @PostMapping("/addBookToLibrary")
    public String addBookToLibrary(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String bookId = payload.get("bookId");

        userService.addBookToUserLibrary(userId, bookId);
        return "redirect:/profile?userId=" + userId;
    }
}
