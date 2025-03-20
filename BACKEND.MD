# dia-FastAPI

├── docker-compose.yml    # Docker compose for local development
│   # Services:
│   # - API
│   # - Redis (for rate limiting and session management)
│   # - PostgreSQL
│   # - NGINX (reverse proxy)
│   # - Elasticsearch (for logging)
│   # - Kibana (log visualization)
│   # - Vault (for secrets management)
│   # - Prometheus (metrics)
│   # - Grafana (monitoring)
│   # - RabbitMQ (message queue)
│   # - MinIO (S3-compatible storage)
│   # - Wazuh (security monitoring)

├── deployment           # Deployment configurations
│   ├── kubernetes      # K8s manifests
│   │   ├── api.yaml   # API deployment
│   │   ├── redis.yaml # Redis deployment
│   │   └── etc...     # Other service deployments
│   ├── terraform      # Infrastructure as Code
│   └── ansible        # Configuration management

/nginx
├── nginx                 # NGINX configuration
│   ├── nginx.conf        # Main NGINX configuration
│   │   # Security headers:
│   │   # - HSTS
│   │   # - XSS Protection
│   │   # - Content Security Policy
│   │   # - Rate limiting
│   └── sites-enabled     # Virtual host configurations
│       └── api.conf      # API-specific NGINX configuration
│           # SSL/TLS configuration
│           # Reverse proxy settings
│           # Rate limiting rules

/app
├── main.py               # FastAPI application entry point
├── config.py             # Configuration settings (env vars, etc.)
│   # Security settings:
│   # - JWT_SECRET_KEY
│   # - JWT_ALGORITHM
│   # - ACCESS_TOKEN_EXPIRE_MINUTES
│   # - REFRESH_TOKEN_EXPIRE_DAYS
│   # - ALLOWED_ORIGINS
│   # - RATE_LIMIT_REQUESTS
│   # - RATE_LIMIT_PERIOD
├── requirements.txt      # Python dependencies
├── api                   # API module
│   ├── __init__.py      # Package initialization
│   ├── dependencies.py   # Shared dependencies (auth, etc.)
│   │   # Dependencies:
│   │   # - get_current_user
│   │   # - get_current_active_user
│   │   # - verify_access_token
│   │   # - verify_refresh_token
│   ├── middleware.py     # Custom middleware
│   │   # Middleware:
│   │   # - JWT verification
│   │   # - Rate limiting
│   │   # - Request logging
│   │   # - Error handling
│   │   # - CORS
│   │   # - Security headers
│   ├── errors.py        # Custom error handlers
│   └── routes           # API routes organized by domain
│       ├── __init__.py  # Package initialization
│       ├── v1.py        # API version router
│       ├── auth.py      # Authentication endpoints
│       │   # Routes (no JWT required):
│       │   # - POST /auth/signup - Create new user
│       │   # - POST /auth/login - Get access & refresh tokens
│       │   # - POST /auth/refresh - Refresh access token
│       │   # Routes (JWT required):
│       │   # - POST /auth/logout - Invalidate tokens
│       │   # - POST /auth/change-password - Change password
│       │   # - POST /auth/reset-password - Reset password
│       ├── cases.py     # Case management endpoints (JWT required)
│       │   # Routes:
│       │   # - GET /cases - List all cases with filters
│       │   # - GET /cases/{id} - Get case details
│       │   # - POST /cases - Create new case
│       │   # - PUT /cases/{id} - Update case
│       │   # - DELETE /cases/{id} - Delete case
│       │   # - GET /cases/{id}/files - Get case files
│       │   # - POST /cases/{id}/files - Upload case files
│       ├── databases.py  # Database management endpoints
│       │   # Routes:
│       │   # - GET /databases - List all databases
│       │   # - GET /databases/{id} - Get database details
│       │   # - POST /databases - Create new database
│       │   # - PUT /databases/{id} - Update database
│       │   # - GET /databases/{id}/files - List database files
│       │   # - POST /databases/{id}/files - Upload files to database
│       │   # - GET /databases/{id}/status - Get indexing status
│       ├── chat.py       # Chat and AI interaction endpoints
│       │   # Routes:
│       │   # - POST /chat/message - Send message to AI
│       │   # - GET /chat/history - Get chat history
│       │   # - POST /chat/context - Add context to chat
│       │   # - GET /chat/search - Search chat history
│       └── websockets.py # WebSocket handlers for real-time updates
│           # Handlers:
│           # - /ws/chat - Real-time chat updates
│           # - /ws/database-status - Real-time database indexing status
├── core                 # Core application code
│   ├── __init__.py     # Package initialization
│   ├── security.py     # Security utilities
│   │   # Functions:
│   │   # - create_access_token
│   │   # - create_refresh_token
│   │   # - verify_password
│   │   # - get_password_hash
│   │   # - validate_token
│   │   # - blacklist_token
│   ├── rate_limiter.py # Rate limiting implementation
│   │   # Methods:
│   │   # - check_rate_limit
│   │   # - increment_counter
│   │   # - reset_counter
│   ├── logging.py      # Logging configuration
│   │   # Components:
│   │   # - Request logger
│   │   # - Error logger
│   │   # - Audit logger
│   │   # - Performance logger
│   └── events.py       # Application startup/shutdown events
├── db                    # Database related code
│   ├── __init__.py       # Package initialization
│   ├── session.py        # Database session management
│   └── repositories      # Database access layer
│       ├── __init__.py   # Package initialization
│       ├── base.py       # Base repository pattern
│       ├── case.py       # Case repository
│       │   # Methods:
│       │   # - list_cases(filters)
│       │   # - get_case(id)
│       │   # - create_case(data)
│       │   # - update_case(id, data)
│       │   # - delete_case(id)
│       ├── database.py   # Database repository
│       │   # Methods:
│       │   # - list_databases()
│       │   # - get_database(id)
│       │   # - create_database(data)
│       │   # - update_database(id, data)
│       │   # - get_indexing_status(id)
│       └── chat.py       # Chat repository
│           # Methods:
│           # - save_message(data)
│           # - get_history(filters)
│           # - add_context(data)
│           # - search_messages(term)
├── models                # Database models
│   ├── __init__.py       # Package initialization
│   ├── user.py        # User model
│   │   # Fields:
│   │   # - id: UUID
│   │   # - email: str
│   │   # - hashed_password: str
│   │   # - is_active: bool
│   │   # - is_superuser: bool
│   │   # - last_login: datetime
│   │   # - failed_login_attempts: int
│   │   # - lockout_until: datetime
│   ├── token.py       # Token model
│   │   # Fields:
│   │   # - id: UUID
│   │   # - user_id: UUID
│   │   # - access_token: str
│   │   # - refresh_token: str
│   │   # - access_expires: datetime
│   │   # - refresh_expires: datetime
│   │   # - is_blacklisted: bool
│   ├── case.py           # Case model
│   │   # Fields:
│   │   # - id: UUID
│   │   # - title: str
│   │   # - description: str
│   │   # - status: Enum
│   │   # - priority: Enum
│   │   # - type: str
│   │   # - created_at: datetime
│   │   # - updated_at: datetime
│   ├── database.py       # Database model
│   │   # Fields:
│   │   # - id: UUID
│   │   # - name: str
│   │   # - status: Enum
│   │   # - file_count: int
│   │   # - case_id: UUID (foreign key)
│   │   # - created_at: datetime
│   │   # - updated_at: datetime
│   └── chat.py          # Chat model
│       # Fields:
│       # - id: UUID
│       # - message: str
│       # - role: Enum (user/assistant)
│       # - context: JSON
│       # - created_at: datetime
├── schemas              # Pydantic schemas/data models
│   ├── __init__.py      # Package initialization
│   ├── case.py          # Case schemas
│   │   # Schemas:
│   │   # - CaseCreate
│   │   # - CaseUpdate
│   │   # - CaseResponse
│   │   # - CaseList
│   ├── database.py      # Database schemas
│   │   # Schemas:
│   │   # - DatabaseCreate
│   │   # - DatabaseUpdate
│   │   # - DatabaseResponse
│   │   # - DatabaseList
│   └── chat.py         # Chat schemas
│       # Schemas:
│       # - MessageCreate
│       # - MessageResponse
│       # - ChatHistory
│       # - ContextAdd
├── services            # Business logic
│   ├── __init__.py     # Package initialization
│   ├── case.py         # Case service
│   │   # Methods:
│   │   # - create_case()
│   │   # - update_case()
│   │   # - delete_case()
│   │   # - get_case_files()
│   ├── database.py     # Database service
│   │   # Methods:
│   │   # - create_database()
│   │   # - update_database()
│   │   # - process_files()
│   │   # - update_indexing_status()
│   └── chat.py        # Chat service
│       # Methods:
│       # - process_message()
│       # - get_chat_history()
│       # - add_chat_context()
│       # - search_messages()
├── backup              # Backup management
│   ├── __init__.py    
│   ├── scheduler.py   # Backup scheduling
│   └── storage.py     # Backup storage handlers
├── compliance         # Compliance management
│   ├── __init__.py
│   ├── gdpr.py       # GDPR compliance helpers
│   ├── hipaa.py      # HIPAA compliance helpers
│   ├── audit.py      # Audit trail management
│   └── retention.py  # Data retention policies
├── encryption        # Encryption management
│   ├── __init__.py
│   ├── field.py     # Field-level encryption
│   ├── file.py      # File encryption
│   └── key.py       # Key management
├── models           
│   ├── audit.py     # Audit log model
│   │   # Fields:
│   │   # - id: UUID
│   │   # - user_id: UUID
│   │   # - action: str
│   │   # - resource_type: str
│   │   # - resource_id: UUID
│   │   # - changes: JSON
│   │   # - ip_address: str
│   │   # - user_agent: str
│   │   # - timestamp: datetime
│   ├── backup.py    # Backup metadata model
│   ├── activity.py  # User activity model
│   └── permission.py # Fine-grained permissions model
├── services
│   ├── audit.py     # Audit service
│   │   # Methods:
│   │   # - log_activity()
│   │   # - get_audit_trail()
│   │   # - export_audit_logs()
│   ├── backup.py    # Backup service
│   │   # Methods:
│   │   # - create_backup()
│   │   # - restore_backup()
│   │   # - verify_backup()
│   ├── notification.py # Notification service
│   │   # Methods:
│   │   # - send_email()
│   │   # - send_sms()
│   │   # - send_webhook()
│   └── export.py    # Data export service
│       # Methods:
│       # - export_case_data()
│       # - export_audit_logs()
│       # - generate_reports()
└── utils              # Utility functions
    ├── __init__.py    # Package initialization
    ├── helpers.py     # Helper functions
    └── file_processor.py # File processing utilities
        # Functions:
        # - process_uploaded_file()
        # - extract_text()
        # - validate_file_type()
    ├── encryption.py # Encryption utilities
    ├── sanitizer.py  # Data sanitization
    ├── validator.py  # Custom validators
    └── metrics.py    # Metrics collection

# Notes:
# 1. Authentication & Authorization:
#    - JWT-based authentication with access and refresh tokens
#    - Access tokens: Short-lived (15-30 minutes)
#    - Refresh tokens: Longer-lived (7-14 days)
#    - Token rotation on refresh
#    - Token blacklisting on logout
#    - Rate limiting per user/IP
#    - Account lockout after failed attempts
#    - Password policies (complexity, history)
#    - Role-based access control (RBAC)
#    - IP whitelisting option
#    - MFA support

# 2. Security Measures:
#    - HTTPS only (enforced by NGINX)
#    - Secure headers (HSTS, CSP, etc.)
#    - Request rate limiting
#    - SQL injection protection
#    - XSS protection
#    - CSRF protection
#    - Input validation
#    - Output encoding
#    - Audit logging
#    - Session management
#    - Secure file upload validation

# 3. Logging & Monitoring:
#    - Request logging
#    - Error logging
#    - Security event logging
#    - Performance metrics
#    - User activity audit trail
#    - Login attempts tracking
#    - Token usage tracking
#    - File access logging
#    - ELK stack integration
#    - Alerting system

# 4. Rate Limiting:
#    - Global rate limits
#    - Per-endpoint limits
#    - Per-user limits
#    - Burst allowance
#    - Custom limits for sensitive operations

# 5. Error Handling:
#    - Standardized error responses
#    - Detailed internal logging
#    - Sanitized client responses
#    - Custom error types
#    - Error tracking integration

# 6. Compliance:
#    - GDPR compliance helpers
#    - Data retention policies
#    - Audit trails
#    - Data encryption at rest
#    - Secure data deletion
#    - Privacy by design

# 7. Performance:
#    - Connection pooling
#    - Query optimization
#    - Caching strategies
#    - Async operations
#    - Resource limits

# Additional Notes:

# 8. Backup & Recovery:
#    - Automated backup scheduling
#    - Point-in-time recovery
#    - Backup encryption
#    - Backup verification
#    - Multi-region backup storage
#    - Disaster recovery procedures

# 9. Advanced Security:
#    - Field-level encryption
#    - Hardware Security Module (HSM) integration
#    - Secrets management with Vault
#    - Security Information and Event Management (SIEM)
#    - Intrusion Detection System (IDS)
#    - Regular security scanning
#    - Vulnerability assessment
#    - Penetration testing support

# 10. Legal Compliance:
#     - Chain of custody tracking
#     - Digital signatures
#     - Document versioning
#     - Legal hold implementation
#     - Evidence preservation
#     - Compliance reporting
#     - Multi-jurisdiction support

# 11. Access Control:
#     - Fine-grained permissions
#     - Role-based access control (RBAC)
#     - Attribute-based access control (ABAC)
#     - Time-based access restrictions
#     - IP-based access restrictions
#     - Device-based restrictions
#     - Multi-factor authentication (MFA)
#     - Single sign-on (SSO)

# 12. Data Management:
#     - Data classification
#     - Data masking
#     - Data anonymization
#     - Data retention policies
#     - Secure data deletion
#     - Data lineage tracking
#     - Data quality monitoring

# 13. Monitoring & Alerting:
#     - Real-time security alerts
#     - Performance monitoring
#     - Resource usage alerts
#     - Error rate monitoring
#     - Custom alert thresholds
#     - Alert escalation
#     - On-call rotation

# 14. API Security:
#     - API versioning
#     - API documentation
#     - API key management
#     - OAuth2 integration
#     - API usage monitoring
#     - Request validation
#     - Response sanitization

# 15. Infrastructure:
#     - High availability setup
#     - Auto-scaling
#     - Load balancing
#     - CDN integration
#     - DDoS protection
#     - Failover mechanisms
#     - Service mesh

# 16. Development:
#     - CI/CD pipelines
#     - Automated testing
#     - Code quality checks
#     - Security scanning
#     - Documentation generation
#     - Version control
#     - Change management

# 17. Reporting:
#     - Audit reports
#     - Compliance reports
#     - Usage statistics
#     - Performance reports
#     - Security reports
#     - Custom report generation

# 18. Integration:
#     - Document management systems
#     - E-discovery platforms
#     - Court filing systems
#     - Legal research databases
#     - Time tracking systems
#     - Billing systems
#     - CRM integration