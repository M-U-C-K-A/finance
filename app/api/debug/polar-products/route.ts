import { NextResponse } from "next/server";
import { listPolarProducts } from "@/lib/polar";

export async function GET() {
  try {
    const products = await listPolarProducts();
    
    return NextResponse.json({
      success: true,
      products: products,
      message: "Use these product IDs in your POLAR_PRODUCTS configuration"
    });
  } catch (error) {
    console.error("Error listing Polar products:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch Polar products",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}