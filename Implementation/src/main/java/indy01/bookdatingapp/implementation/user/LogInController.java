package indy01.bookdatingapp.implementation.user;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpSession;
import java.util.Optional;

@Controller
@RequestMapping("/log-in")
@CrossOrigin(origins = "http://localhost:8080")
@SessionAttributes("loggedInUser")
public class LogInController {

    private final UserService userService;

    @Autowired
    public LogInController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public String showLoginForm(Model model) {
        if (!model.containsAttribute("user")) {
            model.addAttribute("user", new User());  // Add an empty User object only if not present
        }
        return "log-in";  // View name for log-in.html
    }
}