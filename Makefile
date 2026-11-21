SERVICE := historia-veterinaria-api
REGION := us-central1
PROJECT := geosdata
PAGES_PROJECT := historia-veterinaria

.PHONY: deploy deploy-api deploy-web

deploy: deploy-api deploy-web

deploy-api:
	gcloud run services describe $(SERVICE) --region $(REGION) --project $(PROJECT) --format='value(metadata.name)'
	cd api && gcloud run deploy $(SERVICE) --source . --region $(REGION) --project $(PROJECT) --quiet

deploy-web:
	cd web && npm ci && npm run build
	cd site && npm ci && npm run build
	rm -rf site/dist/app && mkdir -p site/dist/app && cp -r web/dist/* site/dist/app/
	cd site && npx wrangler pages deploy dist --project-name $(PAGES_PROJECT) --branch main
