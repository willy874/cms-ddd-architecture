ALL_SERVICES="gateway-service auth-service user-service"
for service in $ALL_SERVICES; do
  echo "Starting the $service..."
  pnpm --filter $service start:dev &
done