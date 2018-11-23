# -*- coding: utf-8 -*-

# Scrapy settings for vadecrawler project
#
# For simplicity, this file contains only settings considered important or
# commonly used. You can find more settings consulting the documentation:
#
#     https://doc.scrapy.org/en/latest/topics/settings.html
#     https://doc.scrapy.org/en/latest/topics/downloader-middleware.html
#     https://doc.scrapy.org/en/latest/topics/spider-middleware.html

FEED_EXPORT_ENCODING = 'utf-8'


BOT_NAME = 'vadecrawler'

SPIDER_MODULES = ['vadecrawler.spiders']
NEWSPIDER_MODULE = 'vadecrawler.spiders'


# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = 'vadecrawler (+http://www.yourdomain.com)'

# Obey robots.txt rules
ROBOTSTXT_OBEY = True

# Configure maximum concurrent requests performed by Scrapy (default: 16)
#CONCURRENT_REQUESTS = 32

# Configure a delay for requests for the same website (default: 0)
# See https://doc.scrapy.org/en/latest/topics/settings.html#download-delay
# See also autothrottle settings and docs
#DOWNLOAD_DELAY = 3
# The download delay setting will honor only one of:
#CONCURRENT_REQUESTS_PER_DOMAIN = 16
#CONCURRENT_REQUESTS_PER_IP = 16

# Disable cookies (enabled by default)
#COOKIES_ENABLED = False

# Disable Telnet Console (enabled by default)
#TELNETCONSOLE_ENABLED = False

# Override the default request headers:
#DEFAULT_REQUEST_HEADERS = {
#   'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
#   'Accept-Language': 'en',
#}

# Enable or disable spider middlewares
# See https://doc.scrapy.org/en/latest/topics/spider-middleware.html
#SPIDER_MIDDLEWARES = {
#    'vadecrawler.middlewares.VadecrawlerSpiderMiddleware': 543,
#}

# Enable or disable downloader middlewares
# See https://doc.scrapy.org/en/latest/topics/downloader-middleware.html
#DOWNLOADER_MIDDLEWARES = {
#    'vadecrawler.middlewares.VadecrawlerDownloaderMiddleware': 543,
#}

# Enable or disable extensions
# See https://doc.scrapy.org/en/latest/topics/extensions.html
#EXTENSIONS = {
#    'scrapy.extensions.telnet.TelnetConsole': None,
#}


# Configure item pipelines
# See https://doc.scrapy.org/en/latest/topics/item-pipeline.html

### ITEM_PIPELINES:
###   Diccionario que contiene los pipelines (para exportar los datos a un servicio o con un formato concreto) 
###   y su orden de ejecucion (de 0 a 1000). Mas prioridad cuanto menor sea el valor.
ITEM_PIPELINES = {
   'vadecrawler.pipelines.VadecrawlerPipeline': 300,
   'scrapyelasticsearch.scrapyelasticsearch.ElasticSearchPipeline': 500
}


# Enable and configure the AutoThrottle extension (disabled by default)
# See https://doc.scrapy.org/en/latest/topics/autothrottle.html
#AUTOTHROTTLE_ENABLED = True
# The initial download delay
#AUTOTHROTTLE_START_DELAY = 5
# The maximum download delay to be set in case of high latencies
#AUTOTHROTTLE_MAX_DELAY = 60
# The average number of requests Scrapy should be sending in parallel to
# each remote server
#AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
# Enable showing throttling stats for every response received:
#AUTOTHROTTLE_DEBUG = False

# Enable and configure HTTP caching (disabled by default)
# See https://doc.scrapy.org/en/latest/topics/downloader-middleware.html#httpcache-middleware-settings
#HTTPCACHE_ENABLED = True
#HTTPCACHE_EXPIRATION_SECS = 0
#HTTPCACHE_DIR = 'httpcache'
#HTTPCACHE_IGNORE_HTTP_CODES = []
#HTTPCACHE_STORAGE = 'scrapy.extensions.httpcache.FilesystemCacheStorage'


############ Configuracion ScrapyElasticSearch ############
### Informacion sobre esta configuracion: https://github.com/knockrentals/scrapy-elasticsearch

### Para buscar y hacer QUERIES se haria usando el formato: 
###   http://localhost:9200/[index]/[type]/[operation]

### Informacion sobre los conceptos: 
###   https://www.elastic.co/blog/what-is-an-elasticsearch-index
###   https://www.elastic.co/guide/en/elasticsearch/reference/6.5/_basic_concepts.html

###   "Un cluster ElasticSearch puede contener multiples Indices (databases), que a su vez contienen multiples Tipos (tablas).
###   Estos tipos contienen varios Documentos (filas), y cada documento tiene Propiedades (columnas)."

### Comparativa de conceptos BD relacional vs ElasticSearch:
###   MySQL         =>  Databases =>  Tables  =>  Columns/Rows
###   Elasticsearch =>  Indices   =>  Types   =>  Documents with Properties

ELASTICSEARCH_SERVERS = ['localhost']   # Lista de servidores/hosts
ELASTICSEARCH_INDEX = 'vademecumindex'  # Un 'indice' en ElasticSearch === 'database' en BD Relacional
ELASTICSEARCH_TYPE = 'farmacos'         # Un 'type' en ElasticSearch === 'table' en BD Relacional
ELASTICSEARCH_UNIQ_KEY = 'name'         # Representa el ID unico de cada registro

#ELASTICSEARCH_INDEX_DATE_FORMAT = '%Y-%m'  # NO DESCOMENTAR. Si se descomenta esto, habria que poner en la url "indice-2018-11"
