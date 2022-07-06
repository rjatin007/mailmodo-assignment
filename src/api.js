const URL =
  "https://data.messari.io/api/v1/assets?fields=id,slug,symbol,metrics/market_data/price_usd";

export const fetchPrices = () =>
  fetch(URL)
    .then((res) => res.json())
    .then((res) => res);
