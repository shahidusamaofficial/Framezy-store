// Resolves the price for a specific size. Falls back to the product's flat
// `price` if the product has no sizePrices, or if that particular size
// isn't listed in sizePrices — so this is always safe to call.
export function getPriceForSize(product, size) {
  if (product?.sizePrices && size && product.sizePrices[size] != null) {
    return product.sizePrices[size];
  }
  return product?.price ?? 0;
}

// Returns { min, max } across all of a product's sizes. If there's no
// variation (or no sizePrices at all), min === max === product.price.
export function getPriceRange(product) {
  if (!product?.sizePrices || !product?.sizes?.length) {
    return { min: product?.price ?? 0, max: product?.price ?? 0 };
  }
  const values = product.sizes.map((s) => getPriceForSize(product, s));
  return { min: Math.min(...values), max: Math.max(...values) };
}
