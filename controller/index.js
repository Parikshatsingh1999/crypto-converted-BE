import axios from "axios";

const apiUrl = 'https://api.coingecko.com/api/v3';

const caches = {}

export const getcryptoCurrencies = async (req, res) => {
    let result = null;
    try {
        res.set({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://crypto-converter-fe.vercel.app',
            // Add more headers as needed
        });
        // caching is done, as the api calls that can be made are limited
        if (caches.getcryptoCurrencies) result = caches.getcryptoCurrencies;
        if (!result) {
            const top100 = axios.get(`${apiUrl}/coins/markets`, {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                }
            });

            const supportedCurrencies = axios.get(`${apiUrl}/simple/supported_vs_currencies`);

            const [res1, res2] = await Promise.all([top100, supportedCurrencies]);
            result = { cryptos: res1.data, supportedCurrencies: res2.data };
            caches.getcryptoCurrencies = result;
        }
        res.headers()
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: error?.message || 'Internal Server Error' });
    }

}

export const getExchangeRates = async (req, res) => {
    const { crypto, amount, target } = req.query;

    if (!crypto || !amount || !target) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    try {
        const exchangeRateResponse = await axios.get(`${apiUrl}/simple/price`, {
            params: {
                ids: crypto,
                vs_currencies: target
            }
        });

        const exchangeRate = exchangeRateResponse.data[crypto][target];

        if (!exchangeRate) {
            return res.status(404).json({ error: 'Exchange rate not found' });
        }

        const convertedAmount = amount * exchangeRate;

        res.status(200).json({ crypto, amount, target, convertedAmount });

    } catch (error) {
        res.status(500).json({ error: error?.message || 'Internal Server Error' });
    }
}