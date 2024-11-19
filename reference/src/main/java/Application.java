import io.github.cdimascio.dotenv.Dotenv;

public class Application {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().load();
        System.out.println("MONGO_URI: " + dotenv.get("MONGO_URI"));
    }
}
