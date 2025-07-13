import { PartialType } from '@nestjs/swagger';
import { CreatePurchasedProductDto } from './create-purchased-product.dto';

export class UpdatePurchasedProductDto extends PartialType(
  CreatePurchasedProductDto,
) {}
