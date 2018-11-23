import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from vadecrawler.items import VadecrawlerItem, ContainerItem, DrugTypeItem

URL_BASE = 'https://www.vademecum.es'

class MySpyder(CrawlSpider):
    iterations = 0
    name = 'spyder'
    allowed_domains = ['vademecum.es']
    start_urls = [
        'https://www.vademecum.es/medicamentos-a_1',
    ]

    
    rules = {
        Rule(LinkExtractor(allow=("https://www.vademecum.es/medicament*"), restrict_xpaths=('//div[@role="content"]/ul[@class="no-bullet"]/li//a')), callback='parse_item'),
        Rule(LinkExtractor(allow=("https://www.vademecum.es/medicament*"), restrict_xpaths=('//div[@role="content"]/select/option'), tags=('a', 'option'), attrs=('value')))
    }

    def parse_item(self, response):

        # INICIALIZAR ATRIBUTOS
        item = VadecrawlerItem()
        item['name'] = ''
        item['url'] = ''
        item['leafletUrl'] = ''
        item['ATC'] = ''
        item['PA'] = []
        item['EXC'] = []
        item['compositionAlerts'] = []
        item['numCompositionAlerts'] = 0
        item['numContainers'] = 0
        item['containers'] = []

        ## NOMBRE FARMACO
        item['name'] = response.xpath('//div[@role="content"]/div/h1/span/text()').extract_first()

        ## URL FARMACO
        item['url'] = response.request.url

        ## URL PROSPECTO
        leafletUrl = response.xpath('//div[@role="content"]/div/ul/li/a[@id="mM_2"]/@href').extract_first()
        if (leafletUrl):
            item['leafletUrl'] = URL_BASE + leafletUrl

        ## PROPIEDADES: ATC, PA y EXC
        properties = response.xpath('//h3["Envases"]/parent::*/table/tr')
        for prop in properties:
            propElement = prop.xpath('normalize-space(td/text())').extract_first()
            if (propElement.startswith('ATC')):
                item['ATC'] = prop.xpath('normalize-space(td/a/strong)').extract_first()
            
            if (propElement.startswith('PA')):
                paElement = prop.xpath('td/a')
                for pa in paElement:
                    item['PA'].append(pa.xpath('normalize-space(strong)').extract_first())
            
            if (propElement.startswith('EXC')):
                excElement = prop.xpath('td/strong')
                for exc in excElement:
                    item['EXC'].append(exc.xpath('normalize-space(text())').extract_first())

        ## LISTA ALERTAS POR COMPOSICION
        alertasComp = response.xpath('(//h5["Alertas por composición:"])[1]/following-sibling::node()/dd/a')
        for alert in alertasComp:
            alert_text = alert.xpath('normalize-space(span/following-sibling::text())').extract()
            if (len(alert_text[0]) == 0):
                alert_text = alert.xpath('normalize-space(img/following-sibling::text())').extract()
            if (len(alert_text[0]) != 0):
                item['numCompositionAlerts'] = item['numCompositionAlerts'] + 1
                item['compositionAlerts'].append(alert_text[0])
        
        ## ENVASES
        containers = response.xpath('(//h3["Envases"])/following-sibling::node()/ul')
        for container in containers:
            item['numContainers'] = item['numContainers'] + 1
            itemContainer = ContainerItem()
            itemDrugType = DrugTypeItem()
            itemContainer['containerType'] = container.xpath('normalize-space(li[@class="title"])').extract_first()
            itemContainer['drugType'] = {}
            itemContainer['details'] = []


            ## Precios de los envases
            prices = container.xpath('strong')
            for price in prices:
                priceElem = price.xpath('normalize-space(text())').extract_first()
                if (priceElem.startswith("Precio de Venta del Labora")):
                    priceValue = price.xpath('normalize-space(following-sibling::node()/text())').extract_first()
                    if len(priceValue) == 0:
                        priceValue = price.xpath('normalize-space(following-sibling::node()/span/text())').extract_first()
                    if (len(priceValue) != 0):
                        itemContainer['labPrice'] = float(priceValue[:-1])
                if (priceElem.startswith("Precio de Venta al Púb")):
                    priceValue = price.xpath('normalize-space(following-sibling::node()/text())').extract_first()
                    if len(priceValue) == 0:
                        priceValue = price.xpath('normalize-space(following-sibling::node()/span/text())').extract_first()
                    if (len(priceValue) != 0):
                        itemContainer['pubPrice'] = float(priceValue[:-1])

            
            elements = container.xpath('li')
            for element in elements:
                strongElement = element.xpath('normalize-space(strong)').extract_first()
                strongElementValue = element.xpath('normalize-space(strong/following-sibling::text())').extract_first()
                if (strongElement == "EFG"):
                    itemDrugType['EFG'] = strongElementValue[2:]
                if (strongElement == "EFP"):
                    itemDrugType['EFP'] = strongElementValue[2:]
                if (strongElement == "H"):
                    itemDrugType['H'] = strongElementValue[2:]
                if (strongElement == "DH"):
                    itemDrugType['DH'] = strongElementValue[2:]
                if (strongElement == "ECM"):
                    itemDrugType['ECM'] = strongElementValue[2:]
                if (strongElement == "TLD"):
                    itemDrugType['TLD'] = strongElementValue[2:]
                if (strongElement == "MTP"):
                    itemDrugType['MTP'] = strongElementValue[2:]

                imgElement = element.xpath('normalize-space(img/following-sibling::text())').extract_first()
                if (imgElement != ''):
                    itemContainer['details'].append(imgElement)

                if ((strongElement.startswith('Fi')) or (strongElement.startswith('Exc'))):
                    itemContainer['sns'] = strongElementValue[2:]

                if (strongElement.startswith('Facturable SNS')):
                    itemContainer['billableSNS'] = strongElementValue

                if (strongElement.startswith('Comercializado')):
                    marketedElement = element.xpath('normalize-space(strong/following-sibling::node()/font/b)').extract_first()
                    itemContainer['marketed'] = marketedElement

                if (strongElement.startswith('Situación')):
                    situationElement = element.xpath('normalize-space(strong/following-sibling::node()/font/b)').extract_first()
                    itemContainer['situation'] = situationElement

                if (strongElement.startswith('Código')):
                    nationalCodeElement = element.xpath('normalize-space(strong/following-sibling::node()/text())').extract_first()
                    itemContainer['nationalCode'] = nationalCodeElement

                if (strongElement.startswith('EAN')):
                    eanElement = element.xpath('normalize-space(strong/following-sibling::node()/text())').extract_first()
                    itemContainer['EAN13'] = eanElement


            itemContainer['drugType'] = itemDrugType 
            item['containers'].append(itemContainer)

        yield scrapy.Request(URL_BASE + leafletUrl, callback=self.parse_definition, meta={'item': item})



    def parse_definition(self, response):
        item = response.meta['item']
        whatis = ""
        whatisElement = response.xpath("//div[@class='bodytext3']/h2[1]/following-sibling::div[1]/p")

        for elem in whatisElement:
            spanElem = elem.xpath("span")
            strongElem = elem.xpath("strong")
            for spanE in spanElem:
                whatis += spanE.xpath("normalize-space(text())").extract_first()
            for strongE in strongElem:
                whatis += strongE.xpath("normalize-space(span/text())").extract_first()

        item['whatis'] = whatis
        return item
