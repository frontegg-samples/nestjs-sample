import { IdentityClient } from '@frontegg/client';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';

export interface FronteggGuardOptions {
  roles?: string[];
  permissions?: string[];
}

export const FronteggGuard = (options?: FronteggGuardOptions) => {
  return mixin(
    class FronteggGuard implements CanActivate {
      async canActivate(context: ExecutionContext): Promise<boolean> {
        const accessToken = context.switchToHttp().getRequest()
          .headers.authorization;

        try {
          await IdentityClient.getInstance().validateIdentityOnToken(
            accessToken,
            options,
          );
        } catch (e) {
          if (e.statusCode === HttpStatus.UNAUTHORIZED) {
            throw new UnauthorizedException(e.message);
          }

          if (e.statusCode === HttpStatus.FORBIDDEN) {
            throw new ForbiddenException(e.message);
          }

          throw e;
        }

        return true;
      }
    },
  );
};
