# Getting Started with Frontegg Nest.JS authentication guard

This sample provides samples on how to protect your Nest.JS controller routes using a simple guard which utilizes the Frontegg Node.JS SDK.

### Create a guard called `FronteggGuard` under `frontegg.guard.ts`
```typescript
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

```

### Importing the guard on your controllers
```typescript
import { FronteggGuard } from './frontegg.guard';
```

### Setting your clientId and apiKey on the context holder
```typescript
import { ContextHolder } from '@frontegg/client';

ContextHolder.setContext({
    FRONTEGG_CLIENT_ID: '<YOUR_CLIENT_ID>',
    FRONTEGG_API_KEY: '<YOUR_API_KEY>',
});
```

### Protected route with authentication guard
```typescript
@Get('/private')
@UseGuards(FronteggGuard())
getPrivate(): string {
    return 'This is private route';
}
```

### Authorizing routes by role
```typescript
@Get('/admin')
@UseGuards(FronteggGuard({ roles: ['admin'] }))
getAdmin(): string {
    return 'This is admin route';
}
```
### Authorizing routes by permission
```typescript
@Get('/upload')
@UseGuards(FronteggGuard({ permissions: ['file.upload'] }))
getUploadFile(): string {
    return 'This is permission route';
}
```
## Running the sample

After cloning the project, install it using

### `yarn`

In order to run the project, run
### `yarn start`

The application will be opened on [http://localhost:8080](http://localhost:8080) in developement mode.

### Running few samples

Public route should be accessible without authentication.
```shell
curl -I http://localhost:8080/public
```

Private route should require authentication
```shell
curl -I http://localhost:8080/private
```

Admins route should require admin role
```shell
curl -I http://localhost:8080/admin
```

Upload route should require `file.upload` permission
```shell
curl -I http://localhost:8080/upload
```
