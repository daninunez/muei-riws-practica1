/* RIWS 2018 - PRACTICA */
/* Daniel Nuñez Sanchez (daniel.nunezs@udc.es) */
/* Rodrigo Dopazo Iglesias (r.dopazo@udc.es) */

console.log("****** Práctica RIWS 2018 ******");

let btnSearchForm = document.getElementById("btn-search-form");
let mensajeResultadoBusqueda = document.getElementById("mensaje-resultado-busqueda");
let mensajeInformacionEstadistica = document.getElementById("mensaje-informacion-estadistica");
let divFarmacos = document.getElementById("lista-farmacos");


btnSearchForm.addEventListener("click", (event) => {
    console.log("BOTON PULSADO 'btn-search-form'");
    event.preventDefault();

    let inputSearchKeywordsValue = document.getElementById("input-search-keywords").value;
    let selectShowResultsValue = document.getElementById("select-show-results").value;

    let inputNombreFarmacoValue = document.getElementById("input-nombre-farmaco").value;
    let sliderRangePriceMin = $("#slider-range").slider("values", 0);
    let sliderRangePriceMax = $("#slider-range").slider("values", 1);

    let inputPrincipioActivoValue = document.getElementById("input-principio-activo").value;
    let selectPrincipioActivo = document.getElementById('select-principio-activo').value;
    let inputExcipiente = document.getElementById("input-excipiente").value;
    let selectExcipiente = document.getElementById('select-excipiente').value;
    
    let alertsArray = []
    $('#checkbox-alertascomp-lactancia').is(":checked") ? alertsArray.push('Lactancia') : '';
    $('#checkbox-alertascomp-embarazo').is(":checked") ? alertsArray.push('Embarazo') : '';
    $('#checkbox-alertascomp-fotosensibilidad').is(":checked") ? alertsArray.push('Fotosensibilidad') : '';
    $('#checkbox-alertascomp-conduccion').is(":checked") ? alertsArray.push('Conducción de vehículos/maquinaria') : '';

    console.log("   - Input Buscar Palabras Clave: " + inputSearchKeywordsValue);
    console.log("   - Select Mostrar Resultados: " + selectShowResultsValue);

    console.log("   - Input Nombre Farmaco: " + inputNombreFarmacoValue);
    console.log("   - Slider Range Price: desde " + sliderRangePriceMin + "€ hasta " + sliderRangePriceMax + "€");

    console.log("   - Select Principio Activo: " + selectPrincipioActivo);
    console.log("   - Input Principio Activo: " + inputPrincipioActivoValue);
    console.log("   - Select Excipiente: " + selectExcipiente);
    console.log("   - Input Excipiente: " + inputExcipiente);

    console.log("   - Checkbox Lactancia: " + (document.getElementById('checkbox-alertascomp-lactancia').checked));
    console.log("   - Checkbox Embarazo: " + (document.getElementById('checkbox-alertascomp-embarazo').checked));
    console.log("   - Checkbox Fotosensibilidad: " + (document.getElementById('checkbox-alertascomp-fotosensibilidad').checked));
    console.log("   - Checkbox Conduccion: " + (document.getElementById('checkbox-alertascomp-conduccion').checked));


    // Creacion de las Queries
    let template = {
        "query": {
            "bool": {
                "must": [],
                "should": [],
                "filter": [],
            }
        },
        "size": selectShowResultsValue,
        "aggs": {
            "avg_public_price": {
                "avg": {
                    "field": "containers.pubPrice"
                }
            },
            "max_public_price": {
                "max": {
                    "field": "containers.pubPrice"
                }
            },
            "min_public_price": {
                "min": {
                    "field": "containers.pubPrice"
                }
            }
        },
    }

    if (inputSearchKeywordsValue !== '') {
        template.query.bool.must.push({
            "multi_match": { 
                "query":  inputSearchKeywordsValue,
                "fields": ["name", "whatis^2"]
            }
        })
    } else {
        template.query.bool.must.push({
            "match_all": {},
        })
    }

    if (inputPrincipioActivoValue !== '') {
        paCondition = selectPrincipioActivo === 'same' ? "must" : "must_not";
        template.query.bool.must.push(
            { "bool": {
                [paCondition]: [
                    { "match": { "PA":  inputPrincipioActivoValue }}
                ]
            }}
        );
    }

    if (inputExcipiente !== '') {
        excCondition = selectExcipiente === 'same' ? "must" : "must_not";
        template.query.bool.must.push(
            { "bool": {
                [excCondition]: [
                    { "match": { "EXC":  inputExcipiente }}
                ]
            }}
        );
    }
    
    if (inputNombreFarmacoValue !== '') {
        nombreFarmaco = "*" + inputNombreFarmacoValue + "*";
        template.query.bool.should.push(
            { "match": { 
                "name": nombreFarmaco,
            }}
        );
    }

    if (alertsArray.length !== 0) {
        template.query.bool.must.push(
            { "bool": {
                "must_not": [
                    { "match": { "compositionAlerts":  alertsArray.toString() }}
                ]
            }}
        );
    }

    template.query.bool.filter.push({
        "range": {
            "containers.pubPrice": {
                "gte": sliderRangePriceMin,
                "lte": sliderRangePriceMax === 500 ? 99999 : sliderRangePriceMax,
            }
        }
    });


    // ************* BORRAR CONSOLE LOG *****************
    console.log(template);


    // Peticion AJAX
    console.log("AJAX: Realizando peticion al servidor...");
    $.ajax({
        url: "http://localhost:9200/vademecumindex/_search",
        type: "POST",                                   // Metodo HTTP de la peticion
        async: true,                                    // Indica si la peticion sera asincrona o no
        contentType: "application/json; charset=utf-8", // Tipo de informacion que se le envia al servidor
        data: JSON.stringify(template),                 // Cuerpo de la peticion HTTP a enviar al servidor (se debe convertir antes a string con "JSON.stringify(...)")
        dataType: "json",                               // Tipo de informacion que se espera como respuesta
        timeout: 0,                                     // Especifica un timeout para la peticion (en milisegundos)

        // Se ejecuta cuando la peticion HTTP se ha realizado CON EXITO
        success: function (responseData, textStatus, xhr) {
            console.log("AJAX: La peticion se ha realizado con EXITO!");
            console.log(responseData);
            procesarRespuestaExitosa(responseData);
            console.log("");
        },

        // Se ejecuta cuando la peticion HTTP ha ocasionado un ERROR
        error: function (xhr, textStatus, errorThrown) {
            console.log("AJAX: Ha ocurrido un ERROR en la peticion! Codigo del error: '" + xhr.status + "'");
            console.log("");
            mensajeResultadoBusqueda.className = "alert alert-dark col-7";
            mensajeResultadoBusqueda.innerHTML = `<b>ERROR:</b> Ha ocurrido un error realizando la petición AJAX al servidor ElasticSearch<br>`;
        }

    });
});


// Pocesar la respuesta exitosa de AJAX
function procesarRespuestaExitosa(responseData) {
    divFarmacos.innerHTML = '';
    let numTotalDocumentos = responseData.hits.total;
    let listaResultadosFarmacos = responseData.hits.hits;
    let tamanhoResultadoLista = listaResultadosFarmacos.length;
    console.log("AJAX: RESPONSE_DATA");
    console.log("   - Numero total de documentos indexados: " + responseData.hits.total);
    console.log("   - Tamaño de la lista de resultados de la busqueda: " + tamanhoResultadoLista);

    if (tamanhoResultadoLista == 0) {
        mensajeResultadoBusqueda.className = "alert alert-danger col-9";
        mensajeResultadoBusqueda.innerHTML = `La búsqueda realizada ha encontrado <b>0 resultados</b> de un total de un total de <b>${numTotalDocumentos} documentos</b>`;

    } else {
        mensajeResultadoBusqueda.className = "alert alert-success col-9";

        let minEnvasePrecio = responseData.aggregations.min_public_price.value.toFixed(2);
        let maxEnvasePrecio = responseData.aggregations.max_public_price.value.toFixed(2);
        let avgEnvasePrecio = responseData.aggregations.avg_public_price.value.toFixed(2);
        mensajeInformacionEstadistica.className = "alert alert-primary col-9";
        mensajeInformacionEstadistica.innerHTML = `
            <div>
                Información estadística: <br>
                <ul>
                    <li>Precio <b>mínimo</b> de todos los envases: <b>${minEnvasePrecio} €</b></li>
                    <li>Precio <b>máximo</b> de todos los envases: <b>${maxEnvasePrecio} €</b></li>
                    <li>Precio <b>medio</b> de todos los envases: <b>${avgEnvasePrecio} €</b></li>
                </ul>
            </div>`;


        if (tamanhoResultadoLista == 1) {
            mensajeResultadoBusqueda.innerHTML = `La búsqueda realizada ha encontrado <b>${tamanhoResultadoLista < numTotalDocumentos ? tamanhoResultadoLista : numTotalDocumentos} resultado</b> de un total de <b>${numTotalDocumentos} documentos</b>`;
        } else {
            mensajeResultadoBusqueda.innerHTML = `La búsqueda realizada ha encontrado <b>${tamanhoResultadoLista < numTotalDocumentos ? tamanhoResultadoLista : numTotalDocumentos} resultados</b> de un total de <b>${numTotalDocumentos} documentos</b>`;
        }

        // Recorrer todos los farmacos del JSON y sacar sus propiedades
        for (const farmaco of listaResultadosFarmacos) {

            let name = farmaco._source.name;                // Nombre del Farmaco
            let url = farmaco._source.url;                  // URL del Farmaco
            let leafletUrl = farmaco._source.leafletUrl;    // URL del Prospecto del Farmaco
            let ATC = farmaco._source.ATC;                  // ATC (Sistema de Clasificacion Anatomica)
            let whatIs = '';                                // Que es ese farmaco y para que se utiliza
            whatIs = farmaco._source.whatis != '' ? farmaco._source.whatis : 'No hay información disponible sobre este fármaco';

            // PA (Principio Activo)
            let PA = '';
            for (const [indiceActual, elementPA] of farmaco._source.PA.entries()) {
                if (indiceActual != farmaco._source.PA.length - 1) {
                    PA += elementPA + ", ";
                } else {
                    PA += elementPA;
                }
            }

            // EXC (Excipiente)
            let htmlEXC = '';
            if (farmaco._source.EXC.length != 0) {
                htmlEXC = `<li><b>EXC</b>: `;
                for (const [indiceActual, elementEXC] of farmaco._source.EXC.entries()) {
                    if ((indiceActual != farmaco._source.EXC.length - 1)) {
                        htmlEXC += elementEXC + ", ";
                    } else {
                        htmlEXC += elementEXC;
                    }
                }
                if (htmlEXC.charAt(htmlEXC.length - 2) == ',') {
                    htmlEXC = htmlEXC.substring(0, htmlEXC.length - 2); // Quita la ultima coma
                }
                htmlEXC += `</li>`;
            }

            // Alertas por Composicion
            let htmlCompositionAlerts = '';
            if (farmaco._source.compositionAlerts.length != 0) {
                htmlCompositionAlerts = `<span><p><b>Alertas por composición:</b></p></span><ul>`;
                for (const elementCompositionAlerts of farmaco._source.compositionAlerts) {
                    htmlCompositionAlerts += `<li>${elementCompositionAlerts}</li>`;
                }
                htmlCompositionAlerts += `</ul>`;
            }

            let numCompositionAlerts = farmaco._source.numCompositionAlerts;
            let numContainers = farmaco._source.numContainers;

            // Envases
            let listaContainers = farmaco._source.containers;
            let htmlContainers = '';
            let coloresCardEnvases = ["bg-secondary", "bg-danger", "bg-info", "bg-primary", "bg-success", "bg-warning", "bg-dark",
                                        "bg-secondary", "bg-danger", "bg-info", "bg-primary", "bg-success", "bg-warning", "bg-dark",
                                        "bg-secondary", "bg-danger", "bg-info", "bg-primary", "bg-success", "bg-warning", "bg-dark"];
            for (const [indiceActual, elementContainers] of listaContainers.entries()) {

                let containerType = elementContainers.containerType;        // Tipo de envase

                let containerDrugTypeEFG = elementContainers.drugType.EFG;  // Medicamento Genérico
                let containerDrugTypeEFP = elementContainers.drugType.EFP;  // Medicamento publicitario
                let containerDrugTypeH = elementContainers.drugType.H;      // Medicamento de uso hospitalario
                let containerDrugTypeDH = elementContainers.drugType.DH;    // Medicamento de diagnostico hospitalario
                let containerDrugTypeECM = elementContainers.drugType.ECM;  // Medicamento de especial control médico
                let containerDrugTypeTLD = elementContainers.drugType.TLD;  // Tratamiento de larga duracion
                let containerDrugTypeMTP = elementContainers.drugType.MTP;  // Medicamento tradicional a base de plantas

                let htmlDrugs = '';
                if (containerDrugTypeEFG != null) {
                    htmlDrugs += `<li><b>EFG</b>: ${containerDrugTypeEFG}</li>`;
                }
                if (containerDrugTypeEFP != null) {
                    htmlDrugs += `<li><b>EFP</b>: ${containerDrugTypeEFP}</li>`;
                }
                if (containerDrugTypeH != null) {
                    htmlDrugs += `<li><b>H</b>: ${containerDrugTypeH}</li>`;
                }
                if (containerDrugTypeDH != null) {
                    htmlDrugs += `<li><b>DH</b>: ${containerDrugTypeDH}</li>`;
                }
                if (containerDrugTypeECM != null) {
                    htmlDrugs += `<li><b>ECM</b>: ${containerDrugTypeECM}</li>`;
                }
                if (containerDrugTypeTLD != null) {
                    htmlDrugs += `<li><b>TLD</b>: ${containerDrugTypeTLD}</li>`;
                }
                if (containerDrugTypeMTP != null) {
                    htmlDrugs += `<li><b>MTP</b>: ${containerDrugTypeMTP}</li>`;
                }

                // Detalles del Envase
                let htmlContainerDetails = '';
                if (elementContainers.details.length != 0) {
                    htmlContainerDetails = `<li>Detalles adicionales:</li><ul>`;
                    for (const elementDetails of elementContainers.details) {
                        htmlContainerDetails += `<li>${elementDetails}</li>`;
                    }
                    htmlContainerDetails += `</ul>`;
                }

                // Precio de venta del Laboratorio
                let laboratoryPrice = elementContainers.labPrice;
                let htmlLaboratoryPrice = '';
                if (laboratoryPrice != null) {
                    htmlLaboratoryPrice += `<li><b>Precio Laboratorio</b>: ${laboratoryPrice} €</li>`;
                }

                // Precio de venta al Publico
                let publicPrice = elementContainers.pubPrice;
                let htmlPublicPrice = '';
                if (publicPrice != null) {
                    htmlPublicPrice += `<li><b>Precio Publico</b>: ${publicPrice} €</li>`;
                }

                // Financiado por Sistema Nacional de Salud
                let containerSns = elementContainers.sns != null ? elementContainers.sns : 'No hay información';
                let containerBillableSNS = elementContainers.billableSNS == 'SI' ? 'Si' : 'No';

                // Comercializado
                let containerMarketed = elementContainers.marketed == 'Si' ? 'Si' : 'No';

                // Situacion (Alta o no)
                let containerSituation = elementContainers.situation == 'Alta' ? 'Alta' : 'Baja';

                // Codigo Nacional de Parafarmacia (valido en ESP)
                let containerNationalCode = elementContainers.nationalCode;

                // Numero de Articulo Europeo (EAN-13)
                let containerEAN13 = elementContainers.EAN13;


                htmlContainers += `
                    <div class="col-4">
                        <div class="card text-white ${coloresCardEnvases[indiceActual]}" style="max-width: 18rem; margin-bottom: 15px">
                            <div class="card-header"><i class="fas fa-box-open"></i>${containerType}</div>
                            <div class="card-body">
                                <div class="card-title"></div>
                                <div class="card-text">
                                    <ul>
                                        ${htmlPublicPrice}
                                        ${htmlLaboratoryPrice}
                                        ${htmlDrugs}
                                        <li><b>SNS</b>: ${containerSns}</li>
                                        <li><b>Facturable SNS</b>: ${containerBillableSNS}</li>
                                        <li><b>Comercializado</b>: ${containerMarketed}</li>
                                        <li><b>Situación</b>: ${containerSituation}</li>
                                        <li><b>Código Nacional</b>: ${containerNationalCode}</li>
                                        <li><b>EAN13</b>: ${containerEAN13}</li>
                                        ${htmlContainerDetails}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>`;

            } // Fin FOR indiceActual, elementContainers of listaContainers


            // ************************************** BORRAR ******** NON AÑADIR ?????? DEMASIADA INFORMACION NO HTML ???? *************
            let mechanismAction = farmaco._source.mechanismAction;
            let therapeuticIndications = farmaco._source.therapeuticIndications;
            let administrationMode = farmaco._source.administrationMode;


            divFarmacos.innerHTML += `
                <div class="col-12" style="margin-bottom: 15px">
                    <div class="card bg-light">
                        <div class="card-header">
                            <h5>
                                <a href="${url}" target="_blank"><b><i class="fas fa-capsules"></i>${name}</b></a>
                                <span>
                                    <dfn data-info="${whatIs}"><i class="fas fa-info-circle"></i></dfn>
                                </span>
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="card-title">
                                <div class="row">
                                    <div class="col-12">
                                        <p><a href="${leafletUrl}" target="_blank"><i class="far fa-file-alt"></i>&nbsp;&nbsp;Ver el prospecto completo...</a></p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-7">
                                        <span><p><b>Información general:</b></p></span>
                                        <ul>
                                            <li><b>ATC</b>: ${ATC}</li>
                                            <li><b>PA</b>: ${PA}</li>
                                            ${htmlEXC}
                                        </ul>
                                    </div>
                                    <div class="col-5">
                                        ${htmlCompositionAlerts}
                                    </div>
                                </div>
                            </div>
                            <div class="card-text">
                                <div class="row">
                                    ${htmlContainers}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

        } // Fin FOR farmaco of listaResultadosFarmacos

    } // Fin ELSE tamanhoResultadoLista == 0

} // Fin FUNCTION procesarRespuestaExitosa
