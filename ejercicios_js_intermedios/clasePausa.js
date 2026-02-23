class Pausa {
    constructor(horaInicio, horaFin, usuario) {
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.usuario = usuario;
    }
    saludarPausa() {
        console.log("-------------------------------------------------")
        console.log(`Hola ${this.usuario} bienvenido a la plataforma`)
    }
    visualizarPausa() {
        console.log(`Hora de inicio: ${this.horaInicio}, Hora de fin: ${this.horaFin}`)
        console.log("Disfrute su pausa activa, puede:")
        console.log("- Tomar un café")
        console.log("- Estirar las piernas")
        console.log("- Salir a tomar aire")
        console.log("-------------------------------------------------")

        let Pausa1 = new Pausa("14:00", "15:00", "Maricielo");
        let Pausa2 = new Pausa("14:00", "15:00", "Camila");
        Pausa1.saludarPausa();
        Pausa1.visualizarPausa();
        Pausa2.saludarPausa();
        Pausa2.visualizarPausa();
    }

}
