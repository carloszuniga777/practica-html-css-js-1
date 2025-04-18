const botones = document.querySelectorAll('.botones')
const display = document.querySelector('.display')

let primerValor = null, segundoValor = null;
let operador = null
let esperandoSegundoValor = false


botones.forEach(button =>{

    button.addEventListener('click', (e)=>{
        
        const tecla = e.target.value
        
        //Si los caracteres en el display superan los 13 no procede a menos que presione la tecla de reiniciar
        if( display.value.length > 13 && tecla !== 'reiniciar') return
        
        //Si hay un error no procede a menos que digite la tacla reiniciar
        if(display.value === 'Error' && tecla !== 'reiniciar') return

        //validacion si la tecla presionada es un  numero
        const esNumero = !isNaN(tecla)

        let resultado 


        //Manejo de numeros
        if(esNumero){

            // Si estamos esperando el segundo valor, limpiamos el display
            if (esperandoSegundoValor) {
                display.value = '';
                esperandoSegundoValor = false;
            }
            
            //Mostramos el valor en pantalla     
            (display.value === '0' && tecla !== '.') 
                    ?  display.value = tecla
                    :  display.value += tecla            
        }




        //Manejo de operadores (x, /, -, +)
        if(!esNumero && tecla !== '=' && tecla !== '.' ){
            
             //Si el usuario presiona por primera vez un operador, guarda el resultado en una variable temporal
            if(primerValor === null){
                primerValor = parseFloat(display.value)
            
            //Si el usuario anteriormete, ya habia presionado un operador, entonces realiza un recalculo 
            }else if(operador){

                 // Obtiene los valores en el display y es guardado en una variable temporal
                segundoValor = parseFloat(display.value)

                //Realiza el calculo
                 resultado = calcular(primerValor, segundoValor, operador)
                
                // Actualizamos el display con el resultado
                display.value = resultado;

                // Guardamos el resultado como el nuevo primer valor
                primerValor = resultado;
            }
            
            operador = tecla
            esperandoSegundoValor = true
        }


        

        //Manejo del boton "="
        if(tecla === '='){
            if(primerValor !== null && operador !== null){

                //obtenemos los valores del display
                segundoValor = parseFloat(display.value)

                //realizar el calculo
                resultado = calcular(primerValor, segundoValor, operador)

                //Mostramos el resultado en el display
                display.value = resultado

                //reiniciamos los valores para permitir nuevas operaciones
                reset()


            }
        }


        //Manejo del boton "."
      if(tecla === '.'){

        //Si el valor del display no hay .
        if(!display.value.includes('.')){
            
            if(display.value === '0'){
                  display.value = '0.'
            }else{
                display.value =  display.value + '.'
            }
        }
      }
      
      //Manejo de boton "C" reinicia los valores
      if(tecla === 'reiniciar'){
        display.value = 0
        reset()
      }

      //Borra el ultimo caracter   
      if(tecla ==='borrar'){
        display.value = display.value.slice(0, -1) || '0';
      }


    })
})


function reset(){
    primerValor = null
    segundoValor = null
    operador = null
    esperandoSegundoValor = null
}


function calcular(a, b, operador) {
    switch (operador) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case 'x':
            return a * b;
        case '/':
            return b !== 0 ? a / b : 'Error'; // Manejo de división por cero
        default:
            return b;
    }
}