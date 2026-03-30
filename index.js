// function validarSenha(event) {
//       event.preventDefault(); 
//     let senha = document.getElementById("senha").value;
//     let csenha = document.getElementById("csenha");

//     if (senha !== csenha.value) {
        
//         csenha.setCustomValidity("As senhas não coincidem");
//         csenha.reportValidity();
//     } else {
//         csenha.setCustomValidity("");
//     }
// }

document.addEventListener("DOMContentLoaded", function (event) {
    
    const form = document.getElementById("formCadastro");
    const senha = document.getElementById("senha");
    const csenha = document.getElementById("csenha");

 
      event.preventDefault(); 
  

    if (senha !== csenha.value) {
        
        csenha.setCustomValidity("As senhas não coincidem");
        csenha.reportValidity();
    } else {
        csenha.setCustomValidity("");
    }


});