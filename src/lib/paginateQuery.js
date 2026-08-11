export async function paginateQuery(query, { page, limit }) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await query.range(from, to)

  return {
    data,
    count: count ?? 0,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
    error,
  }
}