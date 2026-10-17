const { useState, useEffect, useRef } = React;

// Categorias, palavras e recursos do jogo.
const WORD_BANK = {
    Filmes: ["O Poderoso Chefão", "Titanic", "Avatar", "Star Wars", "Jurassic Park", "Matrix", "A Origem", "Forrest Gump", "O Rei Leão", "Vingadores", "Pulp Fiction", "Frozen", "O Cavaleiro das Trevas", "Harry Potter", "De Volta para o Futuro" /* Adicione mais palavras aqui */],
    Comida: ["Pizza", "Sushi", "Hambúrguer", "Tacos", "Macarrão", "Curry", "Bife", "Salada", "Sanduíche", "Sopa", "Frango Frito", "Lámen", "Burrito", "Panqueca", "Sorvete" /* Adicione mais palavras aqui */],
    Marcas: ["Apple", "Nike", "Coca-Cola", "Samsung", "McDonalds", "Toyota", "Disney", "Amazon", "Google", "Tesla", "Adidas", "Pepsi", "Starbucks", "Netflix", "Microsoft" /* Adicione mais palavras aqui */],
    Tecnologia: ["iPhone", "Notebook", "Drone", "Robô", "Bluetooth", "Wifi", "Teclado", "Mouse", "Monitor", "Câmera", "Fone de Ouvido", "Smartwatch", "Tablet", "Impressora", "Roteador" /* Adicione mais palavras aqui */],
    TV: ["Stranger Things", "Game of Thrones", "Breaking Bad", "The Office", "Friends", "Os Simpsons", "South Park", "Bob Esponja", "The Mandalorian", "The Crown", "Round 6", "Black Mirror" /* Adicione mais palavras aqui */],
    Profissões: ["Médico", "Professor", "Engenheiro", "Advogado", "Chef", "Piloto", "Bombeiro", "Policial", "Artista", "Músico", "Ator", "Escritor", "Cientista", "Programador", "Arquiteto" /* Adicione mais palavras aqui */],
    Mitologia: ["Zeus", "Thor", "Hércules", "Medusa", "Dragão", "Unicórnio", "Fênix", "Sereia", "Centauro", "Grifo", "Poseidon", "Hades", "Atena", "Apolo", "Odin" /* Adicione mais palavras aqui */],
    Esportes: ["Futebol", "Basquete", "Futebol Americano", "Tênis", "Golfe", "Vôlei", "Hóquei", "Boxe", "MMA", "Fórmula 1", "Natação", "Atletismo", "Ginástica", "Ciclismo", "Surfe" /* Adicione mais palavras aqui */],
    Lugares: ["Escola", "Hospital", "Biblioteca", "Aeroporto", "Parque", "Praia", "Floresta", "Montanha", "Deserto", "Cidade", "Museu", "Cinema", "Shopping", "Restaurante", "Hotel" /* Adicione mais palavras aqui */],
    Instrumentos: ["Violão", "Piano", "Bateria", "Violino", "Flauta", "Saxofone", "Trompete", "Violoncelo", "Harpa", "Clarinete", "Trombone", "Tuba", "Banjo", "Ukulele", "Acordeão" /* Adicione mais palavras aqui */],
    Heróis: ["Superman", "Batman", "Homem-Aranha", "Homem de Ferro", "Mulher Maravilha", "Thor", "Hulk", "Capitão América", "Pantera Negra", "Flash", "Aquaman", "Wolverine", "Deadpool" /* Adicione mais palavras aqui */],
    Animais: ["Leão", "Tigre", "Elefante", "Girafa", "Pinguim", "Golfinho", "Baleia", "Tubarão", "Águia", "Papagaio", "Cachorro", "Gato", "Hamster", "Cobra", "Urso" /* Adicione mais palavras aqui */],
    Países: ["EUA", "Canadá", "México", "Brasil", "Argentina", "Inglaterra", "França", "Alemanha", "Itália", "Espanha", "Rússia", "China", "Japão", "Índia", "Austrália" /* Adicione mais palavras aqui */],
    Videogames: ["Mario", "Zelda", "Pokemon", "Minecraft", "Fortnite", "Roblox", "Call of Duty", "GTA", "Halo", "God of War", "The Witcher", "Skyrim", "Fallout", "Overwatch", "League of Legends" /* Adicione mais palavras aqui */],
    Ciência: ["Átomo", "Molécula", "Célula", "DNA", "Gravidade", "Magnetismo", "Eletricidade", "Luz", "Som", "Calor", "Energia", "Força", "Planeta", "Estrela", "Galáxia" /* Adicione mais palavras aqui */],
    Roupas: ["Camisa", "Camiseta", "Calça", "Jeans", "Shorts", "Saia", "Vestido", "Terno", "Casaco", "Jaqueta", "Suéter", "Moletom", "Cachecol", "Luvas", "Chapéu" /* Adicione mais palavras aqui */],
    Casa: ["Mesa", "Cadeira", "Sofá", "Cama", "Mesa de Escritório", "Prateleira", "Armário", "Guarda-roupa", "Lâmpada", "Ventilador", "Aquecedor", "Ar Condicionado", "Geladeira", "Fogão", "Micro-ondas" /* Adicione mais palavras aqui */],
    Pessoas: ["Presidente", "Rei", "Rainha", "Atleta", "Celebridade", "Artista", "Músico", "Cientista", "Professor", "Estudante", "Criança", "Bebê", "Turista", "Policial", "Médico" /* Adicione mais palavras aqui */],
    "Figuras Históricas": ["Cleópatra", "Júlio César", "Alexandre o Grande", "Joana d'Arc", "Leonardo da Vinci", "William Shakespeare", "Isaac Newton", "George Washington", "Napoleão Bonaparte", "Albert Einstein" /* Adicione mais palavras aqui */],
    "Jogos de Tabuleiro": ["Xadrez", "Damas", "Monopoly", "Banco Imobiliário", "Catan", "Jenga", "Ludo", "Dominó", "Mahjong", "RPG", "Poker", "Uno", "Truco", "Detetive", "Imagem e Ação" /* Adicione mais palavras aqui */],
    "Pontos Turísticos": ["Torre Eiffel", "Estátua da Liberdade", "Muralha da China", "Pirâmides de Gizé", "Coliseu", "Taj Mahal", "Machu Picchu", "Cristo Redentor", "Big Ben", "Torre de Pisa" /* Adicione mais palavras aqui */],
    Música: ["Bohemian Rhapsody", "Smells Like Teen Spirit", "Billie Jean", "Stairway to Heaven", "Hey Jude", "Hotel California", "Shape of You", "Despacito", "Imagine", "Macarena" /* Adicione mais palavras aqui */],
    Escola: ["Lousa", "Giz", "Carteira", "Cadeira", "Mochila", "Lápis", "Caneta", "Borracha", "Régua", "Caderno", "Livro", "Dever de Casa", "Prova", "Nota", "Professor" /* Adicione mais palavras aqui */]
};

const CATEGORY_ICONS = {
    Filmes: "https://em-content.zobj.net/source/microsoft-teams/337/popcorn_1f37f.png",
    Comida: "https://em-content.zobj.net/source/microsoft-teams/363/hamburger_1f354.png",
    Marcas: "https://em-content.zobj.net/source/microsoft-teams/337/shopping-bags_1f6cd-fe0f.png",
    Tecnologia: "https://em-content.zobj.net/source/microsoft-teams/337/gear_2699-fe0f.png",
    TV: "https://em-content.zobj.net/source/microsoft-teams/337/television_1f4fa.png",
    Profissões: "https://em-content.zobj.net/source/microsoft-teams/337/briefcase_1f4bc.png",
    Mitologia: "https://em-content.zobj.net/source/microsoft-teams/337/dragon-face_1f432.png", 
    Esportes: "https://em-content.zobj.net/source/microsoft-teams/337/trophy_1f3c6.png",
    Lugares: "https://em-content.zobj.net/source/microsoft-teams/337/cityscape_1f3d9-fe0f.png",
    Instrumentos: "https://em-content.zobj.net/source/microsoft-teams/364/guitar_1f3b8.png",
    Heróis: "https://em-content.zobj.net/source/microsoft-teams/337/superhero_light-skin-tone_1f9b8-1f3fb_1f3fb.png",
    Animais: "https://em-content.zobj.net/source/microsoft-teams/337/dog-face_1f436.png",
    Países: "https://em-content.zobj.net/source/microsoft-teams/337/globe-showing-americas_1f30e.png",
    Videogames: "https://em-content.zobj.net/source/microsoft-teams/337/joystick_1f579-fe0f.png",
    Ciência: "https://em-content.zobj.net/source/microsoft-teams/363/scientist-light-skin-tone_1f9d1-1f3fb-200d-1f52c.png",
    Roupas: "https://em-content.zobj.net/source/microsoft-teams/337/t-shirt_1f455.png",
    Casa: "https://em-content.zobj.net/source/microsoft-teams/337/house_1f3e0.png",
    Pessoas: [
        "https://em-content.zobj.net/source/microsoft-teams/337/person_light-skin-tone_1f9d1-1f3fb_1f3fb.png",
        "https://em-content.zobj.net/source/microsoft-teams/337/old-man_light-skin-tone_1f474-1f3fb_1f3fb.png",
    ],
    "Figuras Históricas": "https://em-content.zobj.net/source/microsoft-teams/337/bust-in-silhouette_1f464.png",
    "Jogos de Tabuleiro": "https://em-content.zobj.net/source/microsoft-teams/337/game-die_1f3b2.png",
    "Pontos Turísticos": "https://em-content.zobj.net/source/microsoft-teams/337/statue-of-liberty_1f5fd.png",
    Música: "https://em-content.zobj.net/source/microsoft-teams/337/musical-notes_1f3b6.png",
    Escola: "https://em-content.zobj.net/source/microsoft-teams/337/woman-teacher-light-skin-tone_1f469-1f3fb-200d-1f3eb.png"
};

const AUDIO_URLS = {
    startMission: "https://www.dropbox.com/scl/fi/6mqqjkan6k1z9b3rqv19m/01HX9JKSR2BK842A7XV43SW8Z0.mp3?rlkey=j9bf35mocbr2rceiunaak8r7i&raw=1",
    startRandomMission: "https://www.dropbox.com/scl/fi/9gl6f796t9szuen6f4y6p/01HXW72GB6SAGDFW8VBC8X25F2.mp3?rlkey=1392vzqlrk6dps0a8763us7uf&raw=1",
    selectCategory: "https://www.dropbox.com/scl/fi/tjwfrllo8lsb23t0abu27/01HWD5XAX15KKAKASJCBS18SMC.mp3?rlkey=82jumuuttcx9a0qdo98bp3wty&raw=1",
    playAgain: "https://www.dropbox.com/scl/fi/o822ufm5jz0y0imeait4m/01HX6MKWSBBS0FW45A5N35AT5Z.mp3?rlkey=pwnm13xyxu5jo33pjgs2wyvyj&raw=1",
    switchOn: "https://www.dropbox.com/scl/fi/wttc9l7ujwjfjw8wuif7z/01HWD5XAV5T7SNYPM79JSPYJTP-1.mp3?rlkey=no7fuxmbz3bcgmtvaje61l5vy&raw=1",
    switchOff: "https://www.dropbox.com/scl/fi/ypnd4hikcnj69qi9y205k/01HWD5XB1GFY4G3Y4AZTC1GN2R.mp3?rlkey=m04pff93t90o6xkoktwqlv6wb&raw=1",
    uiClick: "https://www.dropbox.com/scl/fi/ww27xdd3abq3ozc0heds8/01HWD5XBKANVPZVCCTP7THR7Q2.mp3?rlkey=6httxc42qx2h3e7cfj16jvpbr&raw=1",
    openInfo: "https://www.dropbox.com/scl/fi/z3o61q4zqex0d4081r6ej/01HWD5XB2JFXRPXHS6VSGTFTMG.mp3?rlkey=o4j1j0zroc5tpseqa0z9stbdz&raw=1",
    toggleMode: "https://www.dropbox.com/scl/fi/a0csiwttotrzam52xos84/01HWD5XBNZEHSRDXY96T1W5E18.mp3?rlkey=wgjt1yzesree78p5bzroum1cd&raw=1",
    turnOrderReveal: "https://www.dropbox.com/scl/fi/wk1fguj7rf9u5t1hlaeq2/01HYDYM99NTN52107R03DRVHWV.mp3?rlkey=dy0a819d3z8l91uf08kdjpk6w&st=7tcwrkwi&raw=1",
    alarm: "https://www.dropbox.com/scl/fi/33ljaplfdfse9h9xrqkia/01J9RASVSTKGV6WQ2GKBY86R84.mp3?rlkey=dhsr2ygnox9se0s88uklsfa5l&st=25yswvvu&raw=1",
    imposterWin: "https://www.dropbox.com/scl/fi/dcwhziv1s6y2esdeyshlr/01HSH4TXDZMFD17MZ6X052DSDK.mp3?rlkey=k125vxojv60ef1uimtqwvbmqr&st=k6mrbuoj&raw=1",
    agentWin: "https://www.dropbox.com/scl/fi/dfq6utr0g3ipxd7ie61iw/01HSH4PEC9GGB6AFS60K6059HB-1.mp3?rlkey=hr5l3w6ipwpq3uyo8vspo8slh&st=oqb5yhnp&raw=1",
    mainMenuMusic: "https://www.dropbox.com/scl/fi/2ptwdl60l1d8uonk2565r/01K2F0QVDH804F7BRXZM49PGP6.mp3?rlkey=xup3gy3mvh0s074m0exikou6m&st=b6sy1eaj&raw=1",
    categorySelectionMusic: "https://www.dropbox.com/scl/fi/tpqgmp0vic0fkwu2qa4z6/01K4783N93TC27JX716223WV45.mp3?rlkey=6gl82wcrpvioch4y30q7yaoij&st=nd1z0omz&raw=1",
    timerMusic: "https://www.dropbox.com/scl/fi/rw6a1k3er9zua9hy50y7r/01HSGT383SN8Y723GMVHWEGF1S.mp3?rlkey=o9inopsmgmztzh439pm3yqmw2&st=aqyn9x8c&raw=1",
};

const DISPLAY_CATEGORIES = Object.keys(WORD_BANK);

const totalWords = Object.values(WORD_BANK).reduce((sum, category) => sum + category.length, 0);
