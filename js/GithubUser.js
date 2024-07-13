export class GithubUser {
  static search(username){
    const endpoint = `https://api.github.com/users/${username}`;

    // return fetch(endpoint)
    //   .then(data => data.json())
    //   .then(({login, name, public_repos, followers}) => ({
    //     login,
    //     name,
    //     public_repos,
    //     followers
    //   }));

    /*
    fetch = Evento assíncrono que retorna uma PROMESSA
      - 1º () = pega um arquivo/url
      - 2º .then = Função que retorna o conteúdo do arquivo lido
      - 3º .then = Função que executa a lógico com o conteúdo lido e como será retornado
    */
   return fetch(endpoint)
   .then(function(data){
    return data.json();
   })
   .then(function(dataJson){
      const retorno = {
        login: dataJson.login,
        name: dataJson.name,
        public_repos: dataJson.public_repos,
        followers: dataJson.followers
      };

      return retorno;
   });
  }
}