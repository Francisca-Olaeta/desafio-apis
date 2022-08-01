
const btn = document.querySelector(".btn");
let result = document.getElementById("result");
const currencyValue = document.getElementById("currencyValue");

/*Evento click para obtener resultado ------------------------------------------------------------------------------------------------------------- */
btn.addEventListener('click', () => {
    let clp = document.getElementById("inputCLP").value;
    let cod = document.getElementById("inputSelect").value;
    
    if(clp == ""){
        alert("Debes ingresar el monto en CLP")
    }else{
        getMonedas(clp, cod);
        renderChart(cod)
    }
})

/*Función para llamar al json ------------------------------------------------------------------------------------------------------------- */
async function getMonedas(clp, cod) {
  
    try {
        const res = await fetch(`https://mindicador.cl/api/${cod}`,)
        const data = await res.json()
     
        switch (cod){
            case 'dolar':
                if(data.codigo === cod){
                    result.innerHTML = `$${(clp/data.serie[0].valor).toFixed(2)} dólares`;
                    currencyValue.innerHTML = `${data.serie[0].valor.toLocaleString()}`;
                }
            break;
            case 'uf':
                if(data.codigo === cod){
                    result.innerHTML = `$${(clp/data.serie[0].valor).toFixed(2)} pesos`;
                    currencyValue.innerHTML = `${data.serie[0].valor.toLocaleString()}`;
                }
            break;
            case 'euro':
                if(data.codigo === cod){
                    result.innerHTML = `€${(clp/data.serie[0].valor).toFixed(2)} euros`;
                    currencyValue.innerHTML = `${data.serie[0].valor.toLocaleString()}`;
                }
            break;
            case 'utm':
                if(data.codigo === cod){
                    result.innerHTML = `$${(clp/data.serie[0].valor).toFixed(2)} pesos`;
                    currencyValue.innerHTML = `${data.serie[0].valor.toLocaleString()}`;
                }
            break;

        }
        }catch(error) {
            console.error(error);
          }
    }
    


/*Gráfico-------------------------------------------------------------------------------------------------------------------------------------------*/

async function renderChart(cod) {
    
    const res = await fetch(`https://mindicador.cl/api/${cod}/2022`,);
    const result = await res.json();

    let arrayLb = result.serie.slice(0,10).map((info)=>{
        return info.fecha.replace(/T04:00:00.000Z|T03:00:00.000Z/gi,'');
    })

    let arrayValor = result.serie.slice(0,10).map((info)=>{
        return info.valor;
    })
    
    const data = {
        labels: arrayLb.reverse(),
        datasets: [{
            borderColor: 'rgba(245, 40, 145)',
            pointRadius: 5,
            pointBackgroundColor: 'rgb(245, 40, 145)',
            fill: false,
            backgroundColor: 'rgb(245, 40, 145)',
            label: 'Valor moneda en los últimos 10 días ($)',
            data: arrayValor.reverse(),
        }]
    }

    const config = {
        type: 'line',
        data: data,
        options: {
            plugins: {
                legend: {
                    display: true,
                    labels: {color: 'white'}
                }
            },
            scales: {
                y: {
                    ticks: {color: 'white', beginAtZero: true},
                    grid: {color: 'rgba(255, 255, 255, .2)', borderColor: 'rgba(255, 255, 255, .2)'},
                },
                x: {
                    ticks: {color: 'white', beginAtZero: true},
                    grid: {display: false},
                }
            },
            title: {
                display: true,
                labels: {
                    color: 'white'
                }
        },
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                }, 
            }    
    }
}
/*Para destruir el gráfico y reusar el canvas----------------------------------------------------------------------------------------- */
    let chartStatus = Chart.getChart("myChart");
    if (chartStatus != undefined){
        chartStatus.destroy();
    }
    let chartDOM = document.getElementById("myChart");
    let myChart = new Chart(chartDOM, config);
}