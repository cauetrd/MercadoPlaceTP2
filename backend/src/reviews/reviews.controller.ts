import {
  Body,
  Controller,
  Delete,
  Get,
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
import { UserResponseDto } from '../users/dto/user.dto';
import {
  CreateReviewDto,
  ReviewResponseDto,
  UpdateReviewDto,
} from './dto/review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova avaliação de mercado' })
  @ApiResponse({
    status: 201,
    description: 'Avaliação criada com sucesso',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Você já avaliou este mercado' })
  @ApiResponse({ status: 404, description: 'Mercado não encontrado' })
  create(
    @CurrentUser() user: UserResponseDto,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.id, createReviewDto);
  }

  @Get('market/:marketId')
  @ApiOperation({ summary: 'Obter todas as avaliações de um mercado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de avaliações do mercado',
    type: [ReviewResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Mercado não encontrado' })
  findByMarket(@Param('marketId') marketId: string) {
    return this.reviewsService.findByMarket(marketId);
  }

  @Get('market/:marketId/rating')
  @ApiOperation({ summary: 'Obter avaliação média de um mercado' })
  @ApiResponse({
    status: 200,
    description: 'Avaliação média do mercado',
    schema: {
      properties: {
        averageRating: { type: 'number' },
        totalReviews: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Mercado não encontrado' })
  getMarketAverageRating(@Param('marketId') marketId: string) {
    return this.reviewsService.getMarketAverageRating(marketId);
  }

  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter todas as avaliações do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de avaliações do usuário',
    type: [ReviewResponseDto],
  })
  findByUser(@CurrentUser() user: UserResponseDto) {
    return this.reviewsService.findByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter avaliação por ID' })
  @ApiResponse({
    status: 200,
    description: 'Avaliação encontrada',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma avaliação' })
  @ApiResponse({
    status: 200,
    description: 'Avaliação atualizada com sucesso',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  @ApiResponse({
    status: 400,
    description: 'Você só pode atualizar suas próprias avaliações',
  })
  update(
    @CurrentUser() user: UserResponseDto,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(user.id, id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover uma avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  @ApiResponse({
    status: 400,
    description: 'Você só pode remover suas próprias avaliações',
  })
  remove(@CurrentUser() user: UserResponseDto, @Param('id') id: string) {
    return this.reviewsService.remove(user.id, id);
  }
}
