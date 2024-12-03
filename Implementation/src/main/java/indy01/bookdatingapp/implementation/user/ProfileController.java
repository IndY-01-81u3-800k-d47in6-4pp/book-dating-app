package indy01.bookdatingapp.implementation.user;

import indy01.bookdatingapp.implementation.book.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/addBookToLibrary")
    public String addBookToLibrary(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String bookId = payload.get("bookId");

        userService.addBookToUserLibrary(userId, bookId);
        return "redirect:/profile?userId=" + userId;
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteBooks(@RequestBody Map<String, Object> requestBody) {
        try {
            // Extract userId and bookIds from the request body
            String userId = (String) requestBody.get("userId");
            Object bookIdsObject = requestBody.get("bookIds");

            // Basic validation
            if (userId == null || userId.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID is missing.");
            }

            // Validate and safely cast bookIds
            if (bookIdsObject instanceof List<?> bookIdsRaw) {
                List<String> bookIds = bookIdsRaw.stream()
                        .filter(item -> item instanceof String)
                        .map(String.class::cast)
                        .toList();

                if (bookIds.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No valid book IDs provided for deletion.");
                }

                // Remove the books from the user's library
                userService.removeBooksFromUserLibrary(userId, bookIds);

                return ResponseEntity.ok("Books deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid format for book IDs.");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting books");
        }
    }
}
