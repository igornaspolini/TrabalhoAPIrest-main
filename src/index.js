const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

// Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const routes = require('./routes'); // Isso carrega o index.js da pasta routes

// Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Projeto 01-Implementação de API',
      version: '1.0.0',
      description: `API para demonstração de Documentação API via Swagger.

        ### TD 01    
        Disciplina: DAII 2024.02 Turma 01  
        Equipe: Nicolas Cardoso, Igor Stéfano Naspolini e Luigi Macarini  
      `,
      license: {
        name: 'Licenciado para DAII',
      },
      contact: {
        name: 'André F Ruaro',
      },
        },
        servers: [
            {
              url: "http://localhost:3000/api/", 
              description: 'Development server',
            },
		  ],
	},
	apis: ["./src/routes/*.js"],
};

const specs = swaggerJsDoc(options);

app.use('/api', routes);
// Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


// Iniciar o servidor
app.listen(3000, function () {
  console.log('Aplicação executando na porta 3000!');
});
