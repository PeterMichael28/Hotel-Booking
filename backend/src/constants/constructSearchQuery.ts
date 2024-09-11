
export const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  // Search by destination (city or country)
  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },  // Case-insensitive search for city
      { country: new RegExp(queryParams.destination, "i") },  // Case-insensitive search for country
    ];
  }

  // Filter by minimum adult count
  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),  // Greater than or equal to specified adult count
    };
  }

  // Filter by minimum child count
  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),  // Greater than or equal to specified child count
    };
  }

  // Filter by facilities
  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],  // Ensure facilities is always an array
    };
  }

  // Filter by accommodation types
  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],  // Ensure types is always an array
    };
  }

  // Filter by star ratings
  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : [parseInt(queryParams.stars)];  // Convert to array of numbers

    constructedQuery.starRating = { $in: starRatings };
  }

  // Filter by maximum price per night
  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),  // Less than or equal to specified max price
    };
  }

  return constructedQuery;
};

