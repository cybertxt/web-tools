package database

import (
	"database/sql"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
	"github.com/sirupsen/logrus"
)

// DB represents the database connection
type DB struct {
	*sql.DB
}

// Initialize creates and initializes the database
func Initialize() (*DB, error) {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./data/web-tools.db"
	}

	// Create data directory if it doesn't exist
	if err := os.MkdirAll(filepath.Dir(dbPath), 0755); err != nil {
		return nil, err
	}

	// Open database connection
	sqlDB, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}

	// Test connection
	if err := sqlDB.Ping(); err != nil {
		return nil, err
	}

	db := &DB{sqlDB}

	// Initialize tables
	if err := db.initializeTables(); err != nil {
		return nil, err
	}

	logrus.Info("Database initialized successfully")
	return db, nil
}

// initializeTables creates the necessary tables
func (db *DB) initializeTables() error {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS tools (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			description TEXT,
			category TEXT NOT NULL,
			icon TEXT,
			features TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS user_settings (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id TEXT UNIQUE,
			settings TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS tool_history (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			tool_id TEXT NOT NULL,
			input TEXT,
			output TEXT,
			settings TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,
	}

	for _, query := range queries {
		if _, err := db.Exec(query); err != nil {
			return err
		}
	}

	// Insert default tools if not exists
	if err := db.insertDefaultTools(); err != nil {
		return err
	}

	return nil
}

// insertDefaultTools inserts the default tools into the database
func (db *DB) insertDefaultTools() error {
	tools := []struct {
		id          string
		name        string
		description string
		category    string
		icon        string
		features    string
	}{
		{
			id:          "base64",
			name:        "Base64 Encoder/Decoder",
			description: "Encode and decode Base64 strings",
			category:    "encoding",
			icon:        "code",
			features:    `["input-validation", "output-formatting"]`,
		},
		{
			id:          "json",
			name:        "JSON Formatter/Validator",
			description: "Format and validate JSON data",
			category:    "formatting",
			icon:        "braces",
			features:    `["input-validation", "output-formatting", "settings"]`,
		},
		{
			id:          "protobuf",
			name:        "Protobuf Debug String Formatter",
			description: "Format protobuf debug strings",
			category:    "protocol",
			icon:        "settings",
			features:    `["input-validation", "output-formatting"]`,
		},
		{
			id:          "unicode",
			name:        "Unicode Encoder/Decoder",
			description: "Encode and decode Unicode characters",
			category:    "encoding",
			icon:        "globe",
			features:    `["input-validation", "output-formatting"]`,
		},
		{
			id:          "url",
			name:        "URL Encoder/Decoder",
			description: "Encode and decode URL parameters",
			category:    "encoding",
			icon:        "link",
			features:    `["input-validation", "output-formatting"]`,
		},
		{
			id:          "html",
			name:        "HTML Encoder/Decoder",
			description: "Encode and decode HTML entities",
			category:    "encoding",
			icon:        "code2",
			features:    `["input-validation", "output-formatting"]`,
		},
	}

	for _, tool := range tools {
		// Check if tool already exists
		var exists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM tools WHERE id = ?)", tool.id).Scan(&exists)
		if err != nil {
			return err
		}

		if !exists {
			_, err := db.Exec(`
				INSERT INTO tools (id, name, description, category, icon, features)
				VALUES (?, ?, ?, ?, ?, ?)
			`, tool.id, tool.name, tool.description, tool.category, tool.icon, tool.features)
			if err != nil {
				return err
			}
		}
	}

	return nil
}
