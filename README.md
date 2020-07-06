# Serviço de Agendamento

Responsável pelo gerenciamento de agendas dos atendentes. É o conjunto de pontas que permite o cadastro e autorização das agendas dos atendentes, aos usuários reservar um dos horários disponíveis ou propor um horário de atendimento diferente dos oferecidos.

## Configuração adicional

Este serviço precisa ser configurado com um arquivo de credenciais. Este arquivo de credenciais contém as informações que permitem ao sistema acessar e alterar as agendas dos atendentes.

A configuração depende de um projeto ativo no [Google Cloud Platform](https://cloud.google.com/).

O passo a passo para obter as credenciais pode ser encontrado em:

https://developers.google.com/calendar/auth

Note que, no passo 3 do tutorial acima, que é a configuração da tela de consentimento, é necessário solicitar as seguintes permissões:

|Scope | Meaning |
|------|:--------|
|https://www.googleapis.com/auth/calendar|read/write access to Calendars|
|https://www.googleapis.com/auth/calendar.events|read/write access to Events|


A partir daí, na tela de [credenciais do Google API's](ttps://console.developers.google.com/apis/credentials), basta selecionar o ID do cliente OAuth2/0 criado e baixar o arquivo JSON com as informações.

Essas informações JSON devem ser salvas no arquivo "credentials.json" na raiz do repositório.

Exemplo de um arquivo gerado corretamente:

```
conteúdo do credentials.json:

{
    "installed": {
        "client_id": "**********************.apps.googleusercontent.com",
        "project_id" :"project-id-*******",
        "auth_uri" :"https://accounts.google.com/o/oauth2/auth",
        "token_uri" :"https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url" :"https://www.googleapis.com/oauth2/v1/certs",
        "client_secret" :"**********************",
        "redirect_uris": [
            "urn:ietf:wg:oauth:2.0:oob",
            "http://localhost/"
        ]
    }
}
```