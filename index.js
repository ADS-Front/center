document.addEventListener("DOMContentLoaded", function () {

  // ===== CADASTRO =====
  const formCadastro = document.getElementById("formCadastro");
//marcara de cep
const cepInput = document.getElementById("cep");

cepInput.addEventListener("input", async (e) => {
  let value = e.target.value;

  // Remove tudo que não for número
  value = value.replace(/\D/g, "").substring(0, 8);

  // Aplica máscara 00000-000
  if (value.length > 5) {
    value = value.replace(/(\d{5})(\d+)/, "$1-$2");
  }

  e.target.value = value;

  // Quando tiver 8 números (CEP completo)
  const cepLimpo = value.replace(/\D/g, "");
  if (cepLimpo.length === 8) {
    buscarCEP(cepLimpo);
  }
});

async function buscarCEP(cep) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      alert("CEP não encontrado!");
      return;
    }

    // Preenche os campos
    document.getElementById("rua").value = data.logradouro || "";
    document.getElementById("bairro").value = data.bairro || "";
    document.getElementById("cidade").value = data.localidade || "";
    document.getElementById("estado").value = data.uf || "";

  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
  }
}
//marcara de cpf
const cpfInput = document.getElementById("cpf");

cpfInput.addEventListener("input", (e) => {
  let value = e.target.value;

  // Remove tudo que não é número
  value = value.replace(/\D/g, "");

  // Limita a 11 dígitos
  value = value.substring(0, 11);

  // Aplica máscara: 000.000.000-00
  value = value
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  e.target.value = value;
});
//marcara de celular
const celInput = document.getElementById("cel");

celInput.addEventListener("input", (e) => {
  let value = e.target.value;

  // Remove tudo que não é número
  value = value.replace(/\D/g, "");

  // Limita a 11 dígitos (celular com DDD)
  value = value.substring(0, 11);

  // Aplica máscara (00) 00000-0000
  value = value
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");

  e.target.value = value;
});









  //validador de seha
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

// ===== SOLICITAÇÃO DE SERVIÇO =====
const formServico = document.getElementById("formServico");

if (formServico) {
  formServico.addEventListener("submit", function (e) {
    e.preventDefault();

    const servico = {
      titulo: document.getElementById("titulo").value,
      descricao: document.getElementById("descricao").value,
      cidade: document.getElementById("cidadeServico").value,
      contato: document.getElementById("contato").value,
      id: Date.now()
    };

    let lista = JSON.parse(localStorage.getItem("servicos")) || [];
    lista.push(servico);

    localStorage.setItem("servicos", JSON.stringify(lista));

    alert("Serviço publicado!");
    window.location.href = "mural.html";
  });
}


// ===== MURAL DE SERVIÇOS =====
const listaServicos = document.getElementById("listaServicos");

if (listaServicos) {
  const servicos = JSON.parse(localStorage.getItem("servicos")) || [];

  servicos.forEach(servico => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${servico.titulo}</h3>
      <p>${servico.descricao}</p>
      <p><strong>Cidade:</strong> ${servico.cidade}</p>
      <p><strong>Contato:</strong> ${servico.contato}</p>
      <button onclick="aceitarServico(${servico.id})">Aceitar</button>
    `;

    listaServicos.appendChild(card);
  });
}


// ===== ACEITAR SERVIÇO =====
function aceitarServico(id) {
  let servicos = JSON.parse(localStorage.getItem("servicos")) || [];

  servicos = servicos.filter(s => s.id !== id);

  localStorage.setItem("servicos", JSON.stringify(servicos));

  alert("Você aceitou o serviço!");
  location.reload();
}