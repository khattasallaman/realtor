import { ExecutionContext, createParamDecorator } from "@nestjs/common";


export interface UserInfo {
        name: string;
        id: number;
        iat: number;
        exp: number
    
}
export const User = createParamDecorator((data, context:ExecutionContext):UserInfo => {
    const req = context.switchToHttp().getRequest();
    return req.user
})