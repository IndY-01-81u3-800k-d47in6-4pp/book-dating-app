package indy01.bookdatingapp.implementation;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import static org.springframework.test.util.AssertionErrors.assertNotNull;

@SpringBootTest
class ImplementationApplicationTests {

    @Test
    void contextLoads() {
    }

    @Value("${MONGO_URI}")
    private String mongoUri;

    @Test
    void testMongoUriLoaded() {
        assertNotNull(mongoUri, "MONGO_URI should not be null");
        System.out.println("MONGO_URI: " + mongoUri);
    }

}
