package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"

	"web-tools-platform/backend/internal/database"
	"web-tools-platform/backend/internal/handlers"
	"web-tools-platform/backend/internal/middleware"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		logrus.Warn("No .env file found, using system environment variables")
	}

	// Initialize logger
	setupLogger()

	// Initialize database
	db, err := database.Initialize()
	if err != nil {
		logrus.Fatal("Failed to initialize database:", err)
	}
	defer db.Close()

	// Initialize Gin router
	router := setupRouter()

	// Initialize handlers
	handler := handlers.NewHandler(db)

	// Setup routes
	setupRoutes(router, handler)

	// Get port from environment
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	logrus.Info("Starting server on port ", port)
	if err := router.Run(":" + port); err != nil {
		logrus.Fatal("Failed to start server:", err)
	}
}

func setupLogger() {
	// Set log level
	logLevel := os.Getenv("LOG_LEVEL")
	switch logLevel {
	case "debug":
		logrus.SetLevel(logrus.DebugLevel)
	case "info":
		logrus.SetLevel(logrus.InfoLevel)
	case "warn":
		logrus.SetLevel(logrus.WarnLevel)
	case "error":
		logrus.SetLevel(logrus.ErrorLevel)
	default:
		logrus.SetLevel(logrus.InfoLevel)
	}

	// Set log format
	logrus.SetFormatter(&logrus.JSONFormatter{})
}

func setupRouter() *gin.Engine {
	// Set Gin mode
	env := os.Getenv("ENV")
	if env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()

	// Add middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.RequestID())
	router.Use(middleware.Logger())

	// CORS configuration
	corsConfig := cors.DefaultConfig()
	corsOrigin := os.Getenv("CORS_ORIGIN")
	if corsOrigin != "" {
		corsConfig.AllowOrigins = []string{corsOrigin}
	} else {
		corsConfig.AllowOrigins = []string{"http://localhost:5173", "http://localhost:5174"}
	}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Request-ID"}
	corsConfig.ExposeHeaders = []string{"X-Request-ID"}
	corsConfig.AllowCredentials = true

	router.Use(cors.New(corsConfig))

	return router
}

func setupRoutes(router *gin.Engine, handler *handlers.Handler) {
	// Health check
	router.GET("/health", handler.HealthCheck)

	// API routes
	api := router.Group("/api")
	{
		// Tools routes
		tools := api.Group("/tools")
		{
			tools.GET("", handler.GetTools)
			tools.GET("/:toolId", handler.GetTool)
			tools.POST("/:toolId/process", handler.ProcessTool)
		}

		// Settings routes
		settings := api.Group("/settings")
		{
			settings.GET("", handler.GetSettings)
			settings.POST("", handler.UpdateSettings)
		}
	}

	// Serve static files (for production)
	router.Static("/assets", "./dist/assets")
	router.StaticFile("/", "./dist/index.html")
}
