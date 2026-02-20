function validarEmail(email) {
  return email.includes('@') && email.includes('.');
}

console.log(validarEmail("usuario@correo.com")); // true
console.log(validarEmail("usuariocorreo.com"));  // false
