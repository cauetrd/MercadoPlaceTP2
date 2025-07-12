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
}

export interface PriceHistory {
  id: string;
  price: number;
  createdAt: string;
}

export interface ProductResponseDto extends BaseEntity {
  name: string;
  description?: string | null;
  currentPrice: number;
  imageUrl?: string | null;
  isValid: boolean;
  priceHistory?: PriceHistory[];
  markets?: MarketResponseDto[];
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
  availableProducts?: ProductResponseDto[];
  reviews?: ReviewResponseDto[];
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
  quantity: number;
}

export interface UpdateShoppingListItemDto {
  quantity?: number;
  isSelected?: boolean;
}

export interface ShoppingListItemResponseDto extends BaseEntity {
  quantity: number;
  isSelected: boolean;
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

export interface PurchasedItem {
  id: string;
  productName: string;
  priceAtTime: number;
  quantity: number;
  productId?: string | null;
  product?: ProductResponseDto | null;
}

export interface PurchaseHistoryResponse {
  id: string;
  totalCost: number;
  userId: string;
  createdAt: string;
  purchasedItems: PurchasedItem[];
}
