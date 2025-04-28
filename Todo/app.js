class Todo{
    constructor(tarea){
        this.id = new Date().getTime()
        this.tarea = tarea
        this.completado = false
    }

    //convierte los objetos en un objeto todo
    static fromJson(obj){
        const tarea = new Todo(obj.tarea)

        tarea.id = obj.id
        tarea.completado = obj.completado

        return tarea
    }
}

class ListTodo{
    constructor(tarea){
        this.todo = []
    }

    //crea nuevo todo y lo guarda en el localstorage
    nuevoTodo(tarea){
        this.todo.push(tarea)
        this.guardarLocalStorage()
    }

    //eliminar todo y lo guarda en el localstorage
    eliminarTodo(id){
        this.todo = this.todo.filter(element => element.id != id)
        this.guardarLocalStorage()
    }

    //actualiza el todo y lo guarda en el localstorage
    actualizarTodo(tarea, id){
        this.todo = this.todo.map(element => element.id == id ? { ...element, tarea: tarea} : element)
        this.guardarLocalStorage()
    }


    marcarCompletado(id){
        this.todo = this.todo.map(element => element.id == id ? {...element, completado: !element.completado} : element)
        this.guardarLocalStorage()
    }

    //guardar el localstorage
    guardarLocalStorage(){
        localStorage.setItem('todo', JSON.stringify(this.todo))
    }


    //carga los todos del localstorage y los convierte en un objeto todo
    cargarLocalStorage(){
        this.todo = localStorage.getItem('todo') ? JSON.parse(localStorage.getItem('todo')) : []
        this.todo = this.todo.map(element => Todo.fromJson(element))
    }
}



//Se crea la lista de todos
const listTodo = new ListTodo()

let editarTodoId



//Submit
const handleSubmit = (e)=>{
   e.preventDefault()

    const tarea = e.target.querySelector('.formulario-input').value.trim()

    if(!tarea) return

    //Se crea el todo
    const todo = new Todo(tarea)

    //Se agrega a la lista
    listTodo.nuevoTodo(todo)

    //console.log(listTodo)

    renderizarTodos()

    e.target.reset()
}




//Renderizacion dinamica de los todos en el DOM
const elementosTablaHMTL = (todo)=>{
    let html

    const tablaBody = document.querySelector('.lista-todo tbody')

    const tr = document.createElement('tr')

    tr.dataset.id = todo.id


    if(editarTodoId == todo.id){
         
       html = `<td class="descripcion-todo"><input type='text'class='editar-todo-input' value=${todo.tarea}></td>
               <td>
                    <button class="boton-guardar-cambios">Guardar</button>
                    <button class="boton-cancelar">Cancelar</button>
               </td>` 
    }else{
        
        html = `<td class="descripcion-todo ${todo.completado ? 'completado' : ''}">${todo.tarea}</td>
                <td>
                    ${!todo.completado ? '<button class="boton-actualizar">Actualizar</button>' : ''}
                    <button class="boton-eliminar">Borrar</button>
                </td>`
    }

   tr.innerHTML = html 


   tablaBody.append(tr)

}



//Carga los Todos y los renderiza en el DOM
const renderizarTodos = ()=>{

    //Limpia la tabla
    document.querySelector('.lista-todo tbody').innerHTML = ''

    //carga los todos del localstorage
    listTodo.cargarLocalStorage()


    //renderiza los todos
    listTodo.todo.map((todo) => elementosTablaHMTL(todo))


}

renderizarTodos()



//Eventos de la lista TODO
document.querySelector('.lista-todo tbody').addEventListener('click', (e)=>{

    //console.log(e.target)
    
    const tr = e.target.closest('tr')
    const id = tr.dataset.id
       

    //Boton actualizar todo
    if(e.target.classList.contains('boton-actualizar')){
        editarTodoId = id

        renderizarTodos()
    }


    
    //Boton eliminar todo
    if(e.target.classList.contains('boton-eliminar')){
        listTodo.eliminarTodo(id)

        renderizarTodos()
    }


    //Boton cancelar todo
    if(e.target.classList.contains('boton-cancelar')){
        
        editarTodoId = null

        renderizarTodos()
    }


    //Boton guardar cambios todo
    if(e.target.classList.contains('boton-guardar-cambios')){
       
        const input = document.querySelector('.editar-todo-input')
        const tarea = input.value.trim()
            
        
        listTodo.actualizarTodo(tarea, id)


        editarTodoId = null

        renderizarTodos()
    }


    //Marcar como todo completado
    if(e.target.classList.contains('descripcion-todo')){
        
        listTodo.marcarCompletado(id)

        renderizarTodos()
    }



})