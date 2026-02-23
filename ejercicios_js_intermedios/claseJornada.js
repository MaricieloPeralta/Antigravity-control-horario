class Jornada {
    constructor(fecha, horaInicio, horaFin, usuario) {
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.usuario = usuario;
    }
    saludarJornada() {
        console.log(`Hola ${this.usuario} bienvenido a la plataforma`)
        console.log(`La fecha es: ${this.fecha}, inicia a las ${this.horaInicio} y termina a las ${this.horaFin}`)
    }
    visualizarJornada() {
        console.log("Sus datos:")
        console.log(`Fecha: ${this.fecha}, Hora de inicio: ${this.horaInicio}, Hora de fin: ${this.horaFin}`)
    }

}

let jornada1 = new Jornada("2026-01-01", "08:00", "17:00", "Maricielo");
let jornada2 = new Jornada("2026-01-02", "09:00", "18:00", "Camila");
jornada1.saludarJornada();
jornada1.visualizarJornada();
jornada2.saludarJornada();
jornada2.visualizarJornada();
