export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  latitude?: number;
  longitude?: number;
  isAdmin?: boolean;
}

export interface UpdateUserDto {
  name?: string;
  password?: string;
  latitude?: number;
  longitude?: number;
}

export interface UserResponseDto extends BaseEntity {
  email: string;
  name: string;
  latitude?: number | null;
  longitude?: number | null;
  isAdmin: boolean;
  points: number;
}

export interface AuthResponse {
  user: UserResponseDto;
  access_token: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  currentPrice: number;
  imageUrl?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  currentPrice?: number;
  imageUrl?: string;
  isValid?: boolean;
}

export interface ProductSearchDto {
  name?: string;
  sortBy?: "price" | "name";
  sortOrder?: "asc" | "desc";
  userLatitude?: number;
  userLongitude?: number;
  marketId?: string;
}

export interface PriceHistory {
  id: string;
  price: number;
  createdAt: string;
}

export interface MarketProductResponseDto extends BaseEntity {
  marketId: string;
  productId: string;
  price: number;
  lastPrice?: number | null;
  isValid: boolean;
  market?: MarketResponseDto;
  product?: ProductResponseDto;
}

export interface CreateMarketProductDto {
  marketId: string;
  productId: string;
  price: number;
}

export interface UpdateMarketProductDto {
  price?: number;
}

export interface ProductResponseDto extends BaseEntity {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  marketProducts?: MarketProductResponseDto[];
}

export interface CreateMarketDto {
  name: string;
  latitude: number;
  longitude: number;
  productIds?: string[];
}

export interface UpdateMarketDto {
  name?: string;
  latitude?: number;
  longitude?: number;
  productIds?: string[];
}

export interface MarketResponseDto extends BaseEntity {
  name: string;
  latitude: number;
  longitude: number;
  products?: MarketProductResponseDto[];
  reviews?: ReviewResponseDto[];
  distance?: number;
}

export interface CreateReviewDto {
  marketId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}

export interface ReviewResponseDto extends BaseEntity {
  rating: number;
  comment?: string | null;
  userId: string;
  marketId: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
  market?: {
    id: string;
    name: string;
  };
}

export interface MarketRatingResponse {
  averageRating: number;
  totalReviews: number;
}

export interface AddToShoppingListDto {
  productId: string;
}

export interface UpdateShoppingListItemDto {
  // UserShoppingList only has userId and productId in schema
}

export interface ShoppingListItemResponseDto extends BaseEntity {
  userId: string;
  productId: string;
  product?: ProductResponseDto;
}

export interface ShoppingListTotalResponse {
  total: number;
  itemCount: number;
}

export interface FinalizePurchaseDto {
  selectedItemIds: string[];
}

export interface PurchasedProductResponseDto extends BaseEntity {
  userId: string;
  productId: string;
  marketId: string;
  purchaseId: string;
  price: number;
  user?: UserResponseDto;
  product?: ProductResponseDto;
  market?: MarketResponseDto;
}

export interface PurchaseHistoryResponse extends BaseEntity {
  userId: string;
  totalPrice: number;
  products: PurchasedProductResponseDto[];
  user?: UserResponseDto;
}
