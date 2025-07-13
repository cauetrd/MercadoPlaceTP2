import { PartialType } from '@nestjs/swagger';
import { CreateReviewMarketDto } from './create-review-market.dto';

export class UpdateReviewMarketDto extends PartialType(CreateReviewMarketDto) {}
