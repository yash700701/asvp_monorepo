// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// export function getCurrentUser() {
//     const token = cookies().get("auth_token")?.value;
//     if (!token) return null;

//     try {
//         return jwt.verify(token, process.env.JWT_SECRET!);
//     } catch {
//         return null;
//     }
// }
