"use server";

import { Product, Category } from "@/types/product";

// Using DummyJSON API - reliable real-world product data
const API_BASE_URL = "https://dummyjson.com";

// DummyJSON Product interface
interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface DummyProductsResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

// Map DummyJSON data to our Product interface
function mapDummyProductToProduct(dummyProduct: DummyProduct): Product {
  const originalPrice =
    dummyProduct.price / (1 - dummyProduct.discountPercentage / 100);

  return {
    id: dummyProduct.id.toString(),
    name: dummyProduct.title,
    price: Math.round(dummyProduct.price * 100) / 100,
    originalPrice:
      dummyProduct.discountPercentage > 0
        ? Math.round(originalPrice * 100) / 100
        : undefined,
    description: dummyProduct.description,
    image: dummyProduct.thumbnail,
    images: dummyProduct.images || [dummyProduct.thumbnail],
    category: mapDummyCategory(dummyProduct.category),
    brand: dummyProduct.brand || "Unknown Brand",
    sizes: getSizesForCategory(dummyProduct.category),
    colors: getColorsForProduct(),
    inStock: dummyProduct.stock > 0,
    stockCount: dummyProduct.stock,
    rating: dummyProduct.rating || 4.0,
    reviewCount: Math.floor(Math.random() * 200) + 10, // DummyJSON doesn't provide this
    featured: Math.random() > 0.7, // 30% chance of being featured
    tags: generateTagsFromCategory(dummyProduct.category),
  };
}

// Map DummyJSON categories to our category system
function mapDummyCategory(dummyCategory: string): string {
  const categoryMap: Record<string, string> = {
    smartphones: "accessories",
    laptops: "accessories",
    fragrances: "accessories",
    skincare: "accessories",
    groceries: "accessories",
    "home-decoration": "accessories",
    furniture: "accessories",
    tops: "womens-clothing",
    "womens-dresses": "womens-clothing",
    "womens-shoes": "shoes",
    "mens-shirts": "mens-clothing",
    "mens-shoes": "shoes",
    "mens-watches": "accessories",
    "womens-watches": "accessories",
    "womens-bags": "accessories",
    "womens-jewellery": "accessories",
    sunglasses: "accessories",
    automotive: "accessories",
    motorcycle: "accessories",
    lighting: "accessories",
  };

  return categoryMap[dummyCategory] || "accessories";
}

// Get appropriate sizes based on category
function getSizesForCategory(category: string): string[] {
  if (
    category.includes("clothing") ||
    category.includes("shirts") ||
    category.includes("tops") ||
    category.includes("dresses")
  ) {
    return ["XS", "S", "M", "L", "XL"];
  } else if (category.includes("shoes")) {
    return ["7", "8", "9", "10", "11", "12"];
  } else {
    return ["One Size"];
  }
}

// Generate colors based on product title
function getColorsForProduct(): string[] {
  const colorSets = [
    ["Black", "White", "Gray"],
    ["Navy", "Black", "White"],
    ["Brown", "Tan", "Black"],
    ["Blue", "Red", "Green"],
    ["Pink", "Purple", "White"],
  ];
  return colorSets[Math.floor(Math.random() * colorSets.length)];
}

// Generate tags from category
function generateTagsFromCategory(category: string): string[] {
  const tagMap: Record<string, string[]> = {
    smartphones: ["tech", "mobile", "device"],
    laptops: ["tech", "computer", "work"],
    fragrances: ["beauty", "scent", "luxury"],
    skincare: ["beauty", "care", "health"],
    tops: ["casual", "fashion", "comfortable"],
    "womens-dresses": ["elegant", "formal", "fashion"],
    "womens-shoes": ["fashion", "comfortable", "style"],
    "mens-shirts": ["formal", "casual", "professional"],
    "mens-shoes": ["formal", "casual", "leather"],
    "womens-bags": ["accessory", "fashion", "handbag"],
    "womens-jewellery": ["jewelry", "elegant", "gift"],
    sunglasses: ["accessory", "protection", "style"],
  };

  return tagMap[category] || ["fashion", "style", "quality"];
}

// Server action to fetch all products
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products?limit=100`, {
      cache: "force-cache",
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DummyProductsResponse = await response.json();
    console.log(`Fetched ${data.products.length} products from DummyJSON`);

    return data.products.map(mapDummyProductToProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Server action to fetch featured products
export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await fetchProducts();
    return products.filter((product) => product.featured);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

// Server action to fetch a single product by ID
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const dummyProduct: DummyProduct = await response.json();
    return mapDummyProductToProduct(dummyProduct);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

// Server action to fetch products by category
export async function fetchProductsByCategory(
  category: string
): Promise<Product[]> {
  try {
    // Get all products and filter by our category system
    const allProducts = await fetchProducts();
    return allProducts.filter((product) => product.category === category);
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
}

// Server action to fetch categories
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const _dummyCategories: string[] = await response.json();

    // Create our standard categories
    const standardCategories: Category[] = [
      {
        id: "1",
        name: "Men's Clothing",
        slug: "mens-clothing",
        image: "/categories/mens-clothing.jpg",
        description: "Stylish clothing for men",
      },
      {
        id: "2",
        name: "Women's Clothing",
        slug: "womens-clothing",
        image: "/categories/womens-clothing.jpg",
        description: "Fashion-forward clothing for women",
      },
      {
        id: "3",
        name: "Accessories",
        slug: "accessories",
        image: "/categories/accessories.jpg",
        description: "Complete your look with accessories",
      },
      {
        id: "4",
        name: "Shoes",
        slug: "shoes",
        image: "/categories/shoes.jpg",
        description: "Comfortable and stylish footwear",
      },
    ];

    return standardCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Server action to search products
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`,
      {
        cache: "force-cache",
        next: { revalidate: 1800 }, // Cache search for 30 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DummyProductsResponse = await response.json();
    return data.products.map(mapDummyProductToProduct);
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}

// Authentication types
interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

// Server action to login user
export async function loginUser(username: string, password: string): Promise<{ user?: LoginResponse; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { error: errorData?.message || 'Invalid credentials' };
    }

    const user: LoginResponse = await response.json();
    return { user };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Network error. Please try again.' };
  }
}

// Server action to register user (simulated with DummyJSON users)
export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  password: string
): Promise<{ user?: Partial<LoginResponse>; error?: string }> {
  try {
    // DummyJSON doesn't support registration, so we'll simulate it
    // In a real app, this would create a new user in your database
    
    // Basic validation
    if (!firstName || !lastName || !email || !username || !password) {
      return { error: 'All fields are required.' };
    }
    
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters long.' };
    }
    
    // For demo purposes, we'll return a mock user
    const mockUser: Partial<LoginResponse> = {
      id: Math.floor(Math.random() * 1000) + 100,
      username,
      email,
      firstName,
      lastName,
      image: `https://robohash.org/${username}?set=set1&size=150x150`,
      token: 'demo-token-' + Date.now(),
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { user: mockUser };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Registration failed. Please try again.' };
  }
}
