import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(5,"Isername must be atleast 5 characters")
    .max(20,"Username must be less than 21 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special Character")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(7,{message:"Must be more than 6 characters"})
})