package indy01.bookdatingapp.implementation.config;

import indy01.bookdatingapp.implementation.user.CustomUserDetailsService;
import indy01.bookdatingapp.implementation.user.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final HttpSession session; // Add HttpSession to store userId

    @Autowired
    public CustomAuthenticationProvider(CustomUserDetailsService userDetailsService
            , PasswordEncoder passwordEncoder, HttpSession session) {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.session = session;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String identifier = authentication.getName();
        String password = authentication.getCredentials().toString();

        UserDetails user = userDetailsService.loadUserByUsername(identifier);


        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password.");
        }

        if (user instanceof User) {
            User customUser = (User) user;
            String userId = customUser.getId();  // Assuming getId() returns the userId

            // Store userId in the session
            session.setAttribute("userId", userId);
        }

        // Set the authentication token in the SecurityContext
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, password, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        return authToken;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}