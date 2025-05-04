import { Controller, Post, Delete, Get, Param, UseGuards, Request, ParseUUIDPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // Semua endpoint di controller ini butuh login
@Controller('bookmarks') // Base path /bookmarks
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  // Endpoint untuk mendapatkan semua bookmark milik user yang login
  @Get()
  findMyBookmarks(@Request() req) {
    return this.bookmarkService.findUserBookmarks(req.user);
  }

  // Endpoint untuk menambah bookmark
  @Post(':portfolioId')
  addBookmark(
    @Param('portfolioId', ParseUUIDPipe) portfolioId: string,
    @Request() req,
  ) {
    return this.bookmarkService.addBookmark(portfolioId, req.user);
  }

  // Endpoint untuk menghapus bookmark
  @Delete(':portfolioId')
  @HttpCode(HttpStatus.NO_CONTENT) // Status 204 No Content untuk delete sukses
  removeBookmark(
    @Param('portfolioId', ParseUUIDPipe) portfolioId: string,
    @Request() req,
  ) {
    return this.bookmarkService.removeBookmark(portfolioId, req.user);
  }
}