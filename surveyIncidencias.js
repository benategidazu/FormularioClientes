require ([
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/tasks/QueryTask",
    "esri/tasks/query",
    "esri/graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",

    "dojo/ready",
    "dojo/on",
    "dojo/dom",

    "dijit/form/Button",

    "dojo/domReady!"
],
function (ArcGISDynamicMapServiceLayer,FeatureLayer, QueryTask, Query, Graphic, SimpleMarkerSymbol,SimpleLineSymbol, Color, ready, on, dom, Button){

    ready(function (){

        // Con el botón 'enviar incidencia' lanzamos la función enviarincidencia
        document.getElementById("incidencia").onclick = function enviarincidencia (){
        // La función enviarincidencia debera llamar a la feature service del que tira workforce y seleccionar el cliente que dice que tiene un problema. Adicionalmente, se intentará que el cliente que tiene la incidencia aparezca como una orden para los trabajadores de campo.

        // Recogemos los input en dos variables:
        var idCliente = document.getElementById("idCliente").value;
        var descripcion = document.getElementById("descripcion").value;

        // Añadimos la feature service de clientes:
        var capaAsignaciones = new FeatureLayer("https://services6.arcgis.com/Rd3IgMmWThaCHouh/arcgis/rest/services/workforce_64b7181905e44791b2c7af51a6855758/FeatureServer/0")
        console.log(capaAsignaciones)

        // var msWorkforce = new FeatureLayer ("https://benat-egidazu.maps.arcgis.com/home/webmap/viewer.html?layers=359c63fdeeab45cab735052d6e029c00&layerId=0")
        
        // Hacemos una query con los inputs pasados por el cliente:
        var queryTask = new QueryTask ("https://services6.arcgis.com/I5TcbPkHyHc6ppBW/ArcGIS/rest/services/Prueba_Survey_Clientes/FeatureServer/0");
        var query = new Query ();
        query.returnGeometry = true;
        // query.outFields = ["user_id_cliente", "user_poblacion"];
        // query.where = "user_id_cliente = '" + idCliente + "'" 
        query.outFields = ["USER_Poblacion", "USER_ID_Cliente"]
        query.where = "USER_ID_Cliente = '"+idCliente+"'";

        queryTask.execute(query, function añadirIncidencia(resultado){
            console.log(resultado)
            // Hay que recoger la localización del cliente de la incidencia y añadir ese punto a la capa de asignaciones de workforce.
            
            if (resultado.features.length > 0){
                var asignacion = resultado.features[0].geometry;
                console.log(asignacion)
                
                var simbologia = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_X, 15, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                    new Color([255,0,0]), 1), new Color ([255, 177, 0]))

                console.log(simbologia)
                console.log(capaAsignaciones)

                // Aquí abría que añadir el punto 'asignación' a la feature layer.
                // capaAsignaciones.graphics.add(new Graphic (asignacion, simbologia))
                capaAsignaciones.applyEdits([{
                    "geometry": asignacion,
                    "attributes": {
                        "status": 0,
                        "description": null,
                        "notes": null,
                        "priority": 2,
                        "assignmenttype": "AC2387C1-0B92-468C-BCE8-632DC61BA06E",
                        "workorderid": null,
                        "duedate": null,
                        "workerid": null,
                        "location": "Indeterminado",
                        "declinedcomment": null,
                        "assigneddate": null,
                        "inprogressdate": null,
                        "completeddate": null,
                        "declineddate": null,
                        "pauseddate": null,
                        "dispatcherid": null
                    }
                }],null, null)
            }
        });
        };
     
    })    
})
