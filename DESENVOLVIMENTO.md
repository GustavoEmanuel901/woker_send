# Registro do desenvolvimento

## Organização e execução do trabalho

Para facilitar o desenvolvimento, resolvi começar pelo backend e estruturar a aplicação com base nos princípios do SOLID.

No início, configurei um ambiente com Docker para reunir as dependências necessárias ao desenvolvimento e comecei a trabalhar com o Prisma como ORM.

Inicialmente, tinha definidos três casos de uso: criar um usuário, fazer o upload de um arquivo e extrair os dados do currículo. Também decidi adicionar uma rota para listar todos os usuários e facilitar o acompanhamento dos registros.

Em seguida, desenvolvi esses casos de uso e, ao final da implementação do backend, adicionei alguns testes.

Por fim, desenvolvi o frontend. Como já tinha alguns componentes prontos, esperava avançar mais rapidamente e corrigir eventuais problemas no backend enquanto testava a aplicação.


## Decisões técnicas

- Usar Docker para gerenciar as dependências e facilitar a configuração do ambiente.
- Implementar uma alternativa (fallback) para a extração de dados. Como a extração com IA apresentava falhas frequentes, quando ela não funciona, uma função baseada em expressões regulares (regex) é acionada.
- Usar o Prisma como ORM, pois eu já tinha experiência com essa ferramenta.
- Usar React com Vite e Node.js com Express pela simplicidade e pela agilidade no desenvolvimento.
- Não usar rotas no frontend e fazer a comunicação entre os componentes por meio do Context API, para simplificar a implementação.
- Usar o Amazon S3 para armazenar imagens, mantendo também a opção de armazenamento local para testes.
- Aplicar os princípios do SOLID no backend para reduzir o acoplamento entre os componentes.

## Uso de IA

Usei um assistente de IA integrado ao VS Code (Copilot SDK) para interpretar a solicitação.

Usei a IA para apoiar decisões de arquitetura, corrigir bugs, escrever testes e configurar dependências.

### Exemplos de uso

"Tenho este componente de Input pronto. Como posso adaptá-lo a este projeto?"

"Este componente Input está usando Tailwind. É possível migrá-lo para styled-components?"

"Pode gerar um schema do Prisma com base nas minhas entidades?"

"Se você precisasse implementar o upload de arquivos usando esta estrutura, como faria? Quais bibliotecas usaria, considerando que quero permitir o envio para o S3 e para o armazenamento local? Não altere o código; quero apenas sugestões."


## Correções, adaptações e descartes

A principal adaptação foi abandonar a ideia inicial de usar o LLaMA localmente para extrair os dados. O objetivo era simplificar a configuração e manter as dependências no ambiente local.

Como o LLaMA não funcionou corretamente, decidi substituí-lo pelo Gemini.

## Verificação

Adicionei testes ao backend e realizei testes manuais no frontend e na API usando o Insomnia.

## Tempo aproximado

Comecei este teste no sábado, às 16h, e terminei o desenvolvimento no domingo, às 15h.

## Dificuldades, limitações e melhorias futuras

- Adaptar componentes React que eu já tinha foi uma dificuldade inesperada.
- Adicionaria testes automatizados para o frontend.
- O uso da versão gratuita do Gemini é uma limitação, pois a extração ainda apresenta falhas.
- Criaria um pipeline de CI/CD para automatizar as verificações e a entrega da aplicação.
- Desenvolveria uma área administrativa para gerenciar as candidaturas.

