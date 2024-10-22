import { CustomError } from "./CustomError";

export class NotFound extends CustomError {
    constructor(message: string){
        super(message, 404);
    }
}