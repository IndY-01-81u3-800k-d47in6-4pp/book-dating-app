package indy01.bookdatingapp.implementation.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Controller
@RequestMapping("/create-account")
@CrossOrigin(origins = "http://localhost:8080")
public class SignUpController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public SignUpController(UserService userService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    @GetMapping
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new User());
        return "create-account";
    }

    @PostMapping
    public String registerUser(@Valid User user, BindingResult result, Model model) {
        if (result.hasErrors()) {
            return "create-account";
        }
        if (userService.getUserByEmail(user.getEmail()).isPresent()
                || userService.getUserByUsername(user.getUsername()).isPresent()) {
            model.addAttribute("message", "Email or username already exists. Try a different one.");
            return "create-account";
        }

        // Save the new user
        userService.createUser(user);

        // Authenticate the new user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Redirect to the home page
        return "redirect:/home";
    }
}
