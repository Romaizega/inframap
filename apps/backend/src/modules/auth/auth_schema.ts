import { z } from "zod"

export const registerZodSchema = {
    body: z.object({
        name: z.string().min(3, ({message: ""})),
        country: z.string().min(3, ({message: ""})),
        city: z.string().min(3, ({message: ""})),
        phone_number: z.string().min(3, ({message: ""})),

        email: z.string().email({message: "Invalid email format"}),
        password: z.string().min(8, {message: "Password must be at least 8 characters"}),
        username: z.string().min(3, ({message: "Username must be at least 3 characters"})),
        first_name: z.string().min(3, ({message: "First name must be at least 3 characters"})),
        last_name: z.string().min(3, ({message: "Last name must be at least 3 characters"})),
    })
}

export const loginZodSchema = {
    body: z.object({
        email: z.string().email({message: "Invalid credentials"}),
        password: z.string().min(8, ({message: "Invalid credentials"}))
    })
}

export type RegisterDTO = z.infer<typeof registerZodSchema.body>
export type LoginDTO = z.infer<typeof loginZodSchema.body>


