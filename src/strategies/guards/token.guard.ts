import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TokenGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!this.validateAuthorizationHeader(request)) {
            throw new UnauthorizedException('Missing or invalid Authorization header');
        }

        return true;
    }

    private validateAuthorizationHeader(request: Request): boolean {
        const authorizationHeader = request.headers['Authorization'] || request.headers['authorization'];

        // Add more sophisticated validation logic here if needed
        return !!authorizationHeader;
    }
}