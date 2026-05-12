// =========================================
// SCRIPT.JS — E-Lixo Landing Page
// Funcionalidades:
// 1. Animação de fade-in ao rolar a página
// 2. Contador de números animado
// 3. Calculadora de impacto ambiental
// =========================================


// =========================================
// 1. FADE-IN AO ROLAR A PÁGINA
// Usa IntersectionObserver para detectar
// quando um elemento entra na tela e
// adiciona a classe "visivel" nele.
// =========================================

// Seleciona todos os elementos com classe fade-in
const elementosFade = document.querySelectorAll('.fade-in');

// Cria um observer que "observa" cada elemento
const observerFade = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    // Se o elemento está visível na tela
    if (entry.isIntersecting) {
      entry.target.classList.add('visivel');
      // Para de observar depois que já apareceu
      observerFade.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15 // Aparece quando 15% do elemento estiver visível
});

// Começa a observar cada elemento
elementosFade.forEach(function(el) {
  observerFade.observe(el);
});


// =========================================
// 2. CONTADOR DE NÚMEROS ANIMADO
// Pega os elementos com data-target e
// anima o número subindo do zero até
// o valor final.
// =========================================

const contadores = document.querySelectorAll('.stat-number');

const observerContador = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      const el = entry.target;
      const alvo = parseInt(el.getAttribute('data-target'));
      const duracao = 2000; // 2 segundos de animação
      const passos = 60;    // 60 atualizações (60fps)
      const intervalo = duracao / passos;
      const incremento = alvo / passos;
      let atual = 0;

      const timer = setInterval(function() {
        atual += incremento;
        if (atual >= alvo) {
          el.textContent = alvo.toLocaleString('pt-BR');
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(atual).toLocaleString('pt-BR');
        }
      }, intervalo);

      observerContador.unobserve(el);
    }
  });
}, {
  threshold: 0.5
});

contadores.forEach(function(el) {
  observerContador.observe(el);
});


// =========================================
// 3. CALCULADORA DE IMPACTO
// Cada eletrônico tem um valor de
// "litros de água contaminada" estimado.
// O usuário escolhe a quantidade e clica
// em calcular.
// =========================================

// Quantidade de cada item (começa em zero)
const quantidades = {
  celular:   0,
  notebook:  0,
  tv:        0,
  geladeira: 0,
  ar:        0,
  pilha:     0
};

// Impacto estimado em litros de água por unidade
// (valores baseados em estudos ambientais)
const impactoPorItem = {
  celular:   40000,  // 40.000 litros por celular
  notebook:  100000, // 100.000 litros por notebook
  tv:        80000,  // 80.000 litros por TV
  geladeira: 200000, // 200.000 litros por geladeira
  ar:        250000, // 250.000 litros por ar-condicionado
  pilha:     5000    // 5.000 litros por pilha/bateria
};

// Nomes legíveis para o resultado
const nomesItem = {
  celular:   'celular(is)',
  notebook:  'notebook(s)/computador(es)',
  tv:        'TV(s)',
  geladeira: 'geladeira(s)',
  ar:        'ar(es)-condicionado(s)',
  pilha:     'pilha(s)/bateria(s)'
};

// Função chamada pelos botões + e −
function alterarQtd(item, delta) {
  quantidades[item] += delta;

  // Não deixa ir abaixo de zero
  if (quantidades[item] < 0) {
    quantidades[item] = 0;
  }

  // Atualiza o número na tela
  document.getElementById(item).textContent = quantidades[item];
}

// Função chamada pelo botão "Calcular"
function calcular() {
  let totalLitros = 0;
  let itensUsados = [];

  // Soma o impacto de cada item
  for (const item in quantidades) {
    const qtd = quantidades[item];
    if (qtd > 0) {
      totalLitros += qtd * impactoPorItem[item];
      itensUsados.push(qtd + ' ' + nomesItem[item]);
    }
  }

  const resultado = document.getElementById('resultado');
  const texto = document.getElementById('resultado-texto');

  // Se o usuário não selecionou nada
  if (totalLitros === 0) {
    resultado.style.display = 'block';
    texto.textContent = 'Você não selecionou nenhum eletrônico. Adicione a quantidade de aparelhos que tem em casa!';
    return;
  }

  // Monta o texto do resultado
  const itensTexto = itensUsados.join(', ');
  const litrosFormatado = totalLitros.toLocaleString('pt-BR');

  texto.textContent =
    'Com ' + itensTexto + ', o descarte incorreto pode contaminar até ' +
    litrosFormatado + ' litros de água — ' +
    equivalenteAgua(totalLitros) + '.';

  // Mostra o bloco de resultado com animação
  resultado.style.display = 'block';

  // Rola suavemente até o resultado
  resultado.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Função auxiliar: converte litros em algo mais visual
function equivalenteAgua(litros) {
  if (litros >= 1000000) {
    return 'o suficiente para encher ' + Math.round(litros / 1000000) + ' piscina(s) olímpica(s)';
  } else if (litros >= 10000) {
    return 'o equivalente a ' + Math.round(litros / 1000) + ' mil garrafas de água';
  } else {
    return 'o equivalente a ' + Math.round(litros / 1.5) + ' garrafas de água';
  }
}