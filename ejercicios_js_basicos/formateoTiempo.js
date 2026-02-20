
function formatearTiempo(minutos) {
  let horas = Math.floor(minutos / 60);
  let mins = minutos % 60;
  return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

console.log(formatearTiempo(90));  // 01:30
console.log(formatearTiempo(480)); // 08:00
