// src/portfolio/portfolio.controller.ts
import {
    Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseUUIDPipe,
  } from '@nestjs/common';
  import { PortfolioService } from './portfolio.service';
  import { CreatePortfolioDto } from './dto/create-portfolio.dto';
  import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import JWT Guard
  
  @Controller('portfolios') // Base path /portfolios
  export class PortfolioController {
    constructor(private readonly portfolioService: PortfolioService) {}
  
    // Endpoint ini memerlukan login (JWT valid)
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createPortfolioDto: CreatePortfolioDto, @Request() req) {
      // req.user berisi data dari JwtStrategy (misal: { userId: '...', username: '...' })
      return this.portfolioService.create(createPortfolioDto, req.user);
    }
  
    @Get() // Endpoint publik untuk melihat semua portfolio
    findAll() {
      return this.portfolioService.findAll();
    }
  
    // Endpoint publik untuk melihat detail portfolio
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.portfolioService.findOne(id);
    }
  
    // Endpoint ini memerlukan login
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updatePortfolioDto: UpdatePortfolioDto,
      @Request() req,
    ) {
      // Pastikan user hanya bisa update portfolio miliknya (logika ada di service)
      return this.portfolioService.update(id, updatePortfolioDto, req.user);
    }
  
    // Endpoint ini memerlukan login
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
      // Pastikan user hanya bisa delete portfolio miliknya (logika ada di service)
      return this.portfolioService.remove(id, req.user);
    }
  }