document.addEventListener("DOMContentLoaded", function () {

  // ===== CADASTRO =====
  const formCadastro = document.getElementById("formCadastro");

  if (formCadastro) {
    const senha = document.getElementById("senha");
    const csenha = document.getElementById("csenha");

    formCadastro.addEventListener("submit", function (event) {
      event.preventDefault();

      if (senha.value !== csenha.value) {
        csenha.setCustomValidity("As senhas não coincidem");
        csenha.reportValidity();
        return;
      }

      const email = document.getElementById("email").value;

      // salvar no navegador
      localStorage.setItem("usuario", email);
      localStorage.setItem("senha", senha.value);

      alert("Cadastro realizado com sucesso!");
      window.location.href = "login.html";
    });
  }

  // ===== LOGIN =====
  const formLogin = document.getElementById("formLogin");

  if (formLogin) {
    formLogin.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.querySelector("input[type='email']").value;
      const senha = document.querySelector("input[type='password']").value;

      const emailSalvo = localStorage.getItem("usuario");
      const senhaSalva = localStorage.getItem("senha");

      if (email === emailSalvo && senha === senhaSalva) {
        alert("Login realizado!");
        window.location.href = "index.html";
      } else {
        alert("Email ou senha inválidos");
      }
    });
  }

});