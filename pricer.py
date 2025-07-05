import yfinance as yf
import numpy as np
import pandas as pd
from scipy.stats import norm

# === PARAMÈTRES ===
T = 1
r = 0.02
sigma = 0.25
K_factor = 1.05
WACC = 0.08
g_terminal = 0.02

tickers = [
    "AI.PA", "AIR.PA", "ALO.PA", "MT.AS", "CS.PA", "BNP.PA", "EN.PA", "CAP.PA",
    "CA.PA", "ACA.PA", "BN.PA", "DSY.PA", "ENGI.PA", "EL.PA", "RMS.PA", "KER.PA",
    "OR.PA", "LR.PA", "MC.PA", "ML.PA", "ORA.PA", "RI.PA", "PUB.PA", "UG.PA",
    "GLE.PA", "SAN.PA", "SU.PA", "SW.PA", "STLA.PA", "STM.PA", "TEC.PA", "HO.PA",
    "TTE.PA", "URW.AS", "VIE.PA", "DG.PA", "VIV.PA", "FR.PA", "WLN.PA", "X.PA"
]

def black_scholes_call(S, K, T, r, sigma):
    d1 = (np.log(S/K) + (r + sigma**2 / 2)*T) / (sigma*np.sqrt(T))
    d2 = d1 - sigma*np.sqrt(T)
    call_price = S * norm.cdf(d1) - K * np.exp(-r*T) * norm.cdf(d2)
    delta = norm.cdf(d1)
    return call_price, delta

def binomial_call(S, K, T, r, sigma, N=100):
    dt = T / N
    u = np.exp(sigma * np.sqrt(dt))
    d = 1 / u
    p = (np.exp(r*dt) - d) / (u - d)
    prices = np.zeros(N+1)
    for i in range(N+1):
        ST = S * (u**(N-i)) * (d**i)
        prices[i] = max(0, ST - K)
    for j in range(N-1, -1, -1):
        for i in range(j+1):
            prices[i] = np.exp(-r*dt) * (p * prices[i] + (1 - p) * prices[i+1])
    return prices[0]

def monte_carlo_call(S, K, T, r, sigma, M=10000):
    Z = np.random.standard_normal(M)
    ST = S * np.exp((r - 0.5*sigma**2)*T + sigma*np.sqrt(T)*Z)
    payoff = np.maximum(ST - K, 0)
    return np.exp(-r*T) * np.mean(payoff)

def graham_formula(eps, growth):
    if eps is None or growth is None:
        return None
    return eps * (8.5 + 2 * (growth * 100))

def dcf_model(fcf, growth, WACC, g_terminal, years=5):
    if fcf is None or fcf <= 0:
        return None
    fcf_list = [fcf * (1 + growth)**i for i in range(1, years + 1)]
    dcf_value = sum([fcf_list[i] / (1 + WACC)**(i+1) for i in range(years)])
    terminal_value = fcf_list[-1] * (1 + g_terminal) / (WACC - g_terminal)
    terminal_value_discounted = terminal_value / (1 + WACC)**(years + 1)
    return dcf_value + terminal_value_discounted

results = []

print("Récupération et calculs en cours...")

for ticker in tickers:
    try:
        t = yf.Ticker(ticker)
        data = t.history(period="5d")
        info = t.info

        if data.empty:
            continue

        S = data["Close"].iloc[-1]
        K = S * K_factor

        bs_price, delta = black_scholes_call(S, K, T, r, sigma)
        bino = binomial_call(S, K, T, r, sigma)
        mc = monte_carlo_call(S, K, T, r, sigma)

        eps = info.get("trailingEps", None)
        growth = info.get("earningsGrowth", 0.05)
        revenue = info.get("totalRevenue", None)
        fcf_est = 0.10 * revenue if revenue else None

        graham = graham_formula(eps, growth)
        dcf_val = dcf_model(fcf_est, growth, WACC, g_terminal)

        results.append({
            "Ticker": ticker,
            "Spot": round(S, 2),
            "Strike": round(K, 2),
            "BS_Price": round(bs_price, 2),
            "Delta": round(delta, 4),
            "Binomial": round(bino, 2),
            "MonteCarlo": round(mc, 2),
            "EPS": round(eps, 2) if eps else "n/a",
            "Growth": round(growth, 2),
            "Graham": round(graham, 2) if graham else "n/a",
            "DCF": round(dcf_val, 2) if dcf_val else "n/a"
        })

    except Exception as e:
        print(f"Erreur sur {ticker} : {e}")

# === ENREGISTREMENT CSV ===
df = pd.DataFrame(results)
df.to_csv("valuation_cac40.csv", index=False)
print("\n✅ Résultats enregistrés dans 'valuation_cac40.csv'\n")

# === AFFICHAGE TERMINAL ===
print(df.sort_values("BS_Price", ascending=False).to_string(index=False))
