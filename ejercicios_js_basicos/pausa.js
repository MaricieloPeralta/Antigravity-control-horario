let minutosTotales = 480; // 8 horas en minutos

function restarPausa(minutos) {
  minutosTotales -= minutos;
  return minutosTotales;
}

console.log(restarPausa(30)); // 450
console.log(restarPausa(15)); // 435
