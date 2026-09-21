import { pool } from "../../db";
import type { Iuser } from "./user.interface";

const createUserToDB=async(payLoad:Iuser)=>{
    const {name,age}=payLoad;
    const result=await pool.query(`
            INSERT INTO users (name,age) VALUES ($1,$2) RETURNING *
        `,[name,age])
        return result
};

const updateUserIntoDB=async(payLoad:Iuser,id:string)=>{
    const {name,age}=payLoad;
    const result=await pool.query(`
            UPDATE users SET name=$1,age=$2 WHERE id=$3
        `,[name,age,id])
        return result;
};

const deleteUserFromDB=async(id:string)=>{
    const result=await pool.query(`
            DELETE FROM users WHERE id=$1 RETURNING *
        `,[id])
        return result
}

export const userService={
    createUserToDB,
    updateUserIntoDB,
    deleteUserFromDB
}