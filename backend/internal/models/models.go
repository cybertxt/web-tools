package models

import "time"

// Tool represents a tool in the platform
type Tool struct {
	ID          string    `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Description string    `json:"description" db:"description"`
	Category    string    `json:"category" db:"category"`
	Icon        string    `json:"icon" db:"icon"`
	Features    []string  `json:"features" db:"features"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

// ToolRequest represents a request to process a tool
type ToolRequest struct {
	Input    string                 `json:"input" validate:"required"`
	Settings map[string]interface{} `json:"settings,omitempty"`
}

// ToolResponse represents a response from processing a tool
type ToolResponse struct {
	Output   string                 `json:"output"`
	Error    string                 `json:"error,omitempty"`
	Metadata map[string]interface{} `json:"metadata,omitempty"`
}

// UserSettings represents user preferences
type UserSettings struct {
	ID        int                    `json:"id" db:"id"`
	UserID    string                 `json:"user_id" db:"user_id"`
	Settings  map[string]interface{} `json:"settings" db:"settings"`
	CreatedAt time.Time              `json:"created_at" db:"created_at"`
	UpdatedAt time.Time              `json:"updated_at" db:"updated_at"`
}

// ToolHistoryEntry represents a tool usage history entry
type ToolHistoryEntry struct {
	ID        int                    `json:"id" db:"id"`
	ToolID    string                 `json:"tool_id" db:"tool_id"`
	Input     string                 `json:"input" db:"input"`
	Output    string                 `json:"output" db:"output"`
	Settings  map[string]interface{} `json:"settings" db:"settings"`
	CreatedAt time.Time              `json:"created_at" db:"created_at"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error   string `json:"error"`
	Code    string `json:"code,omitempty"`
	Details string `json:"details,omitempty"`
}

// HealthResponse represents a health check response
type HealthResponse struct {
	Status    string `json:"status"`
	Timestamp string `json:"timestamp"`
	Version   string `json:"version"`
}
