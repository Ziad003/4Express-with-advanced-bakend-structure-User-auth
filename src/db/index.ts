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
                    age INT NOT NULL,

                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);

        await pool.query(`
                CREATE TABLE IF NOT EXISTS profile(
                    id SERIAL PRIMARY KEY,
                    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,

                    bio TEXT,
                    address TEXT,

                    created_at TIMESTAMP DEFAULT NOW(),
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `)
        

    console.log("Table created successfully");
    } catch (error) {
        console.log("Database initialization failed:", error)
        throw(error)
    }
}