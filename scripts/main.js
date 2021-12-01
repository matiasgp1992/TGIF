//CAPTURO ELEMENTOS DEL DOM
let filtros= document.getElementById('filtros');
let dropdownStates= document.getElementById('stateSelect');

//TRAIGO LA INFORMACION
let members= [];

let chambers= document.title.includes('Senate') ? 'senate' : 'house';
let endpoint= `https://api.propublica.org/congress/v1/113/${chambers}/members.json`;
let init = {
    headers: {
            'X-API-Key': 'MCSTLqjnZKJoH9oonTYGgQq4ejqTWGi0WJT6oZ8q'
    }
};

fetch(endpoint, init)
    .then(res => res.json())
    .then(data => {
        members= data.results[0].members
        pintarTabla(members, 'data');

        aplicarFiltros()

    });

//CREO EVENTO
filtros.addEventListener('change', (e) => {
    aplicarFiltros();
});

//CREO FUNCION PARA HACER LA TABLA
function pintarTabla (arr, donde){
    let tabla= document.getElementById(donde);
    tabla.innerHTML= "";
    arr.forEach(member => {
        if(member.middle_name === null){
            member.middle_name= "";
        };
        let datos= document.createElement("tr");
        datos.innerHTML= `<td><a href="${member.url}">${member.first_name} ${member.middle_name} ${member.last_name}</a></td><td>${member.party}</td><td>${member.state}</td><td>${member.seniority}</td><td>${member.votes_with_party_pct}%</td>`;
        tabla.appendChild(datos);
    });
};

//CREO FUNCIONES DE FILTRADO
function aplicarFiltros(){
    let checkboxes= filtros.querySelectorAll("[type='checkbox']");
    let checkeds= Array.from(checkboxes).filter(checkbox => checkbox.checked);
    let selectedParties = checkeds.map(checkbox => checkbox.value)
    let selectedState = dropdownStates.value;

    let todoFiltrado= filtradoPorEstadoYPartido(members, selectedState, selectedParties);
    let soloEstadoFiltrado= filtradoPorEsado(members, selectedState)
    if (checkeds.length === 0){
        return pintarTabla(soloEstadoFiltrado, 'data')
    } else {
        return pintarTabla(todoFiltrado, 'data');
    } 
};

function filtradoPorEstadoYPartido (arr, estado, partidos){
    let miembrosFiltrados= [];
    for(i= 0; i < arr.length; i++) {
        if(arr[i].state === estado || estado === "all"){
            if(partidos.includes(arr[i].party)){
                miembrosFiltrados.push(arr[i])
            }
        }
    }

    return miembrosFiltrados;
};

function filtradoPorEsado(arr, estado){
    let miembrosFiltrados= [];
    for(i= 0; i < arr.length; i++){
        if(arr[i].state === estado || estado === "all"){
            miembrosFiltrados.push(arr[i])
        }
    }
    return miembrosFiltrados;
};