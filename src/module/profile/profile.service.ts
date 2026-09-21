import { error } from "node:console";
import { pool } from "../../db";

const createProfileIntoDB=async(payLoad:any)=>{
    // console.log(payLoad);
    const {user_id,bio,address}=payLoad;
    // First check if the user is exists
    const user = await pool.query(`
            SELECT * FROM users WHERE id=$1
        `,[user_id])
        // console.log(user)

    if(user.rows.length===0){
        throw new Error("User not exitsts!")
    }

    const result=await pool.query(`
            INSERT INTO profile (user_id,bio,address) VALUES ($1,$2,$3) RETURNING *
        `,[user_id,bio,address])

        return result
}

export const profileService={
    createProfileIntoDB
}