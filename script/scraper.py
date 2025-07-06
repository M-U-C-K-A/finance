import yfinance as yf
import pandas as pd
import os
from datetime import datetime
import time

# ─── CONFIG ─────────────────────────────────────────────────────
INTERVAL = '1d'  # ou '5m' si marché ouvert
PERIOD = '5d'    # tu peux augmenter pour plus d'historique
DATA_DIR = '../data'
# ────────────────────────────────────────────────────────────────

# Liste manuelle CAC 40 (peut être automatisée via scraping)
CAC40_TICKERS = [
    "AIR.PA", "ALO.PA", "AI.PA", "MT.AS", "ATO.PA", "CS.PA", "BNP.PA", "EN.PA",
    "CAP.PA", "CA.PA", "ACA.PA", "BN.PA", "DSY.PA", "ENGI.PA", "EL.PA", "RMS.PA",
    "KER.PA", "OR.PA", "LR.PA", "MC.PA", "ML.PA", "ORA.PA", "RI.PA", "PUB.PA",
    "SGO.PA", "GLE.PA", "SU.PA", "SW.PA", "STM.PA", "TEC.PA", "URW.AS", "VIE.PA",
    "DG.PA", "VIV.PA", "WLN.PA", "FR.PA", "HO.PA", "SAN.PA", "STLA.PA", "TTE.PA"
]

# Récupérer tous les tickers du NASDAQ via yfinance
def get_nasdaq_tickers():
    print("[INFO] Fetching NASDAQ tickers from CSV")
    url = 'https://pkgstore.datahub.io/core/nasdaq-listings/nasdaq-listed_csv/data/8b8173f9b30f6500bc9a43dcf7b0f9d3/nasdaq-listed_csv.csv'
    try:
        df = pd.read_csv(url)
        return df['Symbol'].tolist()
    except Exception as e:
        print(f"[ERROR] Can't load NASDAQ tickers: {e}")
        return []

# Fonction pour scraper un ticker et sauvegarder localement
def scrape_and_save(ticker, date_folder):
    try:
        df = yf.download(ticker, period=PERIOD, interval=INTERVAL, progress=False)
        if df.empty:
            print(f"[WARN] No data for {ticker}")
            return
        path = os.path.join(date_folder, f"{ticker}.csv")
        df.to_csv(path)
        print(f"[OK] Saved {ticker} to {path}")
    except Exception as e:
        print(f"[ERROR] Failed to fetch {ticker}: {e}")

def main():
    tickers = list(set(get_nasdaq_tickers() + CAC40_TICKERS))
    today = datetime.now().strftime("%Y-%m-%d")
    date_folder = os.path.join(DATA_DIR, today)
    os.makedirs(date_folder, exist_ok=True)

    print(f"[INFO] Scraping {len(tickers)} tickers...")

    for ticker in tickers:
        scrape_and_save(ticker, date_folder)
        time.sleep(1.5)  # pour éviter les throttles de Yahoo

    print(f"[DONE] All tickers scraped into {date_folder}")

if __name__ == "__main__":
    main()
