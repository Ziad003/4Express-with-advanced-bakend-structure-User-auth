import app from "./app"
import config from "./config"
import { initDB } from "./db"

const main=()=>{
    try {
        initDB();
        app.listen(config.port, () => {
        console.log(`Example app listening on port ${config.port}`)
    })
    } catch (error) {
        console.error("Server could not start:", error);
        process.exit(1);
    }
}
main()