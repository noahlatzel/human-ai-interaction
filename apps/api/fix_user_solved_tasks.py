import sqlite3


def fix_user_solved_tasks():
    db_path = "auth.db"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Check if solved_tasks column exists in users
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    column_names = [col[1] for col in columns]

    if "solved_tasks" not in column_names:
        print("Adding missing 'solved_tasks' column to users table...")
        try:
            # Add the column. Default to 0 as per model definition.
            cursor.execute(
                "ALTER TABLE users ADD COLUMN solved_tasks INTEGER NOT NULL DEFAULT 0"
            )
            conn.commit()
            print("Successfully added 'solved_tasks' column.")
        except Exception as e:
            print(f"Error adding column: {e}")
    else:
        print("'solved_tasks' column already exists in users table.")

    conn.close()


if __name__ == "__main__":
    fix_user_solved_tasks()
