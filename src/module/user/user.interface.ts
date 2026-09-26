export interface Iuser{
    name:string,
    age:number,
    password:string,
    email:string,
    role?:"user" | "admin" | "agent"
}