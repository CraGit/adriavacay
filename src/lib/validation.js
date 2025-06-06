/**
 * Validation utilities for filtering accommodations with null/undefined pricing and discount data
 */

/**
 * Validates if a pricing item has valid data
 * @param {Object} priceItem - Pricing item from Prismic
 * @returns {boolean} - True if price item is valid
 */
export const isValidPriceItem = (priceItem) => {
  if (!priceItem) return false;

  return (
    priceItem.date_start !== null &&
    priceItem.date_start !== undefined &&
    priceItem.date_end !== null &&
    priceItem.date_end !== undefined &&
    priceItem.price !== null &&
    priceItem.price !== undefined &&
    priceItem.price > 0
  );
};

/**
 * Validates if a discount item has valid data
 * @param {Object} discountItem - Discount item from Prismic
 * @returns {boolean} - True if discount item is valid
 */
export const isValidDiscountItem = (discountItem) => {
  if (!discountItem) return false;

  return (
    discountItem.date_start !== null &&
    discountItem.date_start !== undefined &&
    discountItem.date_end !== null &&
    discountItem.date_end !== undefined &&
    discountItem.percentage !== null &&
    discountItem.percentage !== undefined &&
    discountItem.percentage >= 0 &&
    discountItem.percentage <= 100
  );
};

/**
 * Filters out pricing items with null/undefined values
 * @param {Array} priceRanges - Array of pricing items
 * @returns {Array} - Filtered array with only valid pricing items
 */
export const filterValidPriceRanges = (priceRanges) => {
  if (!Array.isArray(priceRanges)) return [];

  return priceRanges.filter(isValidPriceItem);
};

/**
 * Filters out discount items with null/undefined values
 * @param {Array} discountRanges - Array of discount items
 * @returns {Array} - Filtered array with only valid discount items
 */
export const filterValidDiscountRanges = (discountRanges) => {
  if (!Array.isArray(discountRanges)) return [];

  return discountRanges.filter(isValidDiscountItem);
};

/**
 * Validates if an accommodation has sufficient pricing data to be displayed
 * @param {Object} accommodation - Accommodation object from Prismic
 * @returns {boolean} - True if accommodation has valid pricing data
 */
export const isAccommodationPricingValid = (accommodation) => {
  if (!accommodation || !accommodation.data) return false;

  const pricing = accommodation.data.pricing || accommodation.pricing;

  if (!pricing || !Array.isArray(pricing) || pricing.length === 0) {
    return false;
  }

  // Check if at least one pricing item is valid
  const validPriceItems = filterValidPriceRanges(pricing);
  return validPriceItems.length > 0;
};

/**
 * Filters accommodations to only include those with valid pricing data
 * @param {Array} accommodations - Array of accommodation objects
 * @returns {Array} - Filtered array with only accommodations that have valid pricing
 */
export const filterAccommodationsWithValidPricing = (accommodations) => {
  if (!Array.isArray(accommodations)) return [];

  return accommodations.filter(isAccommodationPricingValid);
};

/**
 * Validates and cleans pricing data for an accommodation
 * @param {Object} accommodation - Accommodation object
 * @returns {Object} - Accommodation with cleaned pricing and discount data
 */
export const cleanAccommodationPricingData = (accommodation) => {
  if (!accommodation) return null;

  const cleanedAccommodation = { ...accommodation };

  // Clean pricing data
  if (cleanedAccommodation.data?.pricing) {
    cleanedAccommodation.data.pricing = filterValidPriceRanges(
      cleanedAccommodation.data.pricing
    );
  }
  if (cleanedAccommodation.pricing) {
    cleanedAccommodation.pricing = filterValidPriceRanges(
      cleanedAccommodation.pricing
    );
  }

  // Clean discount data
  if (cleanedAccommodation.data?.discounts) {
    cleanedAccommodation.data.discounts = filterValidDiscountRanges(
      cleanedAccommodation.data.discounts
    );
  }
  if (cleanedAccommodation.discounts) {
    cleanedAccommodation.discounts = filterValidDiscountRanges(
      cleanedAccommodation.discounts
    );
  }

  return cleanedAccommodation;
};

/**
 * Validates if pricing and discount arrays are not empty after filtering
 * @param {Array} priceRanges - Array of pricing items
 * @param {Array} discountRanges - Array of discount items (optional)
 * @returns {boolean} - True if pricing data is sufficient for calculations
 */
export const hasSufficientPricingData = (priceRanges, discountRanges = []) => {
  const validPrices = filterValidPriceRanges(priceRanges);
  const validDiscounts = filterValidDiscountRanges(discountRanges);

  // Must have at least one valid price range
  // Discounts are optional, so we don't require them
  return validPrices.length > 0;
};
