
# ![Logo](logotipo2.png)

Event2All é uma planejador de casamentos e festas que ajuda a organizar os custos de produção e organização, 
assim como a lista de convidados e listas de afazeres. O sistema conta ainda com controle de acesso de usuário 
para que os dados deste fiquem seguros, dando a possibilidade de criar varios eventos por usuário e adicionar outros
usuários para edição de um evento existente.

## 📋 Pré-requisitos

Este projeto necessita de alguns passos para ser testado corretamente, conforme descrito abaixo:
    0. Caso opte por usar Docker para rodar o projeto, pule todos os passos a seguir e veja as instruções no tópico "Docker".
    Neste caso, você precisará ter o docker instalado na sua máquina.
    1. Banco de Dados Mysql instalado e configurado no ambiente a ser testado.
    2. Uma framework client para testes de API. Recomendado ( Insomnia ), para interação com a API.
    3. Um editor de texto, para alteração do arquivo de conexão com o Banco de Dados ( Recomendado VSCODE).

## 🔧 Configurando o servidor

    1. Criar um banco de dados vazio no MySql com o nome event2all.
    2. Acessar via terminal a pasta raiz do projeto e executar o comando "npm i" 
    para instalar todas as dependências do projeto.
    3. Criar e editar o arquivo .env baseado no arquivo .envMODEL editando
    as inforções entre aspas para que correspondam às configurções do seu 
    banco de dados recém criado assim como a porta desejada do servidor e salvar.
    4. Rodar o comando "npm run dev".

## 🔧 Docker:
    Você pode optar por rodar a API através de um container docker também. Para isso basta acessar a pasta raiz do projeto
    e rodar o comando "docker-compose up". Neste caso, a API está configurada para rodar na porta "3000". Você pode alterar a porta
    editando o arquivo "docker-compose.yaml" que se encontra na pasta raiz.

## 📦 Documentação da API
#### Para consumo da API por Swagger
[Link do Swagger](https://app.swaggerhub.com/apis/DANILOJPFREITAS_1/Event2All/1.0.0)

 ## ✒️ Autores

Refatorado inteiramente por [Giordano Cassini](https://github.com/giordanocassini)

*⌨️ com ❤️ por [Amanda Hammes](https://github.com/amandahammes/)<br/>
*⌨️ com ❤️ por [Danilo Freitas](https://github.com/danilojpfreitas)<br/>
*⌨️ com ❤️ por [Fabi Boniolo](https://github.com/Fabi-Boniolo)<br/>
*⌨️ com ❤️ por [Fabrício Teixeira](https://github.com/FabriciodSTeixeira)<br/>
*⌨️ com ❤️ por [Giordano Cassini](https://github.com/giordanocassini)<br/>
*⌨️ com ❤️ por [Victor Franco](https://github.com/VictorF05)<br/>
