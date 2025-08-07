import time
import subprocess
import os
from datetime import datetime

def run_system():
    while True:
        print(f"\nExécution à {datetime.now()}")
        
        # 1. Exécuter le script Python
        print("Récupération des données boursières...")
        data_file = subprocess.run(["python", "stock_data.py"], capture_output=True, text=True)
        print(data_file.stdout)
        
        # 2. Générer le rapport RMarkdown
        print("Génération du rapport...")
        rmd_result = subprocess.run(["Rscript", "-e", "rmarkdown::render('stock_report.Rmd')"], capture_output=True, text=True)
        
        if rmd_result.returncode == 0:
            print("Rapport généré avec succès")
            # Ouvrir le rapport dans le navigateur par défaut
            if os.name == 'nt':  # Windows
                os.startfile("stock_report.html")
            else:  # Mac/Linux
                opener = "open"
                subprocess.call([opener, "stock_report.html"])
        else:
            print("Erreur lors de la génération du rapport:")
            print(rmd_result.stderr)
        
        # Attendre 5 minutes avant la prochaine exécution
        print("Attente de 5 minutes avant la prochaine exécution...")
        time.sleep(300)  # 300 secondes = 5 minutes

if __name__ == "__main__":
    run_system()
