let statistics= {
    democrats: [],
    republicans: [],
    independents: [],
    averageVotesWithPartyDemocrats: 0,
    averageVotesWithPartyRepublicans: 0,
    averageVotesWithPartyIndependents: 0,
    mostEngaged: [],
    leastEngaged: [],
    mostLoyal: [],
    leastLoyal: [],
};

//GLANCE
//Cree un array con los miembros de los partidos...para sacar la cantidad de miembros por partido utilizo la propiedad .length!!
statistics.democrats= data.results[0].members.filter(member => member.party === "D");
statistics.republicans= data.results[0].members.filter(member => member.party === "R");
statistics.independents= data.results[0].members.filter(member => member.party === "ID");
//sacar la cantidad de miembros para hacer la tabla no te olvides

//Creo funcion porcenaje votos with party

function porcentajesPromedio(arr) {
    let sumaPorcentajes= 0;
    for (i=0; i < arr.length; i++) {
        sumaPorcentajes= sumaPorcentajes + arr[i].votes_with_party_pct
    };
    return porcentajePromedio= (sumaPorcentajes / arr.length).toFixed(2);
};

//Le asigno valor a los average de cada partido
statistics.averageVotesWithPartyDemocrats= porcentajesPromedio(statistics.democrats);
statistics.averageVotesWithPartyRepublicans= porcentajesPromedio(statistics.republicans);
statistics.averageVotesWithPartyIndependents= promedioNaN(porcentajesPromedio(statistics.independents));
//hago una funcion para asignarle el valor correspondiente o si no existe que le asigne un str '-'
function promedioNaN(funcion){
    if(isNaN(funcion)){
        return '-';
    } else {
        return funcion
    };
};

//Saco porcentaje de votos totales
let porcentajeTotal= porcentajesPromedio(data.results[0].members);

//CAPTURO ELEMENTO DEL DOM
let tablaGlance= document.getElementById('glance');
//CREO FUNCION TABLA GLANCE
function crearTablaGlance(){
    let datosRep= document.createElement("tr");
    let datosDem= document.createElement("tr");
    let datosId= document.createElement("tr");
    let datosTotal= document.createElement("tr");
    datosRep.innerHTML= `<td>Republican</td><td>${statistics.republicans.length}<td>${statistics.averageVotesWithPartyRepublicans}</td>`;
    datosDem.innerHTML= `<td>Democrat</td><td>${statistics.democrats.length}<td>${statistics.averageVotesWithPartyDemocrats}</td>`;
    datosId.innerHTML= `<td>Independent</td><td>${statistics.independents.length}<td>${statistics.averageVotesWithPartyIndependents}</td>`;
    datosTotal.innerHTML= `<td>Total</td><td>${statistics.republicans.length + statistics.democrats.length + statistics.independents.length}<td>${porcentajeTotal}</td>`;
    tablaGlance.appendChild(datosRep);
    tablaGlance.appendChild(datosDem);
    tablaGlance.appendChild(datosId);
    tablaGlance.appendChild(datosTotal);
};

//CREO FUNCION PARA ORDENAR DE MAY A MEN cortando el 10%
function ordenarAscendente(arr, key){
    return arr.sort((a, b) => {
        if(a [key] < b [key]) {
            return -1;
        }
        if (a [key] > b [key]) {
            return 1;
        }
        return 0;
    }).filter(member => member.total_votes !== 0).slice(0, Math.ceil(arr.length * 0.1));
};
//CREO FUNCION PARA ORDENAR DE MEN A MAY cortando el 10%
function ordenarDescendente(arr, key){
    return arr.sort((a, b) => {
        if(a [key] > b [key]) {
            return -1;
        }
        if(a [key] < b [key]) {
            return 1;
        }
        return 0;
    }).slice(0, Math.ceil(data.results[0].members.length *0.1));
};


//ENGAGED
//Asigno a mostEgaged un arr ordenado de mayor a menor compromiso/ENGAGED
statistics.mostEngaged= ordenarAscendente(data.results[0].members, 'missed_votes_pct');
//Asigno a leastEgaged un arr ordenado de menor a mayor compromiso/ENGAGED
statistics.leastEngaged= ordenarDescendente(data.results[0].members, 'missed_votes_pct');

//CREO FUNCION TABLA ATTENDANCE
function crearTablaAttendance (arr, lugar){
    arr.forEach(member => {
        if(member.middle_name === null){
            member.middle_name= "";
        };
        let datos= document.createElement("tr");
        datos.innerHTML= `<td><a href="${member.url}">${member.first_name} ${member.middle_name} ${member.last_name}</a></td><td>${member.missed_votes}</td><td>${member.missed_votes_pct}</td>`;
        lugar.appendChild(datos);
    })
};

//CREO TABLAS ENGAGED
if (window.location.pathname === '/attendance_house.html' || window.location.pathname === '/attendance_senate.html'){
    //CAPTURO ELEMENTO DEL DOM
    let tablaLeast= document.getElementById('least-engaged');
    let tablaMost= document.getElementById('most-engaged');
    
    crearTablaAttendance(statistics.leastEngaged, tablaLeast);
    crearTablaAttendance(statistics.mostEngaged, tablaMost);

    crearTablaGlance();
};

//LOYAL
//Asigno a mostLoyal un arr ordenado de mayor a menor leatad
statistics.mostLoyal= ordenarDescendente(data.results[0].members, 'votes_with_party_pct');
//Asigno a leastLoyal un arr ordenado de menor a mayor leatad
statistics.leastLoyal= ordenarAscendente(data.results[0].members, 'votes_with_party_pct');

//CREO FUNCION TABLA LOYALTY
function crearTablaLoyalty(arr, lugar){
    arr.forEach(member => {
        if(member.middle_name === null){
            member.middle_name= "";
        };
        let datos= document.createElement("tr");
        datos.innerHTML= `<td><a href="${member.url}">${member.first_name} ${member.middle_name} ${member.last_name}</a></td><td>${Math.ceil(member.total_votes * member.votes_with_party_pct / 100)}</td><td>${member.votes_with_party_pct}</td>`;
        lugar.appendChild(datos);
    });
};


//estoy preguntando la ubicacion/ruta de acceso esta esto dentro del if 
if (window.location.pathname === '/partyLoyalty_house.html' || window.location.pathname === '/partyLoyalty_senate.html'){
    //CAPTURO ELEMENTO DEL DOM
    let tablaLeastLoyal= document.getElementById('least-loyal');
    let tablaMostLoyal= document.getElementById('most-loyal');
    
    crearTablaLoyalty(statistics.leastLoyal, tablaLeastLoyal);
    crearTablaLoyalty(statistics.mostLoyal, tablaMostLoyal);

    crearTablaGlance();
};
