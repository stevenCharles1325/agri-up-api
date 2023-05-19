cd build
ENV_SILENT=true node ace migration:run --force && node ace db:seed