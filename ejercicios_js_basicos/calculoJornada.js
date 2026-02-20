function calcularJornada(horaEntrada, horaSalida, pausasEnMinutos) {
  let totalMinutos = (horaSalida - horaEntrada) * 60 - pausasEnMinutos;
  let horas = Math.floor(totalMinutos / 60);
  let minutos = totalMinutos % 60;
  return `Tiempo trabajado: ${horas}h ${minutos}min`;
}

console.log(calcularJornada(8, 17, 45)); // Tiempo trabajado: 8h 15min
