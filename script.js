// Função principal para buscar o CEP na api do ViaCEP
async function buscarCep(cep) {

    // Constroi a url da api com o CEP fornecido.
    const url = `https://viacep.com.br/ws/${cep}/json/`;


    //Tenta fazer a requisição e manipular a resposta
    try {

        //Faz a requisição http usando a função 'fetch'
        const response = await fetch(url);
        
        //Verifica se a requisição foi bem sucedida
        if (!response.ok) {
            throw new Error(`Erro de rede: ${response.status}`);
        }

        // Converte a resposta para um JSON
        const data = await response.json();

        // O ViaCEP retorna um objeto com a chave 'erro' se o CEP não for encontrado
        if (data.erro) {
            throw new Error('CEP não encontrado.');
        }

        // Retorna os dados de endereço se a busca for bem sucedida
        return data;

    } catch (error) {
        // registra o erro
        console.error('Erro ao buscar CEP:', error.message);
        
        // retorna null para indicar que a busca deu errado ou o CEP não existe
        return null;
    }
}

// função para preencher os campos do formulário
function preencherFormulario(data) {

    // Preenche o valor de cada campo do formulário com o dado correspondente
    // que veio da resposta da api do viacep
    document.getElementById('logradouro').value = data.logradouro || '';
    document.getElementById('bairro').value = data.bairro || '';
    document.getElementById('localidade').value = data.localidade || '';
    document.getElementById('uf').value = data.uf || '';
    document.getElementById('complemento').value = data.complemento || '';
}

// função para limpar os campos de endereço
function limparEndereco() {
    document.getElementById('logradouro').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('localidade').value = '';
    document.getElementById('uf').value = '';
    document.getElementById('complemento').value = '';
}

// função para mostrar ou ocultar o indicador de carregamento
function toggleLoading(show) {
    const loadingDiv = document.getElementById('loading');
    if (show) {
        loadingDiv.classList.remove('d-none'); // Remove a classe do Bootstrap que esconde o elemento
    } else {
        loadingDiv.classList.add('d-none'); // Adiciona a classe para esconder o elemento
    }
}

// função principal que orquestra a busca e o preenchimento
async function processarBusca() {

    // obtem o elemento de input do CEP
    const inputCep = document.getElementById('cep');
    
    // remove todos os caracteres não numéricos
    let cep = inputCep.value.replace(/\D/g, ''); 

    // limpa qualquer validação visual anterior do Bootstrap
    inputCep.classList.remove('is-invalid');
    
    // se o CEP tiver menos de 8 digitos não faz a busca
    if (cep.length !== 8) {
        limparEndereco();
        return;
    }

    toggleLoading(true); // mostra o indicador de carregamento

    const dados = await buscarCep(cep); // chama a função de busca assincrona

    toggleLoading(false); // pculta o indicador de carregamento

    // perifica se a busca retornou dados validos
    if (dados) {

        // preenche o formulário com os dados retornados
        preencherFormulario(dados);
    } else {

        // limpa os campos e marca o input como inválido
        limparEndereco();
        inputCep.classList.add('is-invalid'); // Adiciona a classe de erro do Bootstrap
    }
}


// Espera o documento carregar completamente para garantir que todos os elementos existam
document.addEventListener('DOMContentLoaded', () => {


    const inputCep = document.getElementById('cep');
    const form = document.getElementById('cepForm');
    
    // quando o campo CEP perde o foco processa a busca
    inputCep.addEventListener('blur', processarBusca);

    // efetua a busca quando o usuario aperta enter
    inputCep.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        processarBusca();
    }
})
    // Limpa a validação de erro quando o formulário é resetado
    form.addEventListener('reset', () => {
        inputCep.classList.remove('is-invalid')
        limparEndereco();
    })
})