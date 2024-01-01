import express from "express";

import { getcryptoCurrencies, getExchangeRates } from "../controller/index.js";

const router = express.Router();

router.route('/details').get(getcryptoCurrencies)

router.route('/exchangerate').get(getExchangeRates)

export { router }