import { GithubUser } from "./GithubUser.js";

export class Favorites {
  constructor(root){
    this.root = document.querySelector(root);
    this.load();

    // GithubUser.search('BrunnoCardoso').then(user => console.log(user));
  }

  load(){
    //Cria um Array que contenha Objeto dentro dele
    // this.entries = [
    //   {
    //     login: 'maykbrito',
    //     name: 'Mayk Brito',
    //     public_repos: '76',
    //     followers: '12000'
    //   },
    //   {
    //     login: 'diego3g',
    //     name: 'Diego Fernandes',
    //     public_repos: '80',
    //     followers: '12'
    //   },
    //   {
    //     login: 'BrunnoCardoso',
    //     name: 'Brunno Cardoso',
    //     public_repos: '10',
    //     followers: '20'
    //   }
    // ];

    const entries = JSON.parse(localStorage.getItem('@github-favorites:'));
    if(!entries){
      entries = [];
    }

    this.entries = entries;

    // console.log(this.entries);
  }

  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
  }

  /*
  Funções "async" definem que é uma função assíncrona, com isso posso usar o "await" ao invés de utilizar o ".then".
  Exemplo:
    GithubUser.search(username).then(user => {
      console.log(user);
    });
  */
  async add(username){
    try{
      const userExists = this.entries.find(entry => {
        if(entry.login === username){
          return true;
        }else{
          return false;
        }
      })
      
      if(userExists){
        throw new Error("Usuário já cadastrado!");
      }

      const user = await GithubUser.search(username);
  
      if(user.login === undefined){
        throw new Error("Usuário não encontrado!");
      }

      /*
        Quando usado o "[user, ...this.entries]" quer dizer que:
        Traz de volta o "this.entries" existente, espalhando o novo "user" no início da pilha.

        Funciona também usar o "this.entries.push(user);" porém estaria quebrando a mutualidade
      */
      this.entries = [user, ...this.entries];
      this.update();
      this.save();

    } catch(error){
      alert("-->" + error.message);
    }
  }

  delete(user){
    const filteredEntries = this.entries.filter(entry => {
      if(entry.login == user.login){
        return false;
      }else{
        return true;
      }
    });

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    //Responsável em unir (declarar) a classe que está estendendo
    super(root);

    this.tbody = this.root.querySelector('table tbody');
    this.update();
    this.onAdd();
  }

  onAdd(){
    const addButton = this.root.querySelector('.search button');

    addButton.onclick = () => {
      const input = this.root.querySelector('.search input');

      this.add(input.value);
    }
  }

  update() {
    this.removeAllTr();

    this.entries.forEach(user => {
      const row = this.createRow();

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
      row.querySelector('.user img').alt = `Imagem de ${user.name}`;
      row.querySelector('.user a').href = `https://github.com/${user.login}`;
      row.querySelector('.user p').textContent = user.name;
      row.querySelector('.user span').textContent = user.login;
      row.querySelector('.repositories').textContent = user.public_repos;
      row.querySelector('.followers').textContent = user.followers;

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm("Tem certeza que deseja excluir a linha?");
        if(isOk){
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
  }

  createRow(){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/maykbrito.png" alt="Imagem de Maykbrito">
        <a href="https://github.com/maykbrito" target="_blank ">
          <p>Mayk Brito</p>
          <span>maykbrito</span>
        </a>
      </td>
      <td class="repositories">76</td>
      <td class="followers">9589</td>
      <td>
        <button class="remove">&times;</button>
      </td>`;

      return tr;
  }

  removeAllTr(){
     //Transforma em ArrayLike, parecido com um Array herdando todas as funções
    this.tbody.querySelectorAll('tr').forEach(function(tr){
      tr.remove();
    });
  }
}