#!/usr/bin/env python3
"""
Script to populate FinAnalytics database with realistic test data.
Usage: python scripts/seed_database.py
"""

import os
import random
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor
import uuid
from typing import List, Dict, Any
import string

# Database configuration
DATABASE_URL = "postgresql://admin:@localhost:5433/finance"

def generate_better_auth_id():
    """Generate ID similar to Better Auth format (24-character string)"""
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(24))

def generate_cuid():
    """Generate CUID-like ID for other entities"""
    chars = string.ascii_lowercase + string.digits
    return 'c' + ''.join(random.choice(chars) for _ in range(24))

# Realistic test users data
USERS_DATA = [
    {"name": "John Smith", "email": "john.smith@example.com", "role": "USER"},
    {"name": "Sarah Johnson", "email": "sarah.j@example.com", "role": "USER"},
    {"name": "Michael Brown", "email": "m.brown@example.com", "role": "USER"},
    {"name": "Emily Davis", "email": "emily.davis@example.com", "role": "USER"},
    {"name": "David Wilson", "email": "d.wilson@example.com", "role": "USER"},
    {"name": "Lisa Garcia", "email": "lisa.garcia@example.com", "role": "USER"},
    {"name": "Robert Miller", "email": "r.miller@example.com", "role": "USER"},
    {"name": "Jennifer Taylor", "email": "jen.taylor@example.com", "role": "USER"},
    {"name": "Christopher Lee", "email": "chris.lee@example.com", "role": "USER"},
    {"name": "Amanda White", "email": "amanda.w@example.com", "role": "USER"},
]

SUBSCRIPTION_PLANS = ["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE"]
ASSET_TYPES = ["STOCK", "ETF", "INDEX", "MARKET"]
REPORT_TYPES = ["BASELINE", "DEEP_ANALYSIS", "PRICER", "BENCHMARK"]
REPORT_STATUSES = ["PENDING", "PROCESSING", "COMPLETED", "FAILED"]

SYMBOLS = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "NFLX",
    "SPY", "QQQ", "VTI", "IVV", "VOO", "VEA", "VWO",
    "CAC40", "DAX", "FTSE", "NIKKEI", "S&P500",
    "BTC", "ETH", "EUR/USD", "GBP/USD"
]

def connect_db():
    """Connect to PostgreSQL database"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def seed_users(conn, count: int = 15):
    """Populate users table with test users"""
    cursor = conn.cursor()
    
    users = []
    for i in range(count):
        if i < len(USERS_DATA):
            user_data = USERS_DATA[i].copy()
        else:
            user_data = {
                "name": f"Test User {i+1}",
                "email": f"testuser{i+1}@finanalytics.com",
                "role": "USER"
            }
        
        user_id = generate_better_auth_id()
        user_data.update({
            "id": user_id,
            "emailVerified": random.choice([True, False]),
            "image": f"https://api.dicebear.com/9.x/bottts-neutral/svg?seed={user_data['email']}",
            "createdAt": datetime.now() - timedelta(days=random.randint(1, 365)),
            "updatedAt": datetime.now()
        })
        users.append(user_data)
    
    # Insert users
    for user in users:
        try:
            cursor.execute("""
                INSERT INTO "user" (id, name, email, "emailVerified", image, role, "createdAt", "updatedAt")
                VALUES (%(id)s, %(name)s, %(email)s, %(emailVerified)s, %(image)s, %(role)s, %(createdAt)s, %(updatedAt)s)
                ON CONFLICT (email) DO NOTHING
            """, user)
        except Exception as e:
            print(f"Error inserting user {user['email']}: {e}")
    
    conn.commit()
    print(f"✅ {len(users)} users created")
    return [user["id"] for user in users]

def seed_subscriptions(conn, user_ids: List[str]):
    """Populate subscriptions table"""
    cursor = conn.cursor()
    
    for user_id in user_ids:
        # 60% of users have a subscription
        if random.random() < 0.6:
            plan = random.choice(["STARTER", "PROFESSIONAL", "ENTERPRISE"])
            api_access = plan in ["PROFESSIONAL", "ENTERPRISE"]
            
            subscription = {
                "id": generate_cuid(),
                "userId": user_id,
                "plan": plan,
                "billingCycle": "MONTHLY",
                "apiAccess": api_access,
                "isActive": random.choice([True, True, True, False]),  # 75% active
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
                print(f"Error inserting subscription for {user_id}: {e}")
    
    conn.commit()
    print("✅ Subscriptions created")

def seed_credits(conn, user_ids: List[str]):
    """Populate credits table - ENSURES ALL users have a credits entry"""
    cursor = conn.cursor()
    
    # Get subscription info to determine appropriate credit amounts
    cursor.execute("""
        SELECT "userId", plan, "isActive" FROM subscriptions 
        WHERE "userId" = ANY(%s)
    """, (user_ids,))
    
    subscriptions = {row[0]: {"plan": row[1], "isActive": row[2]} for row in cursor.fetchall()}
    
    for user_id in user_ids:
        # Determine credits based on subscription
        subscription = subscriptions.get(user_id)
        
        if subscription and subscription["isActive"]:
            plan = subscription["plan"]
            if plan == "STARTER":
                balance = random.randint(50, 150)
                monthly_credits = 100
            elif plan == "PROFESSIONAL":
                balance = random.randint(200, 600)
                monthly_credits = 500
            elif plan == "ENTERPRISE":
                balance = random.randint(800, 2500)
                monthly_credits = 2000
            else:
                balance = random.randint(0, 50)
                monthly_credits = 0
        else:
            # Free users or inactive subscriptions
            balance = random.randint(0, 100)
            monthly_credits = 0
        
        credits = {
            "id": generate_cuid(),
            "userId": user_id,
            "balance": balance,
            "monthlyCredits": monthly_credits,
            "lastRecharge": datetime.now() - timedelta(days=random.randint(1, 30)) if monthly_credits > 0 else None,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
        
        try:
            cursor.execute("""
                INSERT INTO credits 
                (id, "userId", balance, "monthlyCredits", "lastRecharge", "createdAt", "updatedAt")
                VALUES (%(id)s, %(userId)s, %(balance)s, %(monthlyCredits)s, %(lastRecharge)s, %(createdAt)s, %(updatedAt)s)
                ON CONFLICT ("userId") DO UPDATE SET
                    balance = EXCLUDED.balance,
                    "monthlyCredits" = EXCLUDED."monthlyCredits",
                    "lastRecharge" = EXCLUDED."lastRecharge",
                    "updatedAt" = EXCLUDED."updatedAt"
            """, credits)
        except Exception as e:
            print(f"Error inserting credits for {user_id}: {e}")
    
    conn.commit()
    print(f"✅ Credits created for ALL {len(user_ids)} users")

def seed_credit_transactions(conn, user_ids: List[str], count: int = 50):
    """Populate credit_transactions table"""
    cursor = conn.cursor()
    
    transaction_types = ["SUBSCRIPTION_RECHARGE", "PACK_PURCHASE", "REPORT_USAGE", "BONUS"]
    
    for _ in range(count):
        user_id = random.choice(user_ids)
        transaction_type = random.choice(transaction_types)
        
        if transaction_type in ["SUBSCRIPTION_RECHARGE", "PACK_PURCHASE", "BONUS"]:
            amount = random.choice([100, 500, 2000])
            description = f"{transaction_type.replace('_', ' ').title()} - {amount} credits"
        else:  # REPORT_USAGE
            amount = -random.choice([20, 32, 37])  # Cost of reports
            description = f"Report generation cost - {abs(amount)} credits"
        
        transaction = {
            "id": generate_cuid(),
            "userId": user_id,
            "type": transaction_type,
            "amount": amount,
            "description": description,
            "balanceAfter": random.randint(0, 1000),
            "createdAt": datetime.now() - timedelta(days=random.randint(1, 90))
        }
        
        try:
            cursor.execute("""
                INSERT INTO credit_transactions 
                (id, "userId", type, amount, description, "balanceAfter", "createdAt")
                VALUES (%(id)s, %(userId)s, %(type)s, %(amount)s, %(description)s, %(balanceAfter)s, %(createdAt)s)
            """, transaction)
        except Exception as e:
            print(f"Error inserting transaction: {e}")
    
    conn.commit()
    print(f"✅ {count} credit transactions created")

def seed_reports(conn, user_ids: List[str], count: int = 30):
    """Populate reports table"""
    cursor = conn.cursor()
    
    for _ in range(count):
        user_id = random.choice(user_ids)
        symbol = random.choice(SYMBOLS)
        asset_type = random.choice(ASSET_TYPES)
        status = random.choice(REPORT_STATUSES)
        
        include_benchmark = random.choice([True, False])
        include_api_export = random.choice([True, False])
        
        # Calculate realistic cost
        cost = 20  # Base cost
        if include_benchmark:
            cost += 12
        if include_api_export:
            cost += 5
        
        report = {
            "id": generate_cuid(),
            "userId": user_id,
            "title": f"{symbol} Financial Analysis - {datetime.now().strftime('%B %Y')}",
            "assetType": asset_type,
            "assetSymbol": symbol,
            "reportType": random.choice(REPORT_TYPES),
            "includeBenchmark": include_benchmark,
            "includeApiExport": include_api_export,
            "creditsCost": cost,
            "status": status,
            "createdAt": datetime.now() - timedelta(days=random.randint(1, 30)),
            "updatedAt": datetime.now()
        }
        
        # Add dates based on status
        if status in ["COMPLETED", "FAILED"]:
            report["processingStartedAt"] = report["createdAt"] + timedelta(minutes=random.randint(1, 5))
            report["completedAt"] = report["processingStartedAt"] + timedelta(minutes=random.randint(3, 15))
            
            if status == "COMPLETED":
                report["pdfPath"] = f"/reports/{report['id']}-{symbol.lower()}-analysis.pdf"
                if report["includeApiExport"]:
                    report["csvPath"] = f"/reports/{report['id']}-{symbol.lower()}-data.csv"
            else:
                report["failureReason"] = "Failed to fetch market data for analysis"
        
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
            print(f"Error inserting report: {e}")
    
    conn.commit()
    print(f"✅ {count} reports created")

def create_admin_user(conn):
    """Create or update admin user with the ID from environment"""
    admin_id = os.getenv("ADMIN_USER_ID")
    if not admin_id:
        print("⚠️  ADMIN_USER_ID not found in environment, skipping admin user creation")
        return
    
    cursor = conn.cursor()
    
    admin_user = {
        "id": admin_id,
        "name": "Admin User",
        "email": "admin@finanalytics.com",
        "emailVerified": True,
        "image": "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=admin",
        "role": "ADMIN",
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    }
    
    try:
        cursor.execute("""
            INSERT INTO "user" (id, name, email, "emailVerified", image, role, "createdAt", "updatedAt")
            VALUES (%(id)s, %(name)s, %(email)s, %(emailVerified)s, %(image)s, %(role)s, %(createdAt)s, %(updatedAt)s)
            ON CONFLICT (id) DO UPDATE SET
                role = EXCLUDED.role,
                "updatedAt" = EXCLUDED."updatedAt"
        """, admin_user)
        
        # Ensure admin has credits
        cursor.execute("""
            INSERT INTO credits (id, "userId", balance, "monthlyCredits", "createdAt", "updatedAt")
            VALUES (%(id)s, %(userId)s, %(balance)s, %(monthlyCredits)s, %(createdAt)s, %(updatedAt)s)
            ON CONFLICT ("userId") DO UPDATE SET
                balance = GREATEST(credits.balance, 1000),
                "updatedAt" = EXCLUDED."updatedAt"
        """, {
            "id": generate_cuid(),
            "userId": admin_id,
            "balance": 1000,
            "monthlyCredits": 0,
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        })
        
        conn.commit()
        print(f"✅ Admin user created/updated with ID: {admin_id}")
        
    except Exception as e:
        print(f"Error creating admin user: {e}")
        conn.rollback()

def main():
    """Main function"""
    print("🚀 Starting FinAnalytics database seeding")
    
    conn = connect_db()
    if not conn:
        print("❌ Unable to connect to database")
        return
    
    try:
        # Create admin user first
        create_admin_user(conn)
        
        # Seed test users
        user_ids = seed_users(conn, count=15)
        
        # Seed subscriptions
        seed_subscriptions(conn, user_ids)
        
        # Seed credits (ENSURES ALL users have credits)
        seed_credits(conn, user_ids)
        
        # Seed credit transactions
        seed_credit_transactions(conn, user_ids, count=80)
        
        # Seed reports
        seed_reports(conn, user_ids, count=40)
        
        print("\n✅ Database seeding completed successfully!")
        print(f"📊 Data created:")
        print(f"   - 1 admin user")
        print(f"   - {len(user_ids)} test users")
        print(f"   - ~9 subscriptions")
        print(f"   - {len(user_ids) + 1} credit accounts (ALL users)")
        print(f"   - 80 credit transactions")
        print(f"   - 40 reports")
        print(f"\n🔑 Admin ID: {os.getenv('ADMIN_USER_ID', 'Not set')}")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        conn.rollback()
        raise
    
    finally:
        conn.close()

if __name__ == "__main__":
    main()