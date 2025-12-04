// Example utility functions for the API

/**
 * Async wrapper for Express route handlers
 * Catches errors and passes them to error middleware
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Pagination helper
 * @param {number} page - Current page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {Object} Pagination parameters for Sequelize
 */
export const getPagination = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { limit, offset };
};

/**
 * Format pagination response
 * @param {Array} data - Array of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total count
 */
export const formatPaginationResponse = (data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

/**
 * Validate required fields in request body
 * @param {Object} body - Request body
 * @param {Array} fields - Required field names
 * @throws {Error} If required field is missing
 */
export const validateRequiredFields = (body, fields) => {
  const missing = fields.filter((field) => !body[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};
