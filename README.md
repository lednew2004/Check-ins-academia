# 💪 API de check-ins em academias baseada em geolocalização. Desenvolvida com Node.js, TypeScript e SOLID, permitindo que usuários encontrem academias próximas (10km) e realizem check-ins validados por regras de proximidade e tempo.

# RFs (Requisitos funcionais)

- [x] Deve ser possivel se cadastrar;
- [x] Deve ser possivel se autenticar;
- [x] Deve ser possivel obter o perfil de um usuario logado
- [x] Deve ser possivel obter o número de check-ins realizados pelo usuario logado;
- [x] Deve ser possivel o usuário obter seu histórico de check-ins;
- [x] Deve ser possivel o usuário buscar academias proximas (até 10km);
- [x] Deve ser possivel o usuário buscar academias pelo nome;
- [x] Deve ser possivel o usuário realizar check-in em uma academia;
- [x] Deve ser possivel validar o check-in de um usuário;
- [x] Deve ser possivel cadastrar uma academia;

# RNs (Regras de negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer 2 check-ins no mesmo dia;
- [x] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [x] O check-in só pode ser validado até 20 minutos após criado;
- [x] O check-in só pode ser validado por administradores;
- [x] A academia só pode ser cadastrada por administradores;

# RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas as listas de dados precisam estar paginadas com 20 itens por página;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);

#### 🛠️ Tecnologias

Runtime: Node.js

Linguagem: TypeScript

ORM: Prisma

Banco de Dados: PostgreSQL & Redis (opcional para refresh tokens)

Localização: Cálculos matemáticos de distância (Haversine formula)

Testes: Vitest (Testes Unitários e E2E)

Autenticação: JWT com RBAC (Role-Based Access Control)

🗺️ Regras de Geolocalização
Destaque o uso da matemática no backend. Você pode adicionar uma nota técnica:

"A aplicação utiliza a fórmula de Haversine para calcular a distância entre o usuário e a academia, garantindo que o check-in só seja permitido em um raio de 100 metros."

🔒 Níveis de Acesso (RBAC)
Explique que a API possui diferentes permissões:

Membro: Busca academias, faz check-in e vê histórico.

Admin: Cadastra academias e valida check-ins de terceiros.

🚀 Como executar
git clone ...

npm install

docker-compose up -d

npm run start:dev
