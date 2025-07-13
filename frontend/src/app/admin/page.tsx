"use client";

import { apiService } from "@/service/api/api";
import { ProductResponseDto } from "@/service/api/api.types";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [pending, setPending] = useState<ProductResponseDto[]>([]);

  const approve = async (productId: string) => {
    console.log(`Approving product with ID: ${productId}`);
    const response = await apiService.patch(
      `/products/${productId}/approve`,
      productId
    );
    if (response.ok) {
      setPending(
        response.filter(
          (product: ProductResponseDto) => product.id !== productId
        )
      );
      console.log(`Product ${productId} approved successfully.`);
    }
  };

  useEffect(() => {
    const getPendingProducts = async () => {
      const response = await apiService.get("/products/pending");
      if (response.ok) {
        setPending(response.data);
      } else {
        console.error("Failed to fetch pending products.");
      }
    };

    getPendingProducts();
  }, []);

  return (
    <main>
      <div>Admin, aprovar pedidos, criar novas lojas</div>
      <section>
        {pending.length > 0 ? (
          pending.map((product) => (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: {product.currentPrice}</p>
              <button onClick={() => approve(product.id)}>Approve</button>
            </div>
          ))
        ) : (
          <p>No pending products.</p>
        )}
      </section>
    </main>
  );
}
