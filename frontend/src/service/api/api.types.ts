// ===== API Types for MercadoPlace Backend =====

// ===== BASE TYPES =====
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// ===== AUTH TYPES =====
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

// ===== PRODUCT TYPES =====
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

// ===== MARKET TYPES =====
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

// ===== REVIEW TYPES =====
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

// ===== SHOPPING LIST TYPES =====
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

// ===== API RESPONSE TYPES =====
export interface ApiError {
  message: string | string[];
  error: string;
  statusCode: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  message?: string;
  statusCode?: number;
}

// ===== API ENDPOINTS TYPES =====
export interface ApiEndpoints {
  // Auth endpoints
  auth: {
    register: (data: CreateUserDto) => Promise<AuthResponse>;
    login: (data: LoginDto) => Promise<AuthResponse>;
    profile: () => Promise<UserResponseDto>;
  };

  // User endpoints
  users: {
    updateProfile: (data: UpdateUserDto) => Promise<UserResponseDto>;
    getPurchaseHistory: () => Promise<PurchaseHistoryResponse[]>;
  };

  // Product endpoints
  products: {
    create: (data: CreateProductDto) => Promise<ProductResponseDto>;
    findAll: (params?: ProductSearchDto) => Promise<ProductResponseDto[]>;
    findPendingApproval: () => Promise<ProductResponseDto[]>;
    findByMarket: (marketId: string) => Promise<ProductResponseDto[]>;
    findOne: (id: string) => Promise<ProductResponseDto>;
    update: (id: string, data: UpdateProductDto) => Promise<ProductResponseDto>;
    approve: (id: string) => Promise<ProductResponseDto>;
    reject: (id: string) => Promise<void>;
    remove: (id: string) => Promise<void>;
  };

  // Market endpoints
  markets: {
    create: (data: CreateMarketDto) => Promise<MarketResponseDto>;
    findAll: () => Promise<MarketResponseDto[]>;
    findNearby: (
      latitude: number,
      longitude: number,
      radius?: number
    ) => Promise<MarketResponseDto[]>;
    findOne: (id: string) => Promise<MarketResponseDto>;
    update: (id: string, data: UpdateMarketDto) => Promise<MarketResponseDto>;
    remove: (id: string) => Promise<void>;
    addProduct: (
      marketId: string,
      productId: string
    ) => Promise<MarketResponseDto>;
    removeProduct: (
      marketId: string,
      productId: string
    ) => Promise<MarketResponseDto>;
  };

  // Review endpoints
  reviews: {
    create: (data: CreateReviewDto) => Promise<ReviewResponseDto>;
    findByMarket: (marketId: string) => Promise<ReviewResponseDto[]>;
    getMarketAverageRating: (marketId: string) => Promise<MarketRatingResponse>;
    findByUser: () => Promise<ReviewResponseDto[]>;
    findOne: (id: string) => Promise<ReviewResponseDto>;
    update: (id: string, data: UpdateReviewDto) => Promise<ReviewResponseDto>;
    remove: (id: string) => Promise<void>;
  };

  // Shopping List endpoints
  shoppingList: {
    addItem: (
      data: AddToShoppingListDto
    ) => Promise<ShoppingListItemResponseDto>;
    getShoppingList: () => Promise<ShoppingListItemResponseDto[]>;
    getSelectedItemsTotal: () => Promise<ShoppingListTotalResponse>;
    updateItem: (
      itemId: string,
      data: UpdateShoppingListItemDto
    ) => Promise<ShoppingListItemResponseDto>;
    removeItem: (itemId: string) => Promise<void>;
    clearShoppingList: () => Promise<void>;
    finalizePurchase: (
      data: FinalizePurchaseDto
    ) => Promise<PurchaseHistoryResponse>;
  };
}

// ===== HTTP METHODS =====
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

// ===== API CONFIG =====
export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// ===== ROUTE DEFINITIONS =====
export const API_ROUTES = {
  // Auth routes
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGIN: "/auth/login",
  AUTH_PROFILE: "/auth/profile",

  // User routes
  USERS_PROFILE: "/users/profile/me",
  USERS_PURCHASE_HISTORY: "/users/purchase-history/me",

  // Product routes
  PRODUCTS: "/products",
  PRODUCTS_PENDING: "/products/pending",
  PRODUCTS_BY_MARKET: (marketId: string) => `/products/market/${marketId}`,
  PRODUCTS_BY_ID: (id: string) => `/products/${id}`,
  PRODUCTS_APPROVE: (id: string) => `/products/${id}/approve`,
  PRODUCTS_REJECT: (id: string) => `/products/${id}/reject`,

  // Market routes
  MARKETS: "/markets",
  MARKETS_NEARBY: "/markets/nearby",
  MARKETS_BY_ID: (id: string) => `/markets/${id}`,
  MARKETS_ADD_PRODUCT: (marketId: string, productId: string) =>
    `/markets/${marketId}/products/${productId}`,
  MARKETS_REMOVE_PRODUCT: (marketId: string, productId: string) =>
    `/markets/${marketId}/products/${productId}`,

  // Review routes
  REVIEWS: "/reviews",
  REVIEWS_BY_MARKET: (marketId: string) => `/reviews/market/${marketId}`,
  REVIEWS_MARKET_RATING: (marketId: string) =>
    `/reviews/market/${marketId}/rating`,
  REVIEWS_BY_USER: "/reviews/user/me",
  REVIEWS_BY_ID: (id: string) => `/reviews/${id}`,

  // Shopping List routes
  SHOPPING_LIST: "/shopping-list",
  SHOPPING_LIST_ITEMS: "/shopping-list/items",
  SHOPPING_LIST_TOTAL: "/shopping-list/total",
  SHOPPING_LIST_ITEM: (itemId: string) => `/shopping-list/items/${itemId}`,
  SHOPPING_LIST_CLEAR: "/shopping-list/clear",
  SHOPPING_LIST_FINALIZE: "/shopping-list/finalize",
} as const;

// ===== QUERY PARAMS TYPES =====
export interface ProductsQueryParams extends ProductSearchDto {}

export interface MarketsNearbyQueryParams {
  latitude: number;
  longitude: number;
  radius?: number;
}

// ===== FORM TYPES (for React forms) =====
export interface LoginFormData extends LoginDto {}
export interface RegisterFormData extends CreateUserDto {}
export interface UpdateProfileFormData extends UpdateUserDto {}
export interface CreateProductFormData extends CreateProductDto {}
export interface UpdateProductFormData extends UpdateProductDto {}
export interface CreateMarketFormData extends CreateMarketDto {}
export interface UpdateMarketFormData extends UpdateMarketDto {}
export interface CreateReviewFormData extends CreateReviewDto {}
export interface UpdateReviewFormData extends UpdateReviewDto {}
export interface AddToShoppingListFormData extends AddToShoppingListDto {}
export interface UpdateShoppingListItemFormData
  extends UpdateShoppingListItemDto {}

// ===== VALIDATION SCHEMAS (for form validation) =====
export interface ValidationRules {
  email: {
    required: boolean;
    pattern: RegExp;
  };
  password: {
    required: boolean;
    minLength: number;
  };
  name: {
    required: boolean;
    minLength: number;
  };
  rating: {
    required: boolean;
    min: number;
    max: number;
  };
  quantity: {
    required: boolean;
    min: number;
  };
  price: {
    required: boolean;
    min: number;
  };
  coordinates: {
    required: boolean;
    min: number;
    max: number;
  };
}

export const VALIDATION_RULES: ValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 6,
  },
  name: {
    required: true,
    minLength: 2,
  },
  rating: {
    required: true,
    min: 1,
    max: 5,
  },
  quantity: {
    required: true,
    min: 1,
  },
  price: {
    required: true,
    min: 0,
  },
  coordinates: {
    required: true,
    min: -90,
    max: 90,
  },
};

// ===== UTILITY TYPES =====
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// ===== STORE/STATE TYPES =====
export interface AuthState {
  user: UserResponseDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ProductsState {
  products: ProductResponseDto[];
  pendingProducts: ProductResponseDto[];
  currentProduct: ProductResponseDto | null;
  isLoading: boolean;
  error: string | null;
  searchFilters: ProductSearchDto;
}

export interface MarketsState {
  markets: MarketResponseDto[];
  nearbyMarkets: MarketResponseDto[];
  currentMarket: MarketResponseDto | null;
  isLoading: boolean;
  error: string | null;
}

export interface ReviewsState {
  reviews: ReviewResponseDto[];
  userReviews: ReviewResponseDto[];
  currentReview: ReviewResponseDto | null;
  isLoading: boolean;
  error: string | null;
}

export interface ShoppingListState {
  items: ShoppingListItemResponseDto[];
  total: ShoppingListTotalResponse;
  purchaseHistory: PurchaseHistoryResponse[];
  isLoading: boolean;
  error: string | null;
}

// ===== COMPONENT PROPS TYPES =====
export interface ProductCardProps {
  product: ProductResponseDto;
  onAddToCart?: (productId: string) => void;
  onEdit?: (product: ProductResponseDto) => void;
  onDelete?: (productId: string) => void;
  showActions?: boolean;
  isAdmin?: boolean;
}

export interface MarketCardProps {
  market: MarketResponseDto;
  onView?: (marketId: string) => void;
  onEdit?: (market: MarketResponseDto) => void;
  onDelete?: (marketId: string) => void;
  showActions?: boolean;
  isAdmin?: boolean;
}

export interface ReviewCardProps {
  review: ReviewResponseDto;
  onEdit?: (review: ReviewResponseDto) => void;
  onDelete?: (reviewId: string) => void;
  showActions?: boolean;
  isOwner?: boolean;
}

export interface ShoppingListItemProps {
  item: ShoppingListItemResponseDto;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onToggleSelection?: (itemId: string, isSelected: boolean) => void;
  onRemove?: (itemId: string) => void;
}

// ===== HOOK TYPES =====
export interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseAuthReturn {
  user: UserResponseDto | null;
  login: (credentials: LoginDto) => Promise<void>;
  register: (userData: CreateUserDto) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: UpdateUserDto) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ===== CONSTANTS =====
export const API_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export const SORT_OPTIONS = {
  PRICE_ASC: { value: "price", order: "asc" as const },
  PRICE_DESC: { value: "price", order: "desc" as const },
  NAME_ASC: { value: "name", order: "asc" as const },
  NAME_DESC: { value: "name", order: "desc" as const },
} as const;

export const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;

export const DEFAULT_SEARCH_RADIUS = 10; // km
