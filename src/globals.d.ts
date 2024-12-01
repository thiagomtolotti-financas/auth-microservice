import { JwtPayload } from "jsonwebtoken";

export type JWT = { user_id: string } & JwtPayload;
