"use client";

import { BackToHome } from "@/components/backToHome/backToHome";
import { PRODUCTS_DATA } from "@/data/productsData";
import { usePagination } from "@/hooks/usePagination";
import { Product } from "@/types";
import { PaginationControls } from "@/views/products/paginationControls/paginationControls";
import { ProductList } from "@/views/products/productList/productList";
import { ProductModal } from "@/views/products/productModal/productModal";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const Products: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { currentPage, totalPages, paginatedItems: paginatedProducts, handlePageChange } = usePagination({
    items: PRODUCTS_DATA,
    itemsPerPage: 5,
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle opening the modal based on searchParams
  useEffect(() => {
    const productId = searchParams.get("product-id");

    if (productId) {
      const product = PRODUCTS_DATA.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
      }
    } else {
      setSelectedProduct(null);
    }
  }, [searchParams]);

  // Open modal and update the URL using router.push
  const handleOpenModal = useCallback(
    (product: Product) => {
      setSelectedProduct(product);
      const params = new URLSearchParams(searchParams.toString());
      params.set("product-id", product.id);
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Close modal and update the URL using router.push
  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("product-id");
    router.push(`/products?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div>
      <BackToHome />
      <ProductList products={paginatedProducts} onOpenModal={handleOpenModal} />
      <div className="h-4" />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};
