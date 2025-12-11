import sqlite3


def fix_user_xp():
    db_path = "auth.db"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Check if xp column exists in users
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    column_names = [col[1] for col in columns]

    if "xp" not in column_names:
        print("Adding missing 'xp' column to users table...")
        try:
            # Add the column. Default to 0 as per model definition.
            cursor.execute("ALTER TABLE users ADD COLUMN xp INTEGER NOT NULL DEFAULT 0")
            conn.commit()
            print("Successfully added 'xp' column.")
        except Exception as e:
            print(f"Error adding column: {e}")
    else:
        print("'xp' column already exists in users table.")

    conn.close()


if __name__ == "__main__":
    fix_user_xp()
