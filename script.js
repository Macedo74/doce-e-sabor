// ==========================================
// 1. DADOS DO ESTABELECIMENTO
// ==========================================

const estabelecimento = {
  nome: "Doce & Sabor",

  // Coloque o telefone com código do país + DDD + número.
  // Exemplo: 5511999999999
  whatsapp: "5541998274698",

  pix: {
    // Exemplos de tipo: email, telefone, cpf, cnpj ou chave aleatória.
    tipo: "telefone",
    chave: "+5541998274698",

    // Nome do titular que aparece no cadastro da chave PIX.
    titular: "Valmir Macedo",

    // Cidade do titular, sem acentos, preferencialmente.
    cidade: "SAO PAULO",

    banco: "Nubank"
  }
};


// ==========================================
// 2. CADASTRO DOS PRODUTOS
// ==========================================

const produtos = [
  {
    id: 1,
    nome: "Brigadeiro Gourmet",
    descricao: "Brigadeiro artesanal com chocolate granulado.",
    preco: 4.50,
    categoria: "doces",
    imagem: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    nome: "Brownie de Chocolate",
    descricao: "Brownie macio com muito chocolate.",
    preco: 8.00,
    categoria: "doces",
    imagem: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    nome: "Coxinha de Frango",
    descricao: "Massa crocante com recheio cremoso de frango.",
    preco: 7.00,
    categoria: "salgados",
    imagem: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
  },
  {
  id: 4,
  nome: "Pão de Queijo",
  descricao: "Pão de queijo quentinho e saboroso.",
  preco: 5.00,
  categoria: "salgados",
  imagem: "imagens/pao-de-queijo.jpg"
},
  {
    id: 5,
    nome: "Bolo de Chocolate",
    descricao: "Fatia de bolo fofinho com cobertura de chocolate.",
    preco: 9.00,
    categoria: "bolos",
    imagem: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    nome: "Bolo de Morango",
    descricao: "Bolo com recheio cremoso e morangos.",
    preco: 10.00,
    categoria: "bolos",
    imagem: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80"
  }
];


// ==========================================
// 3. ELEMENTOS DA PÁGINA E CARRINHO
// ==========================================

const listaProdutos = document.getElementById("listaProdutos");
const itensCarrinho = document.getElementById("itensCarrinho");
const valorTotal = document.getElementById("valorTotal");
const quantidadeCarrinho = document.getElementById("quantidadeCarrinho");
const campoBusca = document.getElementById("campoBusca");
const mensagemVazia = document.getElementById("mensagemVazia");

const qrcodeElemento = document.getElementById("qrcode");
const chavePixElemento = document.getElementById("chavePix");
const titularPixElemento = document.getElementById("titularPix");
const bancoPixElemento = document.getElementById("bancoPix");
const copiarPixBotao = document.getElementById("copiarPix");
const copiarCodigoPixBotao = document.getElementById("copiarCodigoPix");
const finalizarPedidoBotao = document.getElementById("finalizarPedido");

let carrinho = [];
let categoriaSelecionada = "todos";
let codigoPixAtual = "";


// ==========================================
// 4. FUNÇÕES AUXILIARES
// ==========================================

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}


// ==========================================
// 5. MOSTRAR PRODUTOS
// ==========================================

function mostrarProdutos() {
  const busca = normalizarTexto(campoBusca.value.trim());

  const produtosFiltrados = produtos.filter(produto => {
    const correspondeCategoria =
      categoriaSelecionada === "todos" ||
      produto.categoria === categoriaSelecionada;

    const correspondeBusca =
      normalizarTexto(produto.nome).includes(busca) ||
      normalizarTexto(produto.descricao).includes(busca);

    return correspondeCategoria && correspondeBusca;
  });

  listaProdutos.innerHTML = "";

  mensagemVazia.hidden = produtosFiltrados.length > 0;

  produtosFiltrados.forEach(produto => {
    const card = document.createElement("article");
    card.className = "produto";

    const imagem = document.createElement("img");
    imagem.src = produto.imagem;
    imagem.alt = produto.nome;
    imagem.loading = "lazy";

    const informacoes = document.createElement("div");
    informacoes.className = "produto-info";

    const nome = document.createElement("h3");
    nome.textContent = produto.nome;

    const descricao = document.createElement("p");
    descricao.textContent = produto.descricao;

    const rodape = document.createElement("div");
    rodape.className = "produto-rodape";

    const preco = document.createElement("span");
    preco.className = "preco";
    preco.textContent = formatarMoeda(produto.preco);

    const botao = document.createElement("button");
    botao.className = "botao-adicionar";
    botao.textContent = "Adicionar";
    botao.type = "button";
    botao.addEventListener("click", () => adicionarAoCarrinho(produto.id));

    rodape.append(preco, botao);
    informacoes.append(nome, descricao, rodape);
    card.append(imagem, informacoes);

    listaProdutos.appendChild(card);
  });
}


// ==========================================
// 6. FILTROS E BUSCA
// ==========================================

document.querySelectorAll(".filtro").forEach(botao => {
  botao.addEventListener("click", () => {
    document.querySelectorAll(".filtro").forEach(item => {
      item.classList.remove("ativo");
    });

    botao.classList.add("ativo");
    categoriaSelecionada = botao.dataset.categoria;

    mostrarProdutos();
  });
});

campoBusca.addEventListener("input", mostrarProdutos);


// ==========================================
// 7. CARRINHO DE COMPRAS
// ==========================================

function adicionarAoCarrinho(id) {
  const produto = produtos.find(item => item.id === id);
  const itemExistente = carrinho.find(item => item.id === id);

  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({
      ...produto,
      quantidade: 1
    });
  }

  atualizarCarrinho();
}

function alterarQuantidade(id, alteracao) {
  const item = carrinho.find(produto => produto.id === id);

  if (!item) return;

  item.quantidade += alteracao;

  if (item.quantidade <= 0) {
    carrinho = carrinho.filter(produto => produto.id !== id);
  }

  atualizarCarrinho();
}

function calcularTotal() {
  return carrinho.reduce((total, item) => {
    return total + item.preco * item.quantidade;
  }, 0);
}

function atualizarCarrinho() {
  itensCarrinho.innerHTML = "";

  if (carrinho.length === 0) {
    itensCarrinho.innerHTML =
      '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
  } else {
    carrinho.forEach(item => {
      const linha = document.createElement("div");
      linha.className = "item-carrinho";

      const informacoes = document.createElement("div");

      const nome = document.createElement("div");
      nome.className = "item-nome";
      nome.textContent = item.nome;

      const preco = document.createElement("div");
      preco.className = "item-preco";
      preco.textContent =
        `${formatarMoeda(item.preco)} cada`;

      informacoes.append(nome, preco);

      const controles = document.createElement("div");
      controles.className = "controles-quantidade";

      const diminuir = document.createElement("button");
      diminuir.type = "button";
      diminuir.textContent = "−";
      diminuir.setAttribute("aria-label", `Diminuir ${item.nome}`);
      diminuir.addEventListener("click", () => {
        alterarQuantidade(item.id, -1);
      });

      const quantidade = document.createElement("span");
      quantidade.textContent = item.quantidade;

      const aumentar = document.createElement("button");
      aumentar.type = "button";
      aumentar.textContent = "+";
      aumentar.setAttribute("aria-label", `Aumentar ${item.nome}`);
      aumentar.addEventListener("click", () => {
        alterarQuantidade(item.id, 1);
      });

      controles.append(diminuir, quantidade, aumentar);
      linha.append(informacoes, controles);

      itensCarrinho.appendChild(linha);
    });
  }

  const total = calcularTotal();
  const quantidade = carrinho.reduce((soma, item) => {
    return soma + item.quantidade;
  }, 0);

  valorTotal.textContent = formatarMoeda(total);
  quantidadeCarrinho.textContent = quantidade;

  atualizarPix(total);
}



// ==========================================
// 8. GERAÇÃO DO CÓDIGO PIX COPIA E COLA
// ==========================================

function campoPix(id, valor) {
  const conteudo = String(valor);
  const tamanho = new TextEncoder().encode(conteudo).length;

  if (tamanho > 99) {
    throw new Error(`O campo PIX ${id} excedeu o tamanho permitido.`);
  }

  return id + String(tamanho).padStart(2, "0") + conteudo;
}

function calcularCRC16(texto) {
  let crc = 0xFFFF;

  for (let i = 0; i < texto.length; i++) {
    crc ^= texto.charCodeAt(i) << 8;

    for (let bit = 0; bit < 8; bit++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }

      crc &= 0xFFFF;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function montarCodigoPix(valor) {
  const pix = estabelecimento.pix;

  const chave = String(pix.chave || "").trim();

  const titular = String(pix.titular || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();

  const cidade = String(pix.cidade || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();

  const valorNumerico = Number(valor);

  if (!chave || !titular || !cidade) {
    throw new Error("Confira a chave PIX, o titular e a cidade.");
  }

  if (!Number.isFinite(valorNumerico) || valorNumerico <= 0) {
    throw new Error("O valor do PIX é inválido.");
  }

  if (new TextEncoder().encode(titular).length > 25) {
    throw new Error("O nome do titular ultrapassa 25 caracteres.");
  }

  if (new TextEncoder().encode(cidade).length > 15) {
    throw new Error("O nome da cidade ultrapassa 15 caracteres.");
  }

  // Informações da conta PIX
  const dadosConta =
    campoPix("00", "br.gov.bcb.pix") +
    campoPix("01", chave);

  const contaPix = campoPix("26", dadosConta);

  // Valor com duas casas decimais
  const valorFormatado = valorNumerico.toFixed(2);

  // Montagem do BR Code estático
  let payload =
    campoPix("00", "01") +
    campoPix("01", "11") +
    contaPix +
    campoPix("52", "0000") +
    campoPix("53", "986") +
    campoPix("54", valorFormatado) +
    campoPix("58", "BR") +
    campoPix("59", titular) +
    campoPix("60", cidade) +
    campoPix("62", campoPix("05", "***")) +
    "6304";

  const crc = calcularCRC16(payload);

  return payload + crc;
}


// ==========================================
// 9. ATUALIZAR E MOSTRAR O QR CODE PIX
// ==========================================

function atualizarPix(total) {
  chavePixElemento.textContent = estabelecimento.pix.chave;
  titularPixElemento.textContent = estabelecimento.pix.titular;
  bancoPixElemento.textContent = estabelecimento.pix.banco;

  qrcodeElemento.innerHTML = "";
  codigoPixAtual = "";

  copiarCodigoPixBotao.disabled = true;

  if (total <= 0) {
    qrcodeElemento.textContent =
      "Adicione produtos ao carrinho para gerar o QR Code.";

    document.getElementById("legendaPix").textContent =
      "O QR Code será atualizado com o valor do seu pedido.";

    return;
  }

  try {
    codigoPixAtual = montarCodigoPix(total);

    if (typeof QRCode === "undefined") {
      throw new Error("A biblioteca de QR Code não foi carregada.");
    }

    new QRCode(qrcodeElemento, {
      text: codigoPixAtual,
      width: 190,
      height: 190,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });

    document.getElementById("legendaPix").textContent =
      `QR Code PIX gerado para o valor de ${formatarMoeda(total)}.`;

    copiarCodigoPixBotao.disabled = false;

  } catch (erro) {
    console.error(erro);

    qrcodeElemento.textContent =
      "Não foi possível gerar o QR Code. Confira os dados PIX e tente novamente.";

    document.getElementById("legendaPix").textContent =
      "Verifique as informações de pagamento.";
  }
}


// ==========================================
// 10. COPIAR CHAVE E CÓDIGO PIX
// ==========================================

async function copiarTexto(texto, mensagem) {
  try {
    await navigator.clipboard.writeText(texto);
    alert(mensagem);
  } catch (erro) {
    alert("Não foi possível copiar automaticamente. Tente novamente ou copie manualmente.");
    console.error(erro);
  }
}

copiarPixBotao.addEventListener("click", () => {
  copiarTexto(
    estabelecimento.pix.chave,
    "Chave PIX copiada!"
  );
});

copiarCodigoPixBotao.addEventListener("click", () => {
  if (!codigoPixAtual) return;

  copiarTexto(
    codigoPixAtual,
    "Código PIX copia e cola copiado!"
  );
});


// ==========================================
// 11. FINALIZAR PEDIDO PELO WHATSAPP
// ==========================================

finalizarPedidoBotao.addEventListener("click", () => {
  if (carrinho.length === 0) {
    alert("Adicione pelo menos um produto ao carrinho.");
    return;
  }

  const telefone = estabelecimento.whatsapp.replace(/\D/g, "");

  if (telefone.length < 12 || telefone.length > 13) {
  alert("Confira o número do WhatsApp com código do país, DDD e telefone.");
  return;
}

  const linhasPedido = carrinho.map(item => {
    const subtotal = item.preco * item.quantidade;

    return `${item.quantidade}x ${item.nome} - ${formatarMoeda(subtotal)}`;
  });

  const total = calcularTotal();

  const mensagem =
    `Olá! Gostaria de fazer este pedido:\n\n` +
    linhasPedido.join("\n") +
    `\n\nTotal: ${formatarMoeda(total)}` +
    `\n\nForma de pagamento: PIX` +
    `\n\nAguardo a confirmação.`;

  const url =
    `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank", "noopener,noreferrer");
});


// ==========================================
// 12. INICIALIZAÇÃO
// ==========================================

mostrarProdutos();
atualizarCarrinho();
