import {Pool} from "pg";
import config from "../config";

export const pool=new Pool({
    connectionString:config.connection_string
})

export const initDB=async()=>{
    try {
        await pool.query(`
                CREATE TABLE IF NOT EXISTS users(
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(20) NOT NULL,
                    age INT NOT NULL
                )
            `)
            console.log("Table created successfully");
    } catch (error) {
        console.log("Database initialization failed:", error)
        throw(error)
    }
}