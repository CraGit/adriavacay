# Villa/Accommodation Pricing Validation System

This system implements comprehensive input validation to filter out villa/accommodation properties with null or undefined prices and discounts in the Next.js villa booking app.

## Overview

The validation system ensures that:

- Only accommodations with valid pricing data are displayed to users
- Null, undefined, or zero prices are filtered out
- Invalid discount data is cleaned or filtered out
- Price calculations are protected from invalid data
- User experience is enhanced by showing appropriate error messages

## Files Modified

### Core Validation (`/src/lib/validation.js`)

Contains all validation functions:

- `isValidPriceItem()` - Validates individual pricing items
- `isValidDiscountItem()` - Validates individual discount items
- `filterValidPriceRanges()` - Filters pricing arrays
- `filterValidDiscountRanges()` - Filters discount arrays
- `isAccommodationPricingValid()` - Validates entire accommodations
- `filterAccommodationsWithValidPricing()` - Filters accommodation lists
- `cleanAccommodationPricingData()` - Cleans accommodation data
- `hasSufficientPricingData()` - Checks if data is sufficient for calculations

### Price Calculation Functions (`/src/lib/utils.js`)

Updated to use validation:

- `calculateTotalPrice()` - Now filters invalid prices before calculation
- `calculateTotalPriceWithDiscount()` - Validates both prices and discounts
- `filterByChangeoverDayAndMinimumStay()` - Uses validated price ranges

### Calendar Utilities (`/src/lib/cal-utils.js`)

Enhanced date availability checking:

- `isDateAvailable()` - Now validates price ranges and checks for positive prices

### Data Fetching (`/src/slices/AccommodationListSlice/index.js`)

Filters accommodations at the data source:

- Cleans pricing data after fetching from Prismic
- Filters out accommodations with insufficient pricing data
- Ensures only valid accommodations reach the UI

### UI Components

#### Accommodation Display (`/src/app/[locale]/accommodation/accommodation-single.jsx`)

- Filters accommodations by pricing validity
- Only renders accommodations with valid pricing data
- Handles edge cases where pricing calculations return zero

#### Price Display (`/src/app/[locale]/accommodation/[uid]/price-display.jsx`)

- Validates pricing data before calculations
- Shows appropriate error messages for invalid pricing
- Gracefully handles cases where price calculation fails

#### Card Component (`/src/components/Card.jsx`)

- Enhanced price display logic
- Shows "Price unavailable" for invalid pricing
- Validates prices before displaying currency

## Validation Rules

### Price Item Validation

A price item is valid if:

- `date_start` is not null/undefined
- `date_end` is not null/undefined
- `price` is not null/undefined
- `price` is greater than 0

### Discount Item Validation

A discount item is valid if:

- `date_start` is not null/undefined
- `date_end` is not null/undefined
- `percentage` is not null/undefined
- `percentage` is between 0 and 100 (inclusive)

### Accommodation Validation

An accommodation is valid if:

- It has a `pricing` array
- At least one pricing item in the array passes validation
- Empty pricing arrays are considered invalid

## Error Handling

### Price Display Component

- Shows "Pricing information is currently unavailable" when no valid pricing exists
- Shows "Unable to calculate price for the selected dates" when calculations fail
- Maintains user experience with helpful error messages

### Card Component

- Displays "Price unavailable" instead of showing invalid prices
- Prevents display of null/undefined/zero prices
- Maintains consistent card layout even with invalid data

### Data Flow Protection

- Invalid data is filtered at multiple levels:
  1. Data fetching (AccommodationListSlice)
  2. Component rendering (accommodation-single)
  3. Price calculations (utils functions)
  4. UI display (Card, PriceDisplay)

## Testing

Run the validation test file to verify functionality:

```bash
node src/lib/validation-test.js
```

The test covers:

- Individual item validation
- Array filtering
- Accommodation validation
- Data cleaning
- Edge cases and error scenarios

## Benefits

1. **Data Integrity**: Ensures only valid pricing data reaches users
2. **User Experience**: Clear error messages instead of broken displays
3. **System Reliability**: Prevents calculation errors from invalid data
4. **Maintainability**: Centralized validation logic
5. **Performance**: Early filtering reduces unnecessary processing
6. **Scalability**: Easy to extend validation rules

## Future Enhancements

- Add logging for filtered invalid data
- Implement admin notifications for properties with invalid pricing
- Add automatic data validation in Prismic webhooks
- Create dashboard for monitoring data quality
- Add unit tests for all validation functions

## Usage Examples

```javascript
// Filter valid pricing data
const validPrices = filterValidPriceRanges(accommodation.pricing);

// Check if accommodation has sufficient pricing
if (isAccommodationPricingValid(accommodation)) {
  // Safe to display and calculate prices
}

// Clean accommodation data
const cleanedAccommodation = cleanAccommodationPricingData(accommodation);

// Filter accommodation list
const validAccommodations =
  filterAccommodationsWithValidPricing(allAccommodations);
```

## Integration with Existing Code

The validation system integrates seamlessly with existing code:

- No breaking changes to existing APIs
- Backward compatible with current data structures
- Progressive enhancement approach
- Minimal performance impact
- Clear separation of concerns
