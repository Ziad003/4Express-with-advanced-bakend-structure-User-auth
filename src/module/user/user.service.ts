import { pool } from "../../db";
import type { Iuser } from "./user.interface";
import bcrypt from "bcryptjs";

const createUserToDB=async(payLoad:Iuser)=>{
    const {name,age,password,email}=payLoad;

    const hashPassword=await bcrypt.hash(password,10)

    const result=await pool.query(`
            INSERT INTO users (name,age,password,email) VALUES ($1,$2,$3,$4) RETURNING *
        `,[name,age,hashPassword,email])

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
};

const getAllUsersFromDB=async()=>{
    const result=await pool.query(`
            SELECT * FROM users
        `)
        return result
}

export const userService={
    createUserToDB,
    updateUserIntoDB,
    deleteUserFromDB,
    getAllUsersFromDB
}