
let formulario = []
let cuota


const handlesubmit = (e)=>{
    e.preventDefault()

    const cliente = e.target.querySelector('#nombre').value.trim()
    const prestamo = parseFloat(e.target.querySelector('#prestamo').value.trim())
    const tipoPrestomo = e.target.querySelector('#tipo-prestamo').value.trim()
    const plazo = Number(e.target.querySelector('#Plazo').value.trim()) 
    const tasa = parseFloat(e.target.querySelector('#Tasa').value.trim())
    const fecha = e.target.querySelector('#fecha').value.trim()

    //---------------Validaciones----------------------------

    let isValid = true


    // Limpiar errores anteriores
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');


    if (!cliente) {
        showError('nombre', 'El nombre es obligatorio');
        isValid = false;
    }

    if (!prestamo) {
        showError('prestamo', 'El monto de prestamo es obligatorio');
        isValid = false;
    }

    if (!tipoPrestomo) {
        showError('tipo-prestamo', 'El tipo de prestamo es obligatorio');
        isValid = false;
    }

    if (!plazo) {
        showError('Plazo', 'El plazo es obligatorio');
        isValid = false;
    }

    
    if (plazo > 60) {
        showError('Plazo', 'El plazo debe ser menor o igual a 60 meses');
        isValid = false;
    }

    if (!tasa) {
        showError('Tasa', 'La tasa es obligatorio');
        isValid = false;
    }

    if (!fecha) {
        showError('fecha', 'La fecha es obligatorio');
        isValid = false;
    }


    if (isNaN(prestamo)) {
        showError('prestamo', "El monto no es un número válido");
        isValid = false;
    }


    if (isNaN(plazo)) {
        showError('Plazo', "El plazo no es un número válido");
        isValid = false;
    }

    if (isNaN(tasa)) {
        showError('Tasa', "La tasa no es un número válido");
        isValid = false;
    }


    if (isNaN(Date.parse(fecha))) {
        showError('fecha', "La fecha no es válida");
        isValid = false;
    }



    if(!isValid)   return 

    //--------------------------------------------
    
    const fechaIngreso = new Date(fecha);

    // Calculando el plan de pagos
    formulario = calculandoPlanDePagos({ prestamo, plazo, tasa, fechaIngreso})

    //Renderizando la tabla con los resultados del plan de pagos
    renderizarTabla({cliente, tipoPrestomo, prestamo, tasa, plazo})
}


// Función para mostrar errores
function showError(fieldName, message) {
    const errorElement = document.querySelector(`#${fieldName}-error`);
    if (errorElement) errorElement.textContent = message;
}


 const calculandoPlanDePagos = ({ prestamo, plazo, tasa, fechaIngreso})=>{

    const arrayPlanDePagos = []              // Un array vacío donde se almacenarán los detalles de cada cuota
    
    // Convierte la tasa anual a una tasa mensual
    const tasaMensual = tasa / 100 / 12;    

    //Fórmula para calcular la cuota fija mensual
    cuota = ((prestamo * tasaMensual * Math.pow(1 + tasaMensual, plazo)) / (Math.pow(1 + tasaMensual, plazo) - 1)).toFixed(2)

    let saldoPendiente = prestamo;
    
    for(let i = 0; i < plazo; i++){

        //-----------1. Calculo de Fecha de pago -----------------------------
        //Calcula la fecha de pago sumando i + 1 meses a la fecha inicial (fechaIngreso)


        const fechaPago = new Date(fechaIngreso);
        fechaPago.setMonth(fechaIngreso.getMonth() + i + 1);

        // Formateando la fecha de pago como "DD/MM/YYYY"
        const dia = fechaPago.getDate().toString().padStart(2, '0');
        const mes = (fechaPago.getMonth() + 1).toString().padStart(2, '0');
        const ano = fechaPago.getFullYear();

        // Fecha de pago formateada como DD/MM/YYYY.
        const fechaFormateada = `${dia}/${mes}/${ano}`;



        //------------2. Calculo de interes y amortizacion-----------------------

        let interesMensual;         // Interes mensual a pagar en la cuota,  se calculan como el saldo pendiente multiplicado por la tasa mensual (saldoPendiente * tasaMensual)
        let capitalAmortizacion;    // Capital amortizado en la cuota, se calcula restando el interes mensual de la cuota total (cuota - interesMensual)


        //Ultima cuota: Asegurarse de que el saldo pendiente se reduzca exactamente a 0 al final del préstamo.
        if (i === plazo - 1) {
            // Última cuota: ajuste para que el saldo sea exactamente 0
            capitalAmortizacion = saldoPendiente;
            interesMensual = cuota - capitalAmortizacion;
       
       //Cuotas normales: Calcular los intereses y el capital amortizado para cuotas normales
        } else { 
            interesMensual = saldoPendiente * tasaMensual;
            capitalAmortizacion = cuota - interesMensual;
        }

        // Actualiza el saldo pendiente restando el capital amortizado
        saldoPendiente -= capitalAmortizacion;

        // Redondear los valores a 2 decimales
        interesMensual = Number(interesMensual.toFixed(2));
        capitalAmortizacion = Number(capitalAmortizacion.toFixed(2));
        saldoPendiente = Number(saldoPendiente.toFixed(2));




        //---------3. Almacenar los detalles de la cuota en el array-----
        arrayPlanDePagos.push({
            numeroCuota: i + 1,
            fechaPago: fechaFormateada,
            capitalAmortizado: capitalAmortizacion,
            interesMensual: interesMensual,
            cuotaTotal: cuota,
            saldoPendiente: saldoPendiente
        });


    }

    return arrayPlanDePagos
 }


 const renderizarTabla = ({cliente, tipoPrestomo, prestamo, tasa, plazo})=>{
    
    const container = document.querySelector('#resultado-tabla');
  
    container.innerHTML = ''; // Limpiar contenido previo


     const div = document.createElement('div')

     const columnas = ["N° Cuota", "Fecha de Pago", "Capital Amortizado (L)", "Interés Mensual (L)", "Cuota Total (L)", "Saldo Pendiente (L)"];

     const html = 
     `<section class='contenedor-resultado-tabla'>
           <h2 class='titulo-resultado'>Resultado del Prestamo para: ${cliente}</h2> 
            <br>
            <div class='resumen'>
                <p><span class='negrita'>Tipo de Prestamo:</span> ${tipoPrestomo}</p>
                <p><span class='negrita'>Monto Solicitado:</span> L. ${prestamo.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <p><span class='negrita'>Plazo:</span> ${plazo} meses</p>
                <p><span class='negrita'>Tasa Anual:</span> ${tasa}%</p>
            </div>

           
            <table border="1" class='tabla'>
                <caption class='titulo-tabla'>Plan de Pagos Detallado</caption>
                <thead>
                    <tr> ${ columnas.map(col =>`<th>${col}</th>`).join('') }</tr>
                </thead>
                <tbody>
                    ${formulario.map(fila =>
                        ` <tr>
                              <td>${fila.numeroCuota}</td>
                              <td>${fila.fechaPago}</td>  
                              <td>${fila.capitalAmortizado.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td>${fila.interesMensual.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td>${fila.cuotaTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                              <td>${fila.saldoPendiente.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          </tr>    
                        `
                    ).join('')}
                </tbody>
            </table>
     </section>`



     div.innerHTML = html
     container.appendChild(div) // Insertar el contenido en el contenedor

 }