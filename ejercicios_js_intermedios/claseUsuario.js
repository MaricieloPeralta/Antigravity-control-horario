class Usuario {
  constructor(id, nombre, email, rol) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.rol = rol; // 'empleado' o 'admin'
  }

  obtenerInfo() {
    return `Usuario: ${this.nombre} | Email: ${this.email} | Rol: ${this.rol}`;
  }

  esAdmin() {
    return this.rol === 'admin';
  }
}

const usuario1 = new Usuario(1, 'Camila Chavez', 'camila@correo.com', 'empleado');
console.log(usuario1.obtenerInfo());
console.log(usuario1.esAdmin()); 

const admin1 = new Usuario(2, 'Maricielo Abigail', 'maricielo@correo.com', 'admin');
console.log(admin1.obtenerInfo());
console.log(admin1.esAdmin()); 
