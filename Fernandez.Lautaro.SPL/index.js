class Vehiculo{
    id=0;
    modelo="";
    anoFab= 1;
    velMax=1;


    constructor(id,modelo,anioFabricacion,velocidadMaxima)
    {
        this.id = id || -1;
        this.modelo = modelo || "modelo";
        if(anioFabricacion>1885 && anioFabricacion!=null)
        {
            this.anoFab = anioFabricacion;
        }else this.anoFab = 1;

        if(velocidadMaxima>0 && velocidadMaxima!=null)
        {
            this.velMax = velocidadMaxima;
        }else this.velMax = 1;

    }

    toString()
    {
        return 'ID: '+ this.id + '|Modelo: '+this.modelo + '|Año fabricacion: '+this.anoFab+ '|Velocidad Maxima: '+ this.velMax;
    }
}


class Aereo extends Vehiculo{
    altMax=1;
    autonomia=1;

    constructor(id,modelo,anioFabricacion,velocidadMaxima,alturaMaxima,autonomia)
    {
        super(id,modelo,anioFabricacion,velocidadMaxima);
        if(alturaMaxima>0 && alturaMaxima!=null)
        {
            this.altMax = alturaMaxima;
        }else this.altMax = 1;

        if(autonomia>0 && autonomia!=null)
        {
            this.autonomia = autonomia;
        }else this.autonomia = 1;
    }




    toString()
    {
        return super.toString() + `|Altura maxima: ${this.altMax}|Autonomia: ${this.autonomia}`;
    }

}

class Terrestre extends Vehiculo{
    cantPue = 1;
    cantRue = 1;

    constructor(id,modelo,anioFabricacion,velocidadMaxima,cantidadPuertas,cantidadRuedas)
    {
        super(id,modelo,anioFabricacion,velocidadMaxima);
        if(cantidadPuertas>0 && cantidadPuertas!=null)
        {
            this.cantPue = cantidadPuertas;
        }else this.cantPue = 1;

        if(cantidadRuedas>0 && cantidadRuedas!=null)
        {
            this.cantRue = cantidadRuedas;
        }else this.cantRue = 1;
    }

}
/////////// FIN CLASES

let txtId = document.getElementById("txtId");
let txtModelo = document.getElementById("txtModelo");
let txtAnioFab = document.getElementById("txtAnioFab");
let txtVelMax = document.getElementById("txtVelMax");
let SelectTipo = document.getElementById("SelectTipo");
let txtAM = document.getElementById("txtAM");
let txtAutonomia = document.getElementById("txtAutonomia");
let txtCantPue = document.getElementById("txtCantPue");
let txtCantRue = document.getElementById("txtCantRue");
const formTitulo = document.getElementById('titulo-abm');


const server = "http://localhost/vehiculoAereoTerrestre.php";

function statusSpinner(status)
{
    let spinner = document.getElementById("spinner");
    if(status)
    {   
        spinner.style.display = "";
    }else{
        spinner.style.display = "none";
    }
}

var arrayVehiculos = [];

statusSpinner(false);

function Inicializar(array)
{
    array.forEach(objeto => {
        if(objeto.hasOwnProperty("id") && objeto.hasOwnProperty("modelo") && objeto.hasOwnProperty("anoFab") && objeto.hasOwnProperty("velMax"))
        {
            if(objeto.hasOwnProperty("cantPue") && objeto.hasOwnProperty("cantRue"))
            {
                let ter = new Terrestre(objeto.id,objeto.modelo,objeto.anoFab,objeto.velMax,objeto.cantPue,objeto.cantRue);
                arrayVehiculos.push(ter);
            }

            if(objeto.hasOwnProperty("altMax") && objeto.hasOwnProperty("autonomia"))
            {
                let air = new Aereo(objeto.id,objeto.modelo,objeto.anoFab,objeto.velMax,objeto.altMax,objeto.autonomia);
                arrayVehiculos.push(air);
            }
        }
    });

    mostrarVehiculos(arrayVehiculos);
}



function peticionAlServer()
{
    statusSpinner(true);
    
    let consulta = fetch(server)
    .then(resp =>{

        if(resp.status == 200)
        {
            statusSpinner(false);
            resp.json().then(objJson=>{
                var cadena = objJson;

                Inicializar(cadena);
            })
        }

        
    })    

}
//desvinculacion de funcion submit

document.getElementById("FrmABM").addEventListener("submit",e=> {
    e.preventDefault();
    })

    document.getElementById("FrmDatos").addEventListener("submit",e=> {
        e.preventDefault();
        })
//

function validarIndex(index)
{
    let retorno = -1;  
    arrayVehiculos.forEach(vehiculo=>{
        if(vehiculo.id == index)
        { 
         retorno = index;
        }
    })

    return retorno;
}

function mostrarCorrespondiente()
{
    if(SelectTipo.value == "tAereo")
    {
        txtAM.style.display="";
        txtAutonomia.style.display="";
        txtCantPue.style.display="none";
        txtCantRue.style.display="none";
        

        
    }else if(SelectTipo.value == "tTerrestre")
    {
        txtCantPue.style.display="";
        txtCantRue.style.display="";
        txtAM.style.display="none";
        txtAutonomia.style.display="none";
        
    }

}

SelectTipo.addEventListener("change",mostrarCorrespondiente);


function mostrarYllenarABM(tagId)
{
    arrayVehiculos.forEach(el=>{

        if(el.id == tagId)
        {
            document.getElementById("FrmABM").style.display = "";
            txtId.value = el.id;
            txtModelo.value = el.modelo;
            txtAnioFab.value = el.anoFab;
            txtVelMax.value = el.velMax;
            if(el.hasOwnProperty("altMax"))
            {
                SelectTipo.value = "tAereo";
                mostrarCorrespondiente();
                txtAM.value = el.altMax;
                txtAutonomia.value = el.autonomia;
                
            }else{
                SelectTipo.value = "tTerrestre";
                mostrarCorrespondiente();
                txtCantPue.value = el.cantPue;
                txtCantRue.value = el.cantRue;
                //document.getElementById("txtKills").value = el.asesinatos;
            }

           
        }
    })
    
}

function DelOrModif(event)
{
    let rowId = event.target.parentNode.parentNode.id;
    
    let indexValido = validarIndex(rowId);
        
    

    if(indexValido != -1)
    {        
        formTitulo.innerText = event.target.value;
        
        document.getElementById("FrmDatos").style.display="none";
        
        mostrarYllenarABM(indexValido);
    }
}


function mostrarVehiculos(array)
{
    document.getElementById("vehiculo-container").innerHTML = "";
    array.forEach(el => {
        let tr = document.createElement("tr");
        tr.setAttribute("id",el.id);
        tr.classList.add("trVehiculos");
        tr.innerHTML = `
        <td>${el.id}</td>
        <td>${el.modelo}</td>
        <td>${el.anoFab}</td>
        <td>${el.velMax}</td>
        <td>${el.altMax || "N/A"}</td>
        <td>${el.autonomia || "N/A"}</td>
        <td>${el.cantPue || "N/A" }</td>
        <td>${el.cantRue || "N/A"}</td>
        `;    
        
        let botones = ["Modificar", "Eliminar"];
		botones.forEach(btnStr => {
			let input = document.createElement("input");
			input.type = "button";
			input.id = btnStr + el.id;
			input.value = btnStr;
            input.className = "btnTABLA";
			input.addEventListener('click', DelOrModif);

			celda = document.createElement("td");
			celda.appendChild(input);
			tr.appendChild(celda);
		});
        
        
        document.getElementById("vehiculo-container").appendChild(tr);
        
    })
}

function mostrarAereos(arrayVehiculos)
{

    document.getElementById("vehiculo-container").innerHTML = "";
    arrayVehiculos.forEach(el => {
        let tr = document.createElement("tr");

        if(el.hasOwnProperty("altMax")){
            tr.classList.add("trVehiculo");
            tr.setAttribute("id",el.id);
        tr.innerHTML = `
        <td>${el.id}</td>
        <td>${el.modelo}</td>
        <td>${el.anoFab}</td>
        <td>${el.velMax}</td>
        <td>${el.altMax || "-"}</td>
        <td>${el.autonomia || "-"}</td>
        <td>${el.cantPue || "-" }</td>
        <td>${el.cantRue || "-"}</td>
        
        `;

        let botones = ["Modificar", "Eliminar"];
		botones.forEach(btnStr => {
			let input = document.createElement("input");
			input.type = "button";
			input.id = btnStr + el.id;
			input.value = btnStr;
            input.className = "btnTABLA";
			input.addEventListener('click', DelOrModif);

			celda = document.createElement("td");
			celda.appendChild(input);
			tr.appendChild(celda);
		});

        document.getElementById("vehiculo-container").appendChild(tr);
        
        }

        
    })
}

function mostrarTerrestres(arrayVehiculos)
{

    document.getElementById("vehiculo-container").innerHTML = "";
    arrayVehiculos.forEach(el => {
        let tr = document.createElement("tr");

        if(el.hasOwnProperty("cantPue")){
            tr.classList.add("trVehiculos");
            tr.setAttribute("id",el.id);
        tr.innerHTML = `
        <td>${el.id}</td>
        <td>${el.modelo}</td>
        <td>${el.anoFab}</td>
        <td>${el.velMax}</td>
        <td>${el.altMax || "-"}</td>
        <td>${el.autonomia || "-"}</td>
        <td>${el.cantPue || "-" }</td>
        <td>${el.cantRue || "-"}</td>
        
        `;
            
        let botones = ["Modificar", "Eliminar"];
		botones.forEach(btnStr => {
			let input = document.createElement("input");
			input.type = "button";
			input.id = btnStr + el.id;
			input.value = btnStr;
            input.className = "btnTABLA";
			input.addEventListener('click', DelOrModif);

			celda = document.createElement("td");
			celda.appendChild(input);
			tr.appendChild(celda);
		});

        document.getElementById("vehiculo-container").appendChild(tr);
        //console.log(tr);
        }

        
    })
}

//EVALUA EL FILTRO Y MUESTRA SEGUN CORRESPONDA
function filtroCorrespondiente()
{
    if(document.getElementById("filtroTipo").value == "vTodos")
    {
        mostrarVehiculos(arrayVehiculos);
        

    }else if(document.getElementById("filtroTipo").value == "vAereo")
    {
        mostrarAereos(arrayVehiculos);
    }else if(document.getElementById("filtroTipo").value == "vTerrestre")
    {
        mostrarTerrestres(arrayVehiculos);
    }
}

document.getElementById("filtroTipo").addEventListener("change",filtroCorrespondiente);
//

peticionAlServer();

function initConfig()
{
    document.getElementById("FrmABM").style.display="none";
    document.getElementById("FrmDatos").style.display="";
}

function altaConfig(){
    document.getElementById("FrmABM").style.display="";
    document.getElementById("FrmDatos").style.display="none";
    txtAM.style.display="none";
    txtAutonomia.style.display="none";
    txtCantPue.style.display="none";
    txtCantRue.style.display="none";
    formTitulo.innerText = "Alta";
    
}

initConfig();

document.getElementById("btnCancelar").addEventListener("click",initConfig);

function darDeAlta(vehiculo)
{   
    statusSpinner(true);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(xhttp.readyState ==4)
        {
            if(xhttp.status == 200 )
            {
                console.log(xhttp.response);
                statusSpinner(false);
                vehiculo.id = JSON.parse(xhttp.response).id;
                arrayVehiculos.push(vehiculo); 
                initConfig();
                mostrarVehiculos(arrayVehiculos);
                
            }else{
                statusSpinner(false);
                initConfig();
                alert("error");   
            }
        }     
    };
    xhttp.open("PUT",server,true);
    xhttp.setRequestHeader('Content-Type' , 'application/json');
    xhttp.send(JSON.stringify(vehiculo));
}
document.getElementById("btnAceptar").addEventListener("click",function(){

    let id = parseInt(txtId.value);
    let modelo = txtModelo.value;
    let anoFab = parseInt(txtAnioFab.value);
    let velMax = parseInt(txtVelMax.value);
    let altMax = parseInt(txtAM.value);
    let auton = parseInt(txtAutonomia.value);
    let cantpue = parseInt(txtCantPue.value);
    let cantrue = parseInt(txtCantRue.value);

    

    if(formTitulo.innerText == "Alta")
    {
        if(SelectTipo.value == "tAereo")
        {
            let aereo = new Aereo(0,modelo,anoFab,velMax,altMax,auton);
            console.log(aereo);
            darDeAlta(aereo);
        }else if(SelectTipo.value = "tTerrestre")
        {
            let terrestre = new Terrestre(0,modelo,anoFab,velMax,cantpue,cantrue);
            console.log(terrestre);
            darDeAlta(terrestre);
        }
    }else if(formTitulo.innerText == "Modificar")
    {
        if(SelectTipo.value == "tAereo")
        {
            let aereo = new Aereo(id,modelo,anoFab,velMax,altMax,auton);
            Modificar(aereo);
            
        }else if(SelectTipo.value = "tTerrestre")
        {
            let terrestre = new Terrestre(id,modelo,anoFab,velMax,cantpue,cantrue);
            Modificar(terrestre);
        }
    }else if(formTitulo.innerText == "Eliminar")
    {
        if(SelectTipo.value == "tAereo")
        {
            let aereo = new Aereo(id,modelo,anoFab,velMax,altMax,auton);
            Eliminar(aereo);
            
        }else if(SelectTipo.value = "tTerrestre")
        {
            let terrestre = new Terrestre(id,modelo,anoFab,velMax,cantpue,cantrue);
            Eliminar(terrestre);
        }
    }

});

document.getElementById("btnAgregar").addEventListener("click", altaConfig);


async function Modificar(vehiculo) {
	
		statusSpinner(true);

        let consulta = await fetch(server,{
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers :{
                'Content-Type' : 'application/json'
            },
            redirect: "follow",
            referrerPolicy : "no-referrer",
            body: JSON.stringify(vehiculo)
    });
	
    let response = await consulta.text();

    if(consulta.status !=400)
    {
        vehiculo.id = parseInt(txtId.value);
        vehiculo.modelo = txtModelo.value;
        vehiculo.anoFab = parseInt(txtAnioFab.value);
        vehiculo.velMax = parseInt(txtVelMax.value);
        vehiculo.altMax = parseInt(txtAM.value);
        vehiculo.autonomia = parseInt(txtAutonomia.value);
        vehiculo.cantPue = parseInt(txtCantPue.value);
        vehiculo.cantRue = parseInt(txtCantRue.value);
        let id = BuscarId(vehiculo.id);
        arrayVehiculos.splice(id, 1);

        arrayVehiculos.push(vehiculo);
        
        initConfig();
        mostrarVehiculos(arrayVehiculos);
        statusSpinner(false);

    }else{
        alert("ERROR AL MODIFICAR");
        statusSpinner(false);
    }

}

function BuscarId(id) {
	let index = -1;
	for (let i = 0; i < arrayVehiculos.length; i++) {
		let vehiculo = arrayVehiculos[i];
		if (vehiculo.id == id) {
			index = i;
			break;
		}
	}

	return index;
}


async function Eliminar(vehiculo) {
	let consulta = null;
	
		statusSpinner(true);
		consulta = await fetch(server, {
			method: "DELETE",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				'Content-Type': 'application/json'
			},
			redirect: "follow",
			referrerPolicy: "no-referrer",
			body: JSON.stringify(vehiculo)
		});

		statusSpinner(false);
		if (consulta.status == 200) {
			let index = BuscarId(vehiculo.id);
			arrayVehiculos.splice(index, 1);
            
			initConfig();
            mostrarVehiculos(arrayVehiculos);
		} else {
			alert("Hubo un problema con la baja!");
			initConfig();
		}
	
}