document.addEventListener("DOMContentLoaded", () => {
  const textoElemento = document.getElementById("princesasTexto");
  const textoOriginal = textoElemento.innerHTML;
  textoElemento.innerHTML = "";

  let animado = false;

  // Função para escrever o texto
  function escreverTexto() {
    if (animado) return;
    animado = true;

    let index = 0;
    const intervalo = setInterval(() => {
      textoElemento.innerHTML = textoOriginal.substring(0, index);
      index++;
      if (index > textoOriginal.length) clearInterval(intervalo);
    }, 40); // velocidade da escrita (ms)
  }

  // Observa quando a seção entra na tela
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        escreverTexto();
      }
    });
  }, { threshold: 0.2 });

  observer.observe(textoElemento);
});

// Contador de pensamentos
let count = 0;
const counterElement = document.getElementById("thought-counter");

setInterval(() => {
  count++;
  counterElement.textContent = count.toLocaleString("pt-BR");
}, 1300);
