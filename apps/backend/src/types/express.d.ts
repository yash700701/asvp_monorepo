import { JwtUser } from "../middleware/requireAuth";

declare global {
    namespace Express {
        interface User extends JwtUser {}
    }
}
