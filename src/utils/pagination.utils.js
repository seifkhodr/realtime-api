const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function toPositiveInteger(value, fallback) {
    const parsedValue = Number.parseInt(value, 10);
    return Number.isInteger(parsedValue) && parsedValue > 0
        ? parsedValue
        : fallback;
}

function getPaginationParams(query = {}) {
    const page = toPositiveInteger(query.page, DEFAULT_PAGE);
    const requestedLimit = toPositiveInteger(query.limit, DEFAULT_LIMIT);
    const limit = Math.min(requestedLimit, MAX_LIMIT);

    return { page, limit };
}

function createPaginationMeta(page, limit, totalItems) {
    const totalPages = Math.ceil(totalItems / limit);

    return {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
    };
}

export {
    getPaginationParams,
    createPaginationMeta
};