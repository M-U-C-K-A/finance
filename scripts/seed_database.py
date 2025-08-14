#!/usr/bin/env python3
"""
Script pour peupler la base de données FinAnalytics avec des données de test.
Usage: python scripts/seed_database.py
"""

import os
import random
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor
import uuid
from typing import List, Dict, Any

# Configuration de la base de données
DATABASE_URL = "postgresql://admin:@localhost:5433/finance"

# Données de test
USERS_DATA = [
    {
        "id": "user_001",
        "name": "Alice Dupont", 
        "email": "alice@example.com",
        "role": "USER"
    },
    {
        "id": "user_002", 
        "name": "Bob Martin",
        "email": "bob@example.com", 
        "role": "USER"
    },
    {
        "id": "user_003",
        "name": "Claire Bernard", 
        "email": "claire@example.com",
        "role": "USER"
    },
    {
        "id": "user_004",
        "name": "David Leroy",
        "email": "david@example.com", 
        "role": "USER"
    }
]

SUBSCRIPTION_PLANS = ["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE"]
ASSET_TYPES = ["STOCK", "ETF", "INDEX", "MARKET"]
REPORT_TYPES = ["BASELINE", "DEEP_ANALYSIS", "PRICER", "BENCHMARK"]
REPORT_STATUSES = ["PENDING", "PROCESSING", "COMPLETED", "FAILED"]

SYMBOLS = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "NFLX",
    "SPY", "QQQ", "VTI", "IVV", 
    "CAC40", "DAX", "FTSE", "NIKKEI",
    "EUR/USD", "GBP/USD", "BTC/USD"
]

def connect_db():
    """Connexion à la base de données PostgreSQL"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Erreur de connexion à la base de données: {e}")
        return None

def generate_user_id():
    """Génère un ID utilisateur unique"""
    return f"user_{uuid.uuid4().hex[:8]}"

def generate_report_id():
    """Génère un ID de rapport unique"""
    return f"rpt_{uuid.uuid4().hex[:8]}"

def seed_users(conn, count: int = 10):
    """Peuple la table users avec des utilisateurs de test"""
    cursor = conn.cursor()
    
    users = []
    for i in range(count):
        if i < len(USERS_DATA):
            user_data = USERS_DATA[i].copy()
        else:
            user_data = {
                "id": generate_user_id(),
                "name": f"User {i+1}",
                "email": f"user{i+1}@test.com",
                "role": "USER"
            }
        
        user_data.update({
            "emailVerified": random.choice([True, False]),
            "image": f"https://i.pravatar.cc/150?u={user_data['email']}",
            "createdAt": datetime.now() - timedelta(days=random.randint(1, 365)),
            "updatedAt": datetime.now()
        })
        users.append(user_data)
    
    # Insérer les utilisateurs
    for user in users:
        try:
            cursor.execute("""
                INSERT INTO "user" (id, name, email, "emailVerified", image, role, "createdAt", "updatedAt")
                VALUES (%(id)s, %(name)s, %(email)s, %(emailVerified)s, %(image)s, %(role)s, %(createdAt)s, %(updatedAt)s)
                ON CONFLICT (id) DO NOTHING
            """, user)
        except Exception as e:
            print(f"Erreur lors de l'insertion de l'utilisateur {user['id']}: {e}")
    
    conn.commit()
    print(f"✅ {len(users)} utilisateurs créés")
    return [user["id"] for user in users]

def seed_subscriptions(conn, user_ids: List[str]):
    """Peuple la table subscriptions"""
    cursor = conn.cursor()
    
    for user_id in user_ids:
        # 70% des utilisateurs ont un abonnement
        if random.random() < 0.7:
            plan = random.choice(["STARTER", "PROFESSIONAL", "ENTERPRISE"])
            api_access = plan in ["PROFESSIONAL", "ENTERPRISE"]
            
            subscription = {
                "id": f"sub_{uuid.uuid4().hex[:8]}",
                "userId": user_id,
                "plan": plan,
                "billingCycle": "MONTHLY",
                "apiAccess": api_access,
                "isActive": random.choice([True, True, True, False]),  # 75% actifs
                "startedAt": datetime.now() - timedelta(days=random.randint(1, 90)),
                "renewsAt": datetime.now() + timedelta(days=30),
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            }
            
            try:
                cursor.execute("""
                    INSERT INTO subscriptions 
                    (id, "userId", plan, "billingCycle", "apiAccess", "isActive", 
                     "startedAt", "renewsAt", "createdAt", "updatedAt")
                    VALUES (%(id)s, %(userId)s, %(plan)s, %(billingCycle)s, %(apiAccess)s, 
                            %(isActive)s, %(startedAt)s, %(renewsAt)s, %(createdAt)s, %(updatedAt)s)
                    ON CONFLICT ("userId") DO NOTHING
                """, subscription)
            except Exception as e:
                print(f"Erreur lors de l'insertion de l'abonnement pour {user_id}: {e}")
    
    conn.commit()
    print("✅ Abonnements créés")

def seed_credits(conn, user_ids: List[str]):
    """Peuple la table credits"""
    cursor = conn.cursor()
    
    for user_id in user_ids:
        credits = {
            "id": f"crd_{uuid.uuid4().hex[:8]}",
            "userId": user_id,
            "balance": random.randint(0, 500),
            "monthlyCredits": random.choice([0, 100, 500, 2000]),
            "lastRecharge": datetime.now() - timedelta(days=random.randint(1, 30)) if random.random() < 0.8 else None,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
        
        try:
            cursor.execute("""
                INSERT INTO credits 
                (id, "userId", balance, "monthlyCredits", "lastRecharge", "createdAt", "updatedAt")
                VALUES (%(id)s, %(userId)s, %(balance)s, %(monthlyCredits)s, %(lastRecharge)s, %(createdAt)s, %(updatedAt)s)
                ON CONFLICT ("userId") DO NOTHING
            """, credits)
        except Exception as e:
            print(f"Erreur lors de l'insertion des crédits pour {user_id}: {e}")
    
    conn.commit()
    print("✅ Crédits créés")

def seed_credit_transactions(conn, user_ids: List[str], count: int = 50):
    """Peuple la table credit_transactions"""
    cursor = conn.cursor()
    
    transaction_types = ["SUBSCRIPTION_RECHARGE", "PACK_PURCHASE", "REPORT_USAGE", "BONUS"]
    
    for _ in range(count):
        user_id = random.choice(user_ids)
        transaction_type = random.choice(transaction_types)
        
        if transaction_type in ["SUBSCRIPTION_RECHARGE", "PACK_PURCHASE", "BONUS"]:
            amount = random.choice([100, 500, 2000])
        else:  # REPORT_USAGE
            amount = -random.choice([20, 32, 37])  # Coût des rapports
        
        transaction = {
            "id": f"txn_{uuid.uuid4().hex[:8]}",
            "userId": user_id,
            "type": transaction_type,
            "amount": amount,
            "description": f"{transaction_type.replace('_', ' ').title()} - {abs(amount)} crédits",
            "balanceAfter": random.randint(0, 500),
            "createdAt": datetime.now() - timedelta(days=random.randint(1, 90))
        }
        
        try:
            cursor.execute("""
                INSERT INTO credit_transactions 
                (id, "userId", type, amount, description, "balanceAfter", "createdAt")
                VALUES (%(id)s, %(userId)s, %(type)s, %(amount)s, %(description)s, %(balanceAfter)s, %(createdAt)s)
            """, transaction)
        except Exception as e:
            print(f"Erreur lors de l'insertion de la transaction: {e}")
    
    conn.commit()
    print(f"✅ {count} transactions de crédits créées")

def seed_reports(conn, user_ids: List[str], count: int = 30):
    """Peuple la table reports"""
    cursor = conn.cursor()
    
    for _ in range(count):
        user_id = random.choice(user_ids)
        symbol = random.choice(SYMBOLS)
        asset_type = random.choice(ASSET_TYPES)
        status = random.choice(REPORT_STATUSES)
        
        report = {
            "id": generate_report_id(),
            "userId": user_id,
            "title": f"Analyse {symbol} - {datetime.now().strftime('%B %Y')}",
            "assetType": asset_type,
            "assetSymbol": symbol,
            "reportType": random.choice(REPORT_TYPES),
            "includeBenchmark": random.choice([True, False]),
            "includeApiExport": random.choice([True, False]),
            "creditsCost": random.choice([20, 32, 37]),
            "status": status,
            "createdAt": datetime.now() - timedelta(days=random.randint(1, 30)),
            "updatedAt": datetime.now()
        }
        
        # Ajouter des dates selon le statut
        if status in ["COMPLETED", "FAILED"]:
            report["processingStartedAt"] = report["createdAt"] + timedelta(minutes=random.randint(1, 5))
            report["completedAt"] = report["processingStartedAt"] + timedelta(minutes=random.randint(3, 15))
            
            if status == "COMPLETED":
                report["pdfPath"] = f"/reports/{report['id']}-{symbol.lower()}.pdf"
                if report["includeApiExport"]:
                    report["csvPath"] = f"/reports/{report['id']}-{symbol.lower()}.csv"
            else:
                report["failureReason"] = "Erreur lors de l'analyse des données"
        
        elif status == "PROCESSING":
            report["processingStartedAt"] = report["createdAt"] + timedelta(minutes=random.randint(1, 5))
        
        try:
            cursor.execute("""
                INSERT INTO reports 
                (id, "userId", title, "assetType", "assetSymbol", "reportType", 
                 "includeBenchmark", "includeApiExport", "creditsCost", status, 
                 "processingStartedAt", "completedAt", "failureReason", "pdfPath", "csvPath",
                 "createdAt", "updatedAt")
                VALUES (%(id)s, %(userId)s, %(title)s, %(assetType)s, %(assetSymbol)s, %(reportType)s,
                        %(includeBenchmark)s, %(includeApiExport)s, %(creditsCost)s, %(status)s,
                        %(processingStartedAt)s, %(completedAt)s, %(failureReason)s, %(pdfPath)s, %(csvPath)s,
                        %(createdAt)s, %(updatedAt)s)
            """, report)
        except Exception as e:
            print(f"Erreur lors de l'insertion du rapport: {e}")
    
    conn.commit()
    print(f"✅ {count} rapports créés")

def main():
    """Fonction principale"""
    print("🚀 Début du peuplement de la base de données FinAnalytics")
    
    conn = connect_db()
    if not conn:
        print("❌ Impossible de se connecter à la base de données")
        return
    
    try:
        # Seeder les utilisateurs
        user_ids = seed_users(conn, count=15)
        
        # Seeder les abonnements
        seed_subscriptions(conn, user_ids)
        
        # Seeder les crédits
        seed_credits(conn, user_ids)
        
        # Seeder les transactions de crédits
        seed_credit_transactions(conn, user_ids, count=100)
        
        # Seeder les rapports
        seed_reports(conn, user_ids, count=50)
        
        print("\n✅ Peuplement de la base de données terminé avec succès!")
        print(f"📊 Données créées:")
        print(f"   - {len(user_ids)} utilisateurs")
        print(f"   - ~10 abonnements")
        print(f"   - {len(user_ids)} comptes crédits")
        print(f"   - 100 transactions")
        print(f"   - 50 rapports")
        
    except Exception as e:
        print(f"❌ Erreur lors du peuplement: {e}")
        conn.rollback()
    
    finally:
        conn.close()

if __name__ == "__main__":
    main()