/* ---------- Markets & Portfolio ---------- */

import axiosClient from "./axiosClient";
import { TRADE_ENDPOINTS } from "./endpoints";

export async function fetchMarkets() {
  const { data } = await axiosClient.get(TRADE_ENDPOINTS.MARKETS);
  return data.markets || [];
}

export async function fetchMyPortfolio() {
  const { data } = await axiosClient.get(TRADE_ENDPOINTS.PORTFOLIO);
  return data.portfolio || { items: [] };
}

/* ---------- Orders ---------- */

export async function placeOrder(
  assetId: string,
  side: "buy" | "sell",
  quantity: number
) {
  return axiosClient.post(TRADE_ENDPOINTS.ORDER, {
    assetId,
    side,
    quantity,
  });
}

/* ---------- Trades ---------- */

export async function createTrade(tradeData: any) {
  return axiosClient.post(TRADE_ENDPOINTS.TRADES, tradeData);
}

export async function getMyTrades() {
  const { data } = await axiosClient.get(TRADE_ENDPOINTS.MY_TRADES);
  return data.trades || [];
}

export async function getTradesByUserId(userId: string) {
  const { data } = await axiosClient.get(
    TRADE_ENDPOINTS.TRADES_BY_USER(userId)
  );
  return data.trades || [];
}

export async function getAllTrades(
  limit = 20,
  skip = 0,
  filters = {}
) {
  const { data } = await axiosClient.get(TRADE_ENDPOINTS.TRADES, {
    params: { limit, skip, ...filters },
  });
  return data.trades || [];
}

export async function getTrade(tradeId: string) {
  const { data } = await axiosClient.get(
    TRADE_ENDPOINTS.TRADE(tradeId)
  );
  return data.trade || null;
}

export async function updateTrade(id: string, tradeData: any) {
  return axiosClient.put(TRADE_ENDPOINTS.UPDATE_TRADE(id), tradeData);
}

export async function deleteTrade(id: string) {
  return axiosClient.delete(TRADE_ENDPOINTS.DELETE_TRADE(id));
}

export async function incrementTradeViews(id: string) {
  return axiosClient.post(TRADE_ENDPOINTS.VIEW_TRADE(id));
}

export async function toggleTradeSave(id: string, saved: boolean) {
  return axiosClient.post(TRADE_ENDPOINTS.SAVE_TRADE(id), { saved });
}

export async function getSavedTrades() {
  const { data } = await axiosClient.get(TRADE_ENDPOINTS.SAVED_TRADES);
  return {
    savedTradeIds: data.savedTradeIds || [],
    trades: data.trades || [],
  };
}

/* ---------- Investors ---------- */

export async function fetchInvestors(params?: {
  limit?: number;
  skip?: number;
}) {
  const { data } = await axiosClient.get(TRADE_ENDPOINTS.INVESTORS, {
    params,
  });
  return data.investors || [];
}

export async function getInvestorDetails(userId: string) {
  try {
    const { data } = await axiosClient.get(
      TRADE_ENDPOINTS.INVESTOR_DETAILS(userId)
    );
    return data?.investorDetails || null;
  } catch {
    return null;
  }
}
