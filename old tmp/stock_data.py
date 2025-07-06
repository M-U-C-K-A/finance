import yfinance as yf
import pandas as pd
from datetime import datetime
import os

def fetch_stock_data():
    # Définir les tickers et la période
    tickers = ['AAPL', 'GOOGL']
    
    try:
        # Récupérer les données
        data = yf.download(tickers, period='1d', interval='5m')
        
        # Préparer le DataFrame
        df = data['Close'].reset_index()
        df = df.melt(id_vars=['Datetime'], var_name='Ticker', value_name='Price')
        df['Timestamp'] = datetime.now()
        
        # Créer le dossier de stockage si nécessaire
        os.makedirs('stock_data', exist_ok=True)
        
        # Sauvegarder les données
        filename = f"stock_data/{datetime.now().strftime('%Y%m%d_%H%M%S')}_stock_data.csv"
        df.to_csv(filename, index=False)
        
        print(f"Données sauvegardées dans {filename}")
        return filename
    except Exception as e:
        print(f"Erreur lors de la récupération des données: {e}")
        return None

if __name__ == "__main__":
    fetch_stock_data()
