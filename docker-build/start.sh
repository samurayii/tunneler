#!/usr/bin/dumb-init /bin/bash

if [[ $APP_RESTARTER ]]; then
    app-restarter -e "${APP_NAME} --config /${APP_NAME}/config.toml" -tmp /app_restarter_tmp -c /${APP_NAME}
else
    cd /${APP_NAME}
    ${APP_NAME} --config /${APP_NAME}/config.toml
fi