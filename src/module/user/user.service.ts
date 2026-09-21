import { pool } from "../../db";
import type { Iuser } from "./user.interface";
import bcrypt from "bcryptjs";

const createUserToDB=async(payLoad:Iuser)=>{
    const {name,age,password}=payLoad;

    const hashPassword=await bcrypt.hash(password,10)

    const result=await pool.query(`
            INSERT INTO users (name,age,password) VALUES ($1,$2,$3) RETURNING *
        `,[name,age,hashPassword])

        delete result.rows[0].password
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