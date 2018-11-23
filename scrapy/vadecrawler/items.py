# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy

class VadecrawlerItem(scrapy.Item):
    # define the fields for your item here
    name = scrapy.Field()       # Nombre del farmaco
    url = scrapy.Field()        # URL del farmaco
    leafletUrl = scrapy.Field() # URL del Prospecto del farmaco
    ATC = scrapy.Field()        # Sistema de Clasificación Anatómica, Terapeutica y Quimica
    PA = scrapy.Field()         # Principio Activo
    EXC = scrapy.Field()        # Excipiente 

    whatis = scrapy.Field()     # Que es ese farmaco y para que se utiliza

    numCompositionAlerts = scrapy.Field() # Numero de alertas por composicion
    compositionAlerts = scrapy.Field()    # Alertas por composicion
	
    numContainers = scrapy.Field()        # Numero de envases
    containers = scrapy.Field()           # Informacion de los envases

    # mechanismAction = scrapy.Field()
    # therapeuticIndications = scrapy.Field()
    # administrationMode = scrapy.Field()

    
class ContainerItem(scrapy.item.Field):
    containerType = scrapy.Field()        # Tipo de envase (Envase con 30 comprimidos, 500 comprimidos...)
    pubPrice = scrapy.Field()             # Precio de venta al publico
    labPrice = scrapy.Field()             # Precio de venta del laboratorio
    drugType = scrapy.Field()             # Tipo de uso del medicamento (Generico, de uso hospitalario...)
    details = scrapy.Field()              # Detalles adicionales del envase
    sns = scrapy.Field()                  # Si el envase esta financiado por el Sistema Nacional de Salud (SNS)
    billableSNS = scrapy.Field()          # Facturable SNS
    marketed = scrapy.Field()             # Comercializado
    situation = scrapy.Field()            # Situacion (Alta o no)
    nationalCode = scrapy.Field()         # Codigo Nacional de Parafarmacia (valido en ESP)
    EAN13 = scrapy.Field()                # Numero de Articulo Europeo (EAN-13)
    
	
class DrugTypeItem(scrapy.item.Field):
    EFG = scrapy.Field()        # Medicamento Genérico
    EFP = scrapy.Field()        # Medicamento publicitario
    H = scrapy.Field()          # Medicamento de uso hospitalario
    DH = scrapy.Field()         # Medicamento de diagnostico hospitalario
    ECM = scrapy.Field()        # Medicamento de especial control médico
    TLD = scrapy.Field()        # Tratamiento de larga duracion
    MTP = scrapy.Field()        # Medicamento tradicional a base de plantas
