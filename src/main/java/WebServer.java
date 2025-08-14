import static spark.Spark.*;


public class WebServer {
    public static void main(String[] args) {
        port(8080); // 设置端口为 8080

        // 当用户访问 "/" 时，返回 HTML 页面
        get("/", (req, res) -> {
            return "<h1>欢迎来到我的网页揭秘！</h1><p>点我没啥用 😆</p>";
        });

        // 你也可以加载本地静态 HTML 页面：
        staticFiles.location("/public");  // src/main/resources/public 下的 index.html 会自动提供
    }

}
