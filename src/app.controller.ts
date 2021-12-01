import { Controller, Get, UseGuards } from '@nestjs/common';
import { FronteggGuard } from './frontegg.guard';

@Controller()
export class AppController {
  @Get('/public')
  getHello(): string {
    return 'This is public route';
  }

  @Get('/private')
  @UseGuards(FronteggGuard())
  getPrivate(): string {
    return 'This is private route';
  }

  @Get('/admin')
  @UseGuards(FronteggGuard({ roles: ['admin'] }))
  getAdmin(): string {
    return 'This is admin route';
  }

  @Get('/upload')
  @UseGuards(FronteggGuard({ permissions: ['file.upload'] }))
  getUploadFile(): string {
    return 'This is permission route';
  }
}
