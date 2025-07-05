package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"web-tools-platform/backend/internal/database"
	"web-tools-platform/backend/internal/models"
	"web-tools-platform/backend/internal/services"
)

// Handler holds the dependencies for HTTP handlers
type Handler struct {
	db      *database.DB
	service *services.Service
}

// NewHandler creates a new handler instance
func NewHandler(db *database.DB) *Handler {
	return &Handler{
		db:      db,
		service: services.NewService(db),
	}
}

// HealthCheck handles health check requests
func (h *Handler) HealthCheck(c *gin.Context) {
	response := models.HealthResponse{
		Status:    "healthy",
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Version:   "1.0.0",
	}
	c.JSON(http.StatusOK, response)
}

// GetTools handles GET /api/tools requests
func (h *Handler) GetTools(c *gin.Context) {
	tools, err := h.service.GetAllTools()
	if err != nil {
		logrus.WithError(err).Error("Failed to get tools")
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: "Failed to retrieve tools",
			Code:  "INTERNAL_ERROR",
		})
		return
	}

	c.JSON(http.StatusOK, tools)
}

// GetTool handles GET /api/tools/:toolId requests
func (h *Handler) GetTool(c *gin.Context) {
	toolID := c.Param("toolId")
	if toolID == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Tool ID is required",
			Code:  "INVALID_REQUEST",
		})
		return
	}

	tool, err := h.service.GetToolByID(toolID)
	if err != nil {
		logrus.WithError(err).WithField("tool_id", toolID).Error("Failed to get tool")
		c.JSON(http.StatusNotFound, models.ErrorResponse{
			Error: "Tool not found",
			Code:  "NOT_FOUND",
		})
		return
	}

	c.JSON(http.StatusOK, tool)
}

// ProcessTool handles POST /api/tools/:toolId/process requests
func (h *Handler) ProcessTool(c *gin.Context) {
	toolID := c.Param("toolId")
	if toolID == "" {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Tool ID is required",
			Code:  "INVALID_REQUEST",
		})
		return
	}

	var request models.ToolRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Invalid request body",
			Code:  "INVALID_REQUEST",
		})
		return
	}

	response, err := h.service.ProcessTool(toolID, request)
	if err != nil {
		logrus.WithError(err).WithField("tool_id", toolID).Error("Failed to process tool")
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error: "Failed to process tool",
			Code:  "PROCESSING_ERROR",
		})
		return
	}

	c.JSON(http.StatusOK, response)
}

// GetSettings handles GET /api/settings requests
func (h *Handler) GetSettings(c *gin.Context) {
	// For now, return default settings
	// TODO: Implement user-specific settings
	defaultSettings := map[string]interface{}{
		"theme":       "light",
		"language":    "en",
		"fontSize":    "medium",
		"autoSave":    true,
		"toolHistory": true,
	}

	c.JSON(http.StatusOK, defaultSettings)
}

// UpdateSettings handles POST /api/settings requests
func (h *Handler) UpdateSettings(c *gin.Context) {
	var settings map[string]interface{}
	if err := c.ShouldBindJSON(&settings); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "Invalid request body",
			Code:  "INVALID_REQUEST",
		})
		return
	}

	// TODO: Implement settings persistence
	logrus.WithField("settings", settings).Info("Settings updated")

	c.JSON(http.StatusOK, gin.H{
		"message": "Settings updated successfully",
	})
}
