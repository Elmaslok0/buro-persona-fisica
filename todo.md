# Project TODO

## Database Schema
- [x] Create clients table with personal information
- [x] Create addresses table for client addresses
- [x] Create employments table for employment history
- [x] Create credit_accounts table for credit accounts
- [x] Create credit_queries table for query history
- [x] Create credit_reports table for report storage
- [x] Create documents table for S3 document references
- [x] Create alerts table for monitoring alerts

## Backend Implementation
- [x] Configure Buró de Crédito API credentials as secrets
- [x] Create API client for Buró de Crédito integration
- [x] Implement autenticador endpoint (authentication with security questions)
- [x] Implement reporte-de-credito endpoint (credit report)
- [x] Implement informe-buro endpoint (bureau report)
- [x] Implement monitor endpoint (credit monitoring)
- [x] Implement prospector endpoint (client prospecting)
- [x] Implement estimador-ingresos endpoint (income estimator)
- [x] Create tRPC routers for all modules
- [x] Implement S3 storage for documents
- [ ] Implement PDF report generation
- [x] Implement LLM integration for credit analysis

## Frontend Implementation
- [x] Configure brutalist typography theme (heavy sans-serif, high contrast)
- [x] Create main dashboard with key metrics
- [ ] Create authentication module page
- [ ] Create credit report module page
- [ ] Create bureau report module page
- [ ] Create monitor module page
- [ ] Create prospector module page
- [ ] Create income estimator module page
- [x] Create personal data management page
- [ ] Create query history page with filters
- [ ] Create document upload interface
- [ ] Create report export functionality
- [ ] Implement LLM-powered recommendations display

## Testing & Deployment
- [x] Write vitest tests for all tRPC procedures
- [ ] Test API integration with real Buró de Crédito endpoints
- [x] Verify S3 document storage
- [ ] Test PDF generation
- [x] Verify LLM analysis functionality
- [x] Create final checkpoint for deployment
