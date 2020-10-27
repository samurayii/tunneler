# Tunneler

## Информация

Сервис для центрального туннелирования портов через ssh. Имеет зависимость от пакета Linux `sshpass`.

## Оглавление:
- [Установка](#install)
- [Ключи запуска](#launch)
- [Конфигурация](#configuration)
- [HTTP API](API.md)

## <a name="install"></a> Установка и использование

пример строки запуска: `node /tunneler/app.js -c config.toml`

пример запуска docker контейнера: `docker run -d --restart unless-stopped pwd/config.toml:/tunneler/config.toml -p 80:80 -p 3001:3001 samuray/tunneler:latest`

## <a name="launch"></a> Таблица ключей запуска.
Ключ | Описание
------------ | -------------
--version, -v | вывести номер версии приложения
--help, -h | вызвать справку по ключам запуска
--config, -c | путь к файлу конфигурации в формате toml или json, (переменная среды: TUNNELER_CONFIG_PATH)

## <a name="configuration"></a> Конфигурация

Программа настраивается через файл конфигурации двух форматов TOML или JSON. Так же можно настраивать через переменные среды, которые будут считаться первичными.

### Секции файла конфигурации

- **logger** - настрока логгера (переменная среды: TUNNELER_LOGGER)
- **authorization** - настрока авторизации (переменная среды: TUNNELER_AUTHORIZATION)
- **api** - настройка API (переменная среды: TUNNELER_API)
- **tunnels** - массив настроек туннелей (переменная среды: TUNNELER_TUNNELS)

### Пример файла конфигурации config.toml

```toml
[logger]                # настройка логгера
    mode = "prod"       # режим (prod или dev или debug)
    enable = true       # активация логгера
    timestamp = false   # выводить время лога (true или false)
    type = true         # выводить тип лога (true или false)

[authorization]                     # настройка авторизации
    [[authorization.users]]         # массив пользователей
        username = "username"       # имя пользователя
        password = "password"       # пароль пользователя
    [[authorization.users]]
        token = "xxxxxxxxxxxx"      # токен доступа

[api]                                   # настройка API
    enable = false                      # активация API
    auth = false                        # активация авторизации
    listening = "*:3001"                # настройка слушателя
    prefix = "/api"                     # префикс
    proxy = false                       # когда поле заголовка true proxy будут доверенным
    subdomain_offset = 2                # смещение от поддомена для игнорирования
    proxy_header = "X-Forwarded-For"    # заголовок IP прокси
    ips_count = 0                       # максимальное количество IP прочитанное из заголовка прокси, по умолчанию 0 (означает бесконечность)
    env = "development"                 # среда для сервера koa
    #keys = []                          # массив подписанных ключей cookie

[[tunnels]]                             # массив настроек туннелей
    name = ""                           # имя туннеля, должно быть уникальным
    enable = true                       # активация туннеля
    user = "user"                       # пользователь
    password = "password"               # пароль
    remote_host = ""                    # сервер подключения
    target_host = "127.0.0.1"           # сервер подключения к порту
    target_port = 80                    # порт который нужно прокинуть
    destination_host = "0.0.0.0"        # сервер на котором будет открыть порт
    destination_port = 80               # открываемый порт
    ssh_port = 22                       # порт подключения ssh
    critical = false                    # критичность канала
    restart = false                     # перезапуск канала (игнорируется если critical=true)
    restart_interval = 10               # интервал перезапуска (игнорируется если restart=false)
```

### Таблица параметров конфигурации

| Параметр | Тип | Значение | Описание |
| ----- | ----- | ----- | ----- |
| logger.mode |строка | prod | режим отображения prod, dev или debug |
| logger.enable | логический | true | активация логгера |
| logger.timestamp | логический | false | выводить время лога (true или false) |
| logger.type | логический | true | выводить тип лога (true или false) |
| authorization.users | массив | [] | массив пользователей |
| api.enable | логический | false | активация API (true или false) |
| api.auth | логический | false | активация авторизации (true или false) |
| api.listening | строка | *:3001 | настройка слушателя, формат <хост>:<порт> |
| api.prefix | строка | /api | префикс |
| api.proxy | логический | false | когда поле заголовка true proxy будут доверенным |
| api.subdomain_offset | число | 2 | смещение от поддомена для игнорирования |
| api.proxy_header | строка | X-Forwarded-For | заголовок IP прокси |
| api.ips_count | число | 0 | максимальное количество IP прочитанное из заголовка прокси, по умолчанию 0 (означает бесконечность) |
| api.env | строка | development | среда для сервера [koa](https://www.npmjs.com/package/koa) |
| api.keys | строка[] |  | массив подписанных ключей cookie |
| tunnels.name | строка |  | имя туннеля, должно быть уникальным |
| tunnels.enable | логический | true | активация туннеля|
| tunnels.user | строка | user | пользователь |
| tunnels.password | строка | password | пароль |
| tunnels.remote_host | строка |  | сервер подключения |
| tunnels.target_host | строка | 127.0.0.1 | сервер подключения к порту |
| tunnels.target_port | число | 80 | порт который нужно прокинуть |
| tunnels.destination_host | строка | 0.0.0.0 | сервер на котором будет открыть порт |
| tunnels.destination_port | число | 80 | открываемый порт |
| tunnels.ssh_port | число | 22 | порт подключения ssh |
| tunnels.critical | логический | false | критичность канала |
| tunnels.restart | логический | false | перезапуск канала (игнорируется если critical=true) |
| tunnels.restart_interval | строка | 10 | интервал перезапуска (игнорируется если restart=false) |

### Настройка через переменные среды

Ключи конфигурации можно задать через переменные среды ОС. Имя переменной среды формируется из двух частей, префикса `TUNNELER_` и имени переменной в верхнем реестре. Если переменная вложена, то это обозначается символом `_`. Переменные среды имеют высший приоритет.

пример для переменной **logger.mode**: `TUNNELER_LOGGER_MODE`

пример для переменной **api.ips_count**: `TUNNELER_API_IPS_COUNT`
