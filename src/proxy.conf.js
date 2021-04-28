
const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/uploads",
            // "/endpoints",
            // "/i",
            // "/need",
            // "/to",
            // "/proxy"
        ],
        target: "http://localhost:3080",
        secure: false
    }
]

module.exports = PROXY_CONFIG;




