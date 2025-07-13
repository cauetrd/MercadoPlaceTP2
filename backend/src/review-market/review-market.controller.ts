import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReviewMarketDto } from './dto/create-review-market.dto';
import { ReviewMarketDto } from './dto/review-market.dto';
import { UpdateReviewMarketDto } from './dto/update-review-market.dto';
import { ReviewMarketService } from './review-market.service';

@ApiTags('Review Market')
@Controller('review-market')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReviewMarketController {
  constructor(private readonly reviewMarketService: ReviewMarketService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new market review' })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: ReviewMarketDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Market not found',
  })
  @ApiResponse({
    status: 409,
    description: 'User already reviewed this market',
  })
  create(
    @Body() createReviewMarketDto: CreateReviewMarketDto,
    @CurrentUser() user: any,
  ) {
    return this.reviewMarketService.create(createReviewMarketDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all market reviews' })
  @ApiResponse({
    status: 200,
    description: 'List of all market reviews',
    type: [ReviewMarketDto],
  })
  findAll() {
    return this.reviewMarketService.findAll();
  }

  @Get('market/:marketId')
  @ApiOperation({ summary: 'Get all reviews for a specific market' })
  @ApiResponse({
    status: 200,
    description: 'List of reviews for the market',
    type: [ReviewMarketDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Market not found',
  })
  findByMarket(@Param('marketId') marketId: string) {
    return this.reviewMarketService.findByMarket(marketId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all reviews by a specific user' })
  @ApiResponse({
    status: 200,
    description: 'List of reviews by the user',
    type: [ReviewMarketDto],
  })
  findByUser(@Param('userId') userId: string) {
    return this.reviewMarketService.findByUser(userId);
  }

  @Get('market/:marketId/average')
  @ApiOperation({ summary: 'Get average rating for a market' })
  @ApiResponse({
    status: 200,
    description: 'Average rating and total reviews for the market',
    schema: {
      type: 'object',
      properties: {
        averageRating: { type: 'number' },
        totalReviews: { type: 'number' },
      },
    },
  })
  getMarketAverageRating(@Param('marketId') marketId: string) {
    return this.reviewMarketService.getMarketAverageRating(marketId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiResponse({
    status: 200,
    description: 'Review found',
    type: ReviewMarketDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  findOne(@Param('id') id: string) {
    return this.reviewMarketService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
    type: ReviewMarketDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  @ApiResponse({
    status: 409,
    description: 'You can only update your own reviews',
  })
  update(
    @Param('id') id: string,
    @Body() updateReviewMarketDto: UpdateReviewMarketDto,
    @CurrentUser() user: any,
  ) {
    return this.reviewMarketService.update(id, updateReviewMarketDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({
    status: 204,
    description: 'Review deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Review not found',
  })
  @ApiResponse({
    status: 409,
    description: 'You can only delete your own reviews',
  })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.reviewMarketService.remove(id, user.id);
  }
}
