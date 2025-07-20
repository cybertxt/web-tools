package services

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"html"
	"net/url"
	"strconv"
	"strings"

	"web-tools-platform/backend/internal/database"
	"web-tools-platform/backend/internal/models"
)

// Service handles business logic
type Service struct {
	db *database.DB
}

// NewService creates a new service instance
func NewService(db *database.DB) *Service {
	return &Service{
		db: db,
	}
}

// GetTools returns all available tools
func (s *Service) GetTools() ([]models.Tool, error) {
	tools := []models.Tool{
		{
			ID:          "base64",
			Name:        "Base64 Encoder/Decoder",
			Description: "Encode and decode Base64 strings",
			Category:    "encoding",
			Icon:        "base64",
			Features:    []string{"encode", "decode", "url-safe", "multiline"},
		},
		{
			ID:          "json",
			Name:        "JSON Formatter/Validator",
			Description: "Format and validate JSON data",
			Category:    "formatting",
			Icon:        "json",
			Features:    []string{"format", "validate", "minify", "prettify"},
		},
		{
			ID:          "url",
			Name:        "URL Encoder/Decoder",
			Description: "Encode and decode URL parameters",
			Category:    "encoding",
			Icon:        "url",
			Features:    []string{"encode", "decode", "component", "full-url"},
		},
		{
			ID:          "html",
			Name:        "HTML Encoder/Decoder",
			Description: "Encode and decode HTML entities",
			Category:    "encoding",
			Icon:        "html",
			Features:    []string{"encode", "decode", "entities", "escape"},
		},
		{
			ID:          "unicode",
			Name:        "Unicode Encoder/Decoder",
			Description: "Encode and decode Unicode characters",
			Category:    "encoding",
			Icon:        "unicode",
			Features:    []string{"encode", "decode", "normalize", "categories"},
		},
	}

	return tools, nil
}

// GetTool returns a specific tool by ID
func (s *Service) GetTool(id string) (*models.Tool, error) {
	tools, err := s.GetTools()
	if err != nil {
		return nil, err
	}

	for _, tool := range tools {
		if tool.ID == id {
			return &tool, nil
		}
	}

	return nil, fmt.Errorf("tool not found: %s", id)
}

// ProcessTool processes input using the specified tool
func (s *Service) ProcessTool(toolID string, request models.ToolRequest) (*models.ToolResponse, error) {
	switch toolID {
	case "base64":
		return s.processBase64(request)
	case "json":
		return s.processJSON(request)
	case "url":
		return s.processURL(request)
	case "html":
		return s.processHTML(request)
	case "unicode":
		return s.processUnicode(request)
	default:
		return nil, fmt.Errorf("unsupported tool: %s", toolID)
	}
}

// processBase64 handles base64 encoding/decoding
func (s *Service) processBase64(request models.ToolRequest) (*models.ToolResponse, error) {
	mode := "encode"
	if request.Settings != nil {
		if m, ok := request.Settings["mode"].(string); ok {
			mode = m
		}
	}

	var output string

	switch mode {
	case "encode":
		output = base64.StdEncoding.EncodeToString([]byte(request.Input))
	case "decode":
		decoded, decodeErr := base64.StdEncoding.DecodeString(request.Input)
		if decodeErr != nil {
			return &models.ToolResponse{
				Error: fmt.Sprintf("Invalid base64 string: %v", decodeErr),
			}, nil
		}
		output = string(decoded)
	case "url-encode":
		output = base64.URLEncoding.EncodeToString([]byte(request.Input))
	case "url-decode":
		decoded, decodeErr := base64.URLEncoding.DecodeString(request.Input)
		if decodeErr != nil {
			return &models.ToolResponse{
				Error: fmt.Sprintf("Invalid base64 URL string: %v", decodeErr),
			}, nil
		}
		output = string(decoded)
	default:
		return &models.ToolResponse{
			Error: fmt.Sprintf("Unsupported mode: %s", mode),
		}, nil
	}

	return &models.ToolResponse{
		Output: output,
	}, nil
}

// processJSON handles JSON formatting and validation
func (s *Service) processJSON(request models.ToolRequest) (*models.ToolResponse, error) {
	mode := "format"
	if request.Settings != nil {
		if m, ok := request.Settings["mode"].(string); ok {
			mode = m
		}
	}

	var output string
	var jsonData interface{}

	// First, validate the JSON
	if err := json.Unmarshal([]byte(request.Input), &jsonData); err != nil {
		return &models.ToolResponse{
			Error: fmt.Sprintf("Invalid JSON: %v", err),
		}, nil
	}

	switch mode {
	case "format", "prettify":
		formatted, err := json.MarshalIndent(jsonData, "", "  ")
		if err != nil {
			return &models.ToolResponse{
				Error: fmt.Sprintf("Error formatting JSON: %v", err),
			}, nil
		}
		output = string(formatted)
	case "minify":
		minified, err := json.Marshal(jsonData)
		if err != nil {
			return &models.ToolResponse{
				Error: fmt.Sprintf("Error minifying JSON: %v", err),
			}, nil
		}
		output = string(minified)
	case "validate":
		output = "Valid JSON"
	default:
		return &models.ToolResponse{
			Error: fmt.Sprintf("Unsupported mode: %s", mode),
		}, nil
	}

	return &models.ToolResponse{
		Output: output,
	}, nil
}

// processURL handles URL encoding/decoding
func (s *Service) processURL(request models.ToolRequest) (*models.ToolResponse, error) {
	mode := "encode"
	if request.Settings != nil {
		if m, ok := request.Settings["mode"].(string); ok {
			mode = m
		}
	}

	var output string

	switch mode {
	case "encode":
		output = url.QueryEscape(request.Input)
	case "decode":
		decoded, err := url.QueryUnescape(request.Input)
		if err != nil {
			return &models.ToolResponse{
				Error: fmt.Sprintf("Invalid URL encoding: %v", err),
			}, nil
		}
		output = decoded
	case "encode-component":
		output = url.PathEscape(request.Input)
	case "decode-component":
		decoded, err := url.PathUnescape(request.Input)
		if err != nil {
			return &models.ToolResponse{
				Error: fmt.Sprintf("Invalid URL path encoding: %v", err),
			}, nil
		}
		output = decoded
	default:
		return &models.ToolResponse{
			Error: fmt.Sprintf("Unsupported mode: %s", mode),
		}, nil
	}

	return &models.ToolResponse{
		Output: output,
	}, nil
}

// processHTML handles HTML entity encoding/decoding
func (s *Service) processHTML(request models.ToolRequest) (*models.ToolResponse, error) {
	mode := "encode"
	if request.Settings != nil {
		if m, ok := request.Settings["mode"].(string); ok {
			mode = m
		}
	}

	var output string

	switch mode {
	case "encode":
		output = html.EscapeString(request.Input)
	case "decode":
		output = html.UnescapeString(request.Input)
	default:
		return &models.ToolResponse{
			Error: fmt.Sprintf("Unsupported mode: %s", mode),
		}, nil
	}

	return &models.ToolResponse{
		Output: output,
	}, nil
}

// processUnicode handles Unicode character encoding/decoding
func (s *Service) processUnicode(request models.ToolRequest) (*models.ToolResponse, error) {
	mode := "encode"
	if request.Settings != nil {
		if m, ok := request.Settings["mode"].(string); ok {
			mode = m
		}
	}

	var output string

	switch mode {
	case "encode":
		var parts []string
		for _, r := range request.Input {
			if r > 127 {
				parts = append(parts, fmt.Sprintf("\\u%04x", r))
			} else {
				parts = append(parts, string(r))
			}
		}
		output = strings.Join(parts, "")
	case "decode":
		// Simple unicode escape sequence decoder
		output = request.Input
		for i := 0; i < len(output)-5; i++ {
			if output[i:i+2] == "\\u" {
				if codePoint, err := strconv.ParseInt(output[i+2:i+6], 16, 32); err == nil {
					output = output[:i] + string(rune(codePoint)) + output[i+6:]
				}
			}
		}
	case "info":
		var info []string
		for _, r := range request.Input {
			info = append(info, fmt.Sprintf("'%c' (U+%04X)", r, r))
		}
		output = strings.Join(info, "\n")
	default:
		return &models.ToolResponse{
			Error: fmt.Sprintf("Unsupported mode: %s", mode),
		}, nil
	}

	return &models.ToolResponse{
		Output: output,
	}, nil
} 