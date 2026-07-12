import { Controller, Get, Param } from '@nestjs/common';
import { AdminService } from './admin.service.js';

@Controller('api/admin/list')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get(':manager')
  getAdminList(@Param('manager') manager: string) {
    return this.adminService.getAdminList(manager);
  }
}
