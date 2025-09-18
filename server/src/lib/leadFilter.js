export const buildLeadFilter = (queryParams, userId) => {
  const query = { user: userId };

  if (queryParams.email) query.email = queryParams.email;
  if (queryParams.email_contains)
    query.email = { $regex: queryParams.email_contains, $options: "i" };

  if (queryParams.company) query.company = queryParams.company;
  if (queryParams.company_contains)
    query.company = { $regex: queryParams.company_contains, $options: "i" };

  if (queryParams.city) query.city = queryParams.city;
  if (queryParams.city_contains)
    query.city = { $regex: queryParams.city_contains, $options: "i" };

  if (queryParams.status) query.status = queryParams.status;
  if (queryParams.status_in)
    query.status = { $in: queryParams.status_in.split(",") };

  if (queryParams.source) query.source = queryParams.source;
  if (queryParams.source_in)
    query.source = { $in: queryParams.source_in.split(",") };

  if (queryParams.score) query.score = Number(queryParams.score);
  if (queryParams.score_gt)
    query.score = { ...query.score, $gt: Number(queryParams.score_gt) };
  if (queryParams.score_lt)
    query.score = { ...query.score, $lt: Number(queryParams.score_lt) };
  if (queryParams.score_between) {
    const [min, max] = queryParams.score_between.split(",").map(Number);
    query.score = { $gte: min, $lte: max };
  }

  if (queryParams.lead_value) query.lead_value = Number(queryParams.lead_value);
  if (queryParams.lead_value_gt)
    query.lead_value = { ...query.lead_value, $gt: Number(queryParams.lead_value_gt) };
  if (queryParams.lead_value_lt)
    query.lead_value = { ...query.lead_value, $lt: Number(queryParams.lead_value_lt) };
  if (queryParams.lead_value_between) {
    const [min, max] = queryParams.lead_value_between.split(",").map(Number);
    query.lead_value = { $gte: min, $lte: max };
  }

  if (queryParams.created_at_on) {
    const date = new Date(queryParams.created_at_on);
    query.created_at = {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lte: new Date(date.setHours(23, 59, 59, 999)),
    };
  }
  if (queryParams.created_at_before)
    query.created_at = { ...query.created_at, $lt: new Date(queryParams.created_at_before) };
  if (queryParams.created_at_after)
    query.created_at = { ...query.created_at, $gt: new Date(queryParams.created_at_after) };
  if (queryParams.created_at_between) {
    const [start, end] = queryParams.created_at_between.split(",");
    query.created_at = { $gte: new Date(start), $lte: new Date(end) };
  }

  if (queryParams.last_activity_at_on) {
    const date = new Date(queryParams.last_activity_at_on);
    query.last_activity_at = {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lte: new Date(date.setHours(23, 59, 59, 999)),
    };
  }
  if (queryParams.last_activity_at_before)
    query.last_activity_at = { ...query.last_activity_at, $lt: new Date(queryParams.last_activity_at_before) };
  if (queryParams.last_activity_at_after)
    query.last_activity_at = { ...query.last_activity_at, $gt: new Date(queryParams.last_activity_at_after) };
  if (queryParams.last_activity_at_between) {
    const [start, end] = queryParams.last_activity_at_between.split(",");
    query.last_activity_at = { $gte: new Date(start), $lte: new Date(end) };
  }

  if (queryParams.is_qualified)
    query.is_qualified = queryParams.is_qualified === "true";

  return query;
};
