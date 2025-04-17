



class Todo{
    constructor(tarea){
        this.id = new Date().getTime()
        this.tarea = tarea
        this.completado = false 
    } 


    static fromJson(obj) {
        const temp = new Todo(obj.tarea);
        
        temp.id         = obj.id;
        temp.completado = obj.completado;
        temp.creado     = obj.creado;

        return temp;
    }   
}

class TodoList{

    constructor(){
        this.todos = []
    }

    nuevoTodo(todo){
       this.todos.push(todo) 
       this.guardarLocalStorage()
    }

    eliminarTodo(id){
        this.todos = this.todos.filter(todo => todo.id != id)
        this.guardarLocalStorage()
    }

    actualizarTodo(id, nuevaTarea){
        this.todos = this.todos.map(todo => 
            todo.id == id ? { ...todo, tarea: nuevaTarea} : todo
        )

        this.guardarLocalStorage()
    }

    
     marcarCompletado(id) {
        this.todos = this.todos.map(todo => 
            todo.id == id ? { ...todo, completado: !todo.completado} : todo
        )

        this.guardarLocalStorage()
    }
        

    guardarLocalStorage(){
        localStorage.setItem('todo', JSON.stringify(this.todos))
    }


    cargarLocalStore(){
        this.todos = (localStorage.getItem('todo') ? JSON.parse(localStorage.getItem('todo')) : [])
        this.todos = this.todos.map(obj => Todo.fromJson(obj)) //convierte los objetos recuperados a un objeto TODO
    }

}


//Instancia del todoList
const todoList = new TodoList()


let editarTodoid = null


//Submit
const handleSubmit = (e)=>{
    e.preventDefault()

    const todoText = e.target.querySelector('.formulario-input').value.trim() 

    if(!todoText) return

    //Se crea un todo con los atributos (id, completado, tarea)
    const todo = new Todo(todoText)
    
    //Se guarda en la lista de todo
    todoList.nuevoTodo(todo)
    
    //console.log(todoList.todos)

    //vuelve a renderizar los todoslist
    renderizarTodosList()

    //resetea el formulario
    e.target.reset()
}

//HTML de los todos
const elementosTablaHTML = (todo)=>{

    const bodyTable = document.querySelector('.lista-tabla tbody')


    const tr = document.createElement('tr')
    
    tr.dataset.id = todo.id


    if(editarTodoid == todo.id){

        tr.innerHTML = `<td><input type="text" class="editar-todo-input" value="${todo.tarea}"></td>
                        <td>
                            <button class="boton-guardar-cambios">Guardar</button>
                            <button class="boton-cancelar">Cancelar</button>
                        </td>`

    }else{

        tr.innerHTML = `<td class="descripcion-todo ${todo.completado ? 'completado' : ''}">${todo.tarea}</td>
                        <td>
                            ${!todo.completado ? '<button class="boton-actualizar">Actualizar</button>' : '' }
                            <button class="boton-eliminar">Eliminar</button>
                        </td>`
    }

    bodyTable.append(tr)         
}  


//Renderizar los todos 
const renderizarTodosList = ()=>{

     // Limpiar tabla antes de renderizar
     document.querySelector('.lista-tabla tbody').innerHTML = '';

   //Carga los todos del localstorage
    todoList.cargarLocalStore() 
     
    //renderiza los todos
    todoList.todos.map(todo => elementosTablaHTML(todo))

    
}

renderizarTodosList()



//delegacion de eventos al contenedor padre
document.querySelector('.lista-tabla tbody').addEventListener('click', (e)=>{

    const tr = e.target.closest('tr');  //Se obtiene el contenedor padre que contiene al boton  
    const id = tr.dataset.id;          //se obtiene el id
    
    //Boton Actualizar todo
    if(e.target.classList.contains('boton-actualizar')){
        editarTodoid = id;
        renderizarTodosList();
    }


    //Boton Eliminar todo
    if(e.target.classList.contains('boton-eliminar')){
        
        todoList.eliminarTodo(id)

        renderizarTodosList()
    }


    //Boton Guardar Cambios
    if(e.target.classList.contains('boton-guardar-cambios')){

        //obtiene la tarea
        const input = tr.querySelector('input.editar-todo-input')
        const nuevaTarea = input.value.trim()

        
        if(nuevaTarea){
    
            todoList.actualizarTodo(id, nuevaTarea)
            
            editarTodoid = null

            renderizarTodosList()

        }
    }


    //Boton cancelar
    if(e.target.classList.contains('boton-cancelar')){
        editarTodoid = null

        renderizarTodosList()
    }


    // Tarea completado
    if(e.target.classList.contains('descripcion-todo')){
        todoList.marcarCompletado(id)

        e.target.classList.toggle('completado')
        
        renderizarTodosList()
    }



})
