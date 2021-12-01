const app = Vue.createApp({
    data(){
        return {
            members: [],
            democrats: [],
            republicans: [],
            independents: [],
            averageVotesWithPartyDemocrats: 0,
            averageVotesWithPartyRepublicans: 0,
            averageVotesWithPartyIndependents: 0,
            averageTotal: 0,
            mostEngaged: [],
            leastEngaged: [],
            mostLoyal: [],
            leastLoyal: [],
            parties: [],            
            state: ""
        }
    },
    created(){
        chambers= document.title.includes('Senate') ? 'senate' : 'house',
        endpoint= `https://api.propublica.org/congress/v1/113/${chambers}/members.json`,
        init= {
            headers: {
                'X-API-Key': 'MCSTLqjnZKJoH9oonTYGgQq4ejqTWGi0WJT6oZ8q'
            }
        },
        fetch(endpoint, init)
            .then(res => res.json())
            .then(data => {
                this.members= data.results[0].members
                this.arrPartido(this.members)
                this.arrAverage()
                this.mostAndLeast()
            })
    },
    methods: {
        arrPartido(arr){
            this.democrats= arr.filter(member => member.party === "D");
            this.republicans= arr.filter(member => member.party === "R");
            this.independents= arr.filter(member => member.party === "ID");
        },
        porcentajesPromedio(arr) {
            let sumaPorcentajes= 0;
            for (i=0; i < arr.length; i++) {
                sumaPorcentajes= sumaPorcentajes + arr[i].votes_with_party_pct
            };
            return porcentajePromedio= (sumaPorcentajes / arr.length).toFixed(2);
        },
        promedioNaN(funcion){
            if(isNaN(funcion)){
                return '-';
            } else {
                return funcion
            };
        },
        arrAverage(){
            this.averageVotesWithPartyDemocrats= this.porcentajesPromedio(this.democrats);
            this.averageVotesWithPartyRepublicans= this.porcentajesPromedio(this.republicans);
            this.averageVotesWithPartyIndependents= this.promedioNaN(this.porcentajesPromedio(this.independents));
            this.averageTotal= this.porcentajesPromedio(this.members);
        },
        ordenarAscendente(arr, key){
            return arr.sort((a, b) => {
                if(a [key] < b [key]) {
                    return -1;
                }
                if (a [key] > b [key]) {
                    return 1;
                }
                return 0;
            }).filter(member => member.total_votes !== 0).slice(0, Math.ceil(arr.length * 0.1));
        },
        ordenarDescendente(arr, key){
            return arr.sort((a, b) => {
                if(a [key] > b [key]) {
                    return -1;
                }
                if(a [key] < b [key]) {
                    return 1;
                }
                return 0;
            }).slice(0, Math.ceil(this.members.length *0.1));
        },
        mostAndLeast(){
            this.mostEngaged= this.ordenarAscendente(this.members, 'missed_votes_pct');
            this.leastEngaged= this.ordenarDescendente(this.members, 'missed_votes_pct');
            this.mostLoyal= this.ordenarDescendente(this.members, 'votes_with_party_pct');
            this.leastLoyal= this.ordenarAscendente(this.members, 'votes_with_party_pct');
        }
    },
    computed: {
        filtros(){
            let auxArr= []
            if(this.parties.length === 0 && this.state === ""){
                auxArr= [...this.members]
                return auxArr
            }
            if(this.parties.length !== 0 && this.state === ""){
                auxArr= this.members.filter(member => this.parties.includes(member.party))
                return auxArr
            }
            if(this.parties.length === 0 && this.state !== ""){
                auxArr= this.members.filter(member => member.state === this.state)
                return auxArr
            }
            if(this.parties.length !== 0 && this.state !== ""){
                auxArr= this.members.filter(member => this.parties.includes(member.party) && member.state === this.state)
                return auxArr
            }
        }
    }
});

app.mount("#app")