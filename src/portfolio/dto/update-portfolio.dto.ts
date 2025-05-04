import { PartialType } from '@nestjs/mapped-types'; // Untuk membuat semua field optional
import { CreatePortfolioDto } from './create-portfolio.dto';

export class UpdatePortfolioDto extends PartialType(CreatePortfolioDto) {}