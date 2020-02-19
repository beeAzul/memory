import './styles.scss';
import axios from 'axios';

/**
 * Hello, j'initialise les variables ci dessous afin d'y accéder partout dans ce fichier, dans les fonctions et hors des fonctions.
 * La portée de ces variables est très utile car elle me permet de changer la valeur de ces variables dans les fonctions sans devoir les redéclarer
 */
// saveGamePlay('55','77')

// saveGamePlay ('lol','lolus')

// Je stock l'element 'html' de type 'input'
let inputElement = document.getElementById("pseudo");

// j'initialise la variable pseudo pour pouvoir la sauvegarder ensuite en base
let pseudo = '';

// j'ajoute un 'EventListener' de type 'keypress', c'est a dire qu'a chaque foi que quelque chose est tapé dans l'input
// cela déclenche le code permettant de tester si le joueur a entré au minimum 3 caractères
inputElement.addEventListener('keypress', function(e) {

    // 'e' représente l'evenement en cours déclenché par 'addEventListener'. 'e' contient des proprietés et des méthodes
    // ici on demande la valeur de la cible (l'input dans notre cas), soit, la valeur contenue dans l'attribut value de l'element 'html' 'input'
    // meme si l'attribut value="ma value!" n'est pas présent dans l'<input />, le navigateur l'ajoute pour nous quand on tape
    // quelque chose dans l'input
    pseudo = e.target.value;

    // je crée une expression régulière pour tester une string qui "contient une suite de chiffre ou de lettre au nombre min de 3 et max de 5"
    // vu que l'on démarre a 0 on le compte donc on met 2 pour 3 et 4 pour 5'
    let regex = /^[0-9a-z]{2,4}$/i;

    // un debug des familles
    // console.log(regex.test(pseudo));

    // je test la valeur de 'pseudo' avec l'expression réguliere, ce test revoie true ou false
    if(regex.test(pseudo))
    {
        // je supprime la class 'disabled-button' pour l'element 'html' qui a l'id 'disabled-button'
        document.getElementById('play').classList.remove("disabled-button");
    } else {
        // ici je l'ajoute si le pseudo ne respecte pas la regex
        document.getElementById('play').classList.add("disabled-button");
    }
});

// Je récupère toutes les 'cards' qui ont la classes 'one-piece', ou je récupère toutes les 'div' du DOM qui ont la class 'one-piece'
// y'en a 28 !
let cardsList = document.getElementsByClassName("one-piece");


// Vu que 'cardList' est du type 'HTMLCollection' (soit une liste d'element HTML et non pas un array d'element), je ne pourrai pas traiter chaque element
// avec les méthodes des array comme  la méthodes 'push()' (utilisable directement sur un array => monArray.push() )
// je transforme la liste en tableau avec le 'spread operator' ( aka "l'exploseur" ). Le spread operator (les 3 petits points) devant un object, un array, ou une collection (cardList pour ne pas le citer)
// va littéralement eclater la variable qui suit et les ajouter dans un nouveau tableau. Parfait j'avais besoin d'un tableau!
const cards = [...cardsList];

// Boucle sur chaque element du tableau 'cards' pour leur ajouter un 'EventListener' de type 'click'. Chaque element de cards est un objet du 'DOM', c.a.d, littéralement
// un élément html qui a la classe 'one-piece'
// Ici j'ai décidé d'utilier une boucle for, mais je peux aussi utiliser la méthode '.map()' dirrectement sur mon tableau. Je le fais plus bas d'ailleurs
for (let i = 0; i < cards.length; i++){

    // je récupère un seul élement du tableau 'cards'
    let card = cards[i];

    // Un EventListener comme son nom l'indique, permet d'ecouter un evenement. Un evenement est représenté par une action dans le navigateur sur le 'DOM'.
    // Ici c'est le 'click' qu'on essai de detecter, je dirai meme plus un 'click' sur un element qui a la classe 'one-piece'
    card.addEventListener("click", function()
    {
        // si quelqu'un clique sur la carte courrante, on déclenche la fonction 'displayCard' sur la carte cliquée.
        // La carte est en param de la fonction displayCard
        // Pour savoir quel carte est cliqué, on peut faire un console.log(card), sa aide a comprendre, décommente la ligne ci dessous.
        // console.log(card)
        displayCard(card)
    });
    card.addEventListener("click", function(e) {
        let card = e.target;

        // Pareil, ici j'ecoute l'evenement 'click' sur la 'card', au 'click', je déclenche la fonction 'cardOpen' qui retourne la carte pour l'afficher a l'ecran
        cardOpen(card);
    });
    card.addEventListener("click",function()
    {
        // Voici le 3eme ecouteur sur la carte, cette fonction est déclenchée pour tester si tous les 'matchs' sont fait
        // Si tous les 'macths' sont fait, fin de partie
        congratulations();
    });
};

// Je récupère la div contenant toutes les cartes, c'est pour réinsérer les 'card' lorsque qu'elle seront 'shuffle' (mélangées)
const deck = document.getElementById("card-game");

// J'initialise la variable qui compte le nombre de mouvement
let moves = 0;

// Je stock dans une variable l'element html qui a la classe 'moves', c'est l'element 'span' qui contient le nombre de mouvement
const counter = document.querySelector(".moves");


// Je stock dans une variable les etoiles pour noter la partie, c'est l'element html 'li'
const stars = document.querySelectorAll(".fa-star");

// initialisation du temps de départ et de fin
let timeStart = 0;
let timeEnd = 0;

// Je stock dans une variable tous les element 'html' ont la class 'match', ce sont les 'cards' qui ont matché
// Au départ il y en a 0, plus elle se remplisse automatiquement
let matchedCard = document.getElementsByClassName("match");

// stars list
let starsList = document.querySelectorAll(".stars");

// Je stock dans une variable la 'croix' des popups, c'est l'element html 'a' qui a pour class 'popup1'
let closeicon = document.querySelector(".close");

// Je stock dans une variable la modal de fin de partie, c'est l'element html 'div' qui a pour id 'popup1'
let modalEnd = document.getElementById("popup1")

// Je stock dans une variable la modal de début de partie, c'est l'element html 'div' qui a pour id 'popup2'
let modalStart = document.getElementById("popup2");

// Je stock dans une variable la modal de début de partie, c'est l'element html 'div' qui a pour id 'popup2'
let modalStopGame = document.getElementById("popup3");

// Initialisation de la variable de type 'array' qui va stocker les 'cards' ouvertes. Il se remple de 2 'card' puis sera
// vidé pour acceuillir les deux prochaines cartes à comparer
var openedCards = [];

// Initialisation de la variable contenant l'element 'html' représentant le timer, c'est la div qui a pour class timer
// j'ai utilisé ici une autre manière de récupérer l'element, 'querySelector' qui prend en param une 'class' ou un 'id' noté comme en 'css'
// avec le '.' ou le '#' selon si c'est une 'class' ou un 'id'
let timer= document.querySelector(".timer");

// Initialisation de la variable contenant l'element 'html' représentant bar de progression, c'est la div qui a pour class determinate
let progress= document.querySelector(".determinate");

// J'initialise la taille (width) de la progress bar avec '0%';
progress.style.width = "0%";

// j'initialise les varibales pour le compteur de temps
let second = 0;
let minute = 0;
let hour = 0;
let  interval;

// Ceci est un evenement. A la fin du chargement de la page, déclenchement de 'showStartModal'
document.body.onload =  showStartModal();


/**
 * Cette fonction permet de mélanger les cartes au démarrage de chaque partie
 * @param array
 * @return array
 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

/**
 * Cette fonction déclenche le jeu en initialisant certaines variables et en mélangeant les 'cards'
 */
function startGame(){

    // On vide le tableau contenant les 'cards' ouvertes.
    openedCards = [];

    // On mélange les cartes
    let cardsShuffled = shuffle(cards);

    // On vide la 'div' contenant toutes les 'cards' pour insérer les 'cards' qui ont été mélangé
    deck.innerHTML = "";

    // c'est ici qu'on réinsert les cartes mélangées
    cardsShuffled.map( function(card) {
        // On prend bien soin de supprimer les classes de chaque card pour réinitialiser le jeu
        card.classList.remove("show", "open", "match", "disabled");
        deck.appendChild(card);
    });

    // Reset du nombre de mouvement
    moves = 0;

    // On insert dans le 'DOM' (dans le code html du jeu, a l'intérieure de l'element 'html' counter) le nombre de mouvement
    counter.innerHTML = moves;

    // On récupére l'element 'html' qui a pour classe 'timer', puis on vide ce qu'il a entre ses balises
    let timer = document.querySelector(".timer");

    // Puis on réinsert la 'string' '0 mins 0 secs'
    timer.innerHTML = "0 mins 0 secs";

    // Et pour finir on réinitialise 'interval'. 'interval', est une fonction qui permet de declencher a intervalle donnée (en milliseconde)
    // une fonction que nous lui avons passé en param. Dans note cas, toute les secondes, interval est executée pour mettre à jour l'element 'html'
    // 'timer', la fonction interval est plus bas
    clearInterval(interval);
}


/**
 * Methode permettant de retourner les 'card' via l'ajout ou la supression de classe 'css'
 * @param card
 */
var displayCard = function (card){
    card.classList.toggle("open"); // Pour l'element 'html' card, récupere les classes, si la classe 'open' est présente suprime la, sinon ajoute la
    card.classList.toggle("show"); // la méthode toggle fait le contraire, si la class est présente,  il l'a supprime, sinon il l'ajoute
    card.classList.toggle("disabled");
};


/**
 * Ajoute au tableau 'openedCards' la 'card' séléctionné par l'utilisateur ('card' est un element 'html'), puis test si
 * la 'card' est identique à la deuxieme. Le test de similarité se fait uniquement si openedCards contient 2 elements
 */
function cardOpen(card)
{
    // Ajout des 'card' dans le tableau openedCards
    openedCards.push(card);

    // récupération de la taille du tableau
    let len = openedCards.length;

    // si la taille est égale a 2, donc que openedCards contient 2 'card' ...
    if(len === 2)
    {
        // .. on incrémente le conteur de mouvement
        moveCounter();

        // dans la page index.php, dans le html, pour stocker les valeurs des cartes, j'ai décidé d'utiliser les les attributs
        // 'html' 'data-****'. On peut ce que l'on souhaite comme donnée, et les récupérer via la méthode dataset sur un element 'html'
        // Ci dessous je récupère la valeur de l'attribut data de l'element contenue dans le tableau openedCards à l'index 0
        // il faut utiliser le camelCase si le nom de l'attribut est séparer par un '-' dans le code 'html'
        // Voir un exemple :
        // console.log(openedCards[0].dataset.valueCard);
        // console.log(openedCards[1].dataset.valueCard);

        // on test si les cartes sont les memes
        if(openedCards[0].dataset.valueCard === openedCards[1].dataset.valueCard)
        {
            matched(); // si les carte sont les memes, je déclenche match()
        }
        else
        {
            unmatched(); // je déclenche unmatched() dans le cas contraire
        }
    }
};


/**
 * Cette fonction permet d'ajouter des classes aux elements 'html' en train d'etre comparés.
 * sur ces elements :
 *  - on ajoute les classes "match" et "disabled", pour qu'elle reste retournée et désactivée grace au regle 'css' (pour la carte 1)
 *  - on ajoute les classes "match" et "disabled", pour qu'elle reste retournée et désactivée grace au regle 'css' (pour la carte 2)
 *  - on supprime les classes "show" et "open", pour qu'elles n'interferent pas avec le reste des cartes à retourner qui n'ont pas encore matché
 * L'ajout des classes applique le style css pour ces classes
 */
function matched(){
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open");
    openedCards[1].classList.remove("show", "open");
    openedCards = [];
}


/**
 * cette fonction permet d'ajouter des classes aux elements 'html' en cours de test de match et ajoute des classes 'html'
 * pour donné un effet au carte en erreur, une secousse un background rouge etc. L'ajout des classes applique le style css
 * pour ces classes
 */
function unmatched(){
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable(); // on désactive toutes les cartes

    // Cette fonction permet de déclencher ce qui est a l'interieur de la fonction anonyme apres 1.1 seconde (1100 milliseconde).
    // Ici on veut veut empecher d'aller trop vite, en désactivant toutes les 'cards' pendant 1.1 seconde, puis en les réactivant
    setTimeout(function(){
        openedCards[0].classList.remove("show", "open", "no-event","unmatched");
        openedCards[1].classList.remove("show", "open", "no-event","unmatched");
        enable(); // réactive toutes les 'cards'
        openedCards = []; // on vide le tableau des carte ouverte pour pouvoir on tester deux autre
    },1100);
}


/**
 * Désactive toutes les cartes en ajoutant la classe 'disabled'
 */
function disable()
{
    cards.map( function(card) {
        return card.classList.add('disabled');
    })
}


/**
 * Réactivation de toutes les 'cards' en supprimant la classe 'disabled'
 * Et désactivation des 'cards' déjà matché en leur ajoutant la classe 'disabled', cela permet d'empecher les 'cards' matché
 * d'etre reselectionnées
 */
function enable(){
    cards.map(function(card){
        card.classList.remove('disabled');
    });

    for(var i = 0; i < matchedCard.length; i++){
        matchedCard[i].classList.add("disabled");
    }
}


/**
 * Cette fonction est le compteur de mouvement, à chaque foi qu'on l'appelle, on incrémente les 'moves'
 */
function moveCounter(){

    moves++;

    //on injecte moves directement dans le DOM (la page 'html')
    counter.innerHTML = moves;

    // Démarrage du timer dés le premier movement
    if(moves == 1){

        startTimer(); //  au premier mouvement on déclenche le compteur de temps
    }
}


/**
 * Cette fonction est le compteur de temps, une foi déclenché, a intervalle régulier elle fait s'ecouler le temps
 */
function startTimer()
{
    // Au premier mouvement, on stock le temps dans un format timestamp, un entier représentant
    // le nombre de seconde depuis le 1er janvier 1970, c'est le meilleur format pour la base de donnée
    if(moves === 1)
    {
        timeStart = Math.round(+new Date()/1000);
    }

    // Je stock ceci dans une variable pour pourvoir arreter l'interval. Et oui ce truc s'arret pas si on lui dit pas
    // on l'arret avec 'clearInterval(interval)'
    interval = setInterval( function() {

        /*console.log('---- startTimer ----');
        console.log(timeStart, timeEnd);
        console.log('---- startTimer ----');*/

        // j'ajoute ' minute+"mins "+second+"secs" ' à l'interieur des balises 'html' de timer => "<div class="timer"> 'ICIIIIII' </div>"
        timer.innerHTML = minute+"mins "+second+"secs";
        second++;

        // je récupère le width de la 'progressbar', je supprime le '%' pour pouvoir utiliser le chiffre
        let barsize = progress.style.width.substring(0, progress.style.width.length - 1);

        // j'utilise le chiffre récupéré plus haut et je rajoute 100/180
        // 100/180, c'est 100% divisé par 180 seconde soit 3 min. Oui le jeu dure 3min max
        // je divise donc 100 par le nombre de seconde
        barsize = parseFloat(barsize) + 100/180;

        // si la bazrsize est > ou egale a 100, fin du jeu
        if(barsize >= 100)
        {
            // Afficher la modal de de fin de partie
            modalStopGame.classList.add("show");

            // on stock le temps de fin de partie pour le save en base
            timeEnd = Math.round(+new Date()/1000);

            // j'utilise la fonction ajax pour save en base
            saveGamePlay (timeStart, timeEnd);

            // Récupération du bouton ayant l'id 'play-again-again'
            const playAgainAgain = document.getElementById("play-again-again");

            // j'ajoute sur ce bouton un 'EventListener' de type 'click' pour déclencher la modal 'modalStopGame'
            playAgainAgain.addEventListener('click', function() {
                stopGame(modalStopGame)
            });

            // fermeture de la modal modalStopGame
            closeModal(modalStopGame);

            // je stop le setIntervale
            clearInterval(interval);
        } else {
            progress.style.width =  barsize + "%";

            if(second == 60){
                minute++;
                second=0;
            }
            if(minute == 60){
                hour++;
                minute = 0;
            }
        }

    },1000);
}


/**
 * Cette fonction est déclenché a chaque foi qu'une 'card' est retourner afin de tester si c'est bien la fin de partie
 */
function congratulations(){

    if (matchedCard.length === 28)
    {
        // arret du chrono
        clearInterval(interval);

        // récupération de la valeur du timer
        let finalTime = timer.innerHTML;

        timeEnd = Math.round(+new Date()/1000);

        // save de la partie en base
        saveGamePlay(timeStart, timeEnd);

        // Affiche la modal de fin de partie
        modalEnd.classList.add("show");


        //Affiche les score dans le popup
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("starRating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = finalTime;

        // récupération du bouton ayant l'id 'play-again' pour lui ajouter un EventListener de type 'click'
        let playAgainButon = document.getElementById("play-again");

        playAgainButon.addEventListener('click', function() {
            showStartModal();
            modalEnd.classList.remove("show");
        });
        // On déclenche la fonction permettant de fermer la modal en lui passant la modal qu'on veut fermer
        closeModal(modalEnd);
    };
}


/**
 * Affiche la modal de démarrage de jeu
 */
function showStartModal(){

    // Afficher la modal de démarrage
    modalStart.classList.add("show");

    // On réinitialise la progress bar pour les personne souahaitant rejouer
    progress.style.width = '0%';

    // Récupération de l'element 'html' contenant tableau 'html' des joueurs
    const playersListElement = document.getElementById("players-list");

    // Récupération du button pour lui fixer une EventListener de type 'click'
    const play = document.getElementById("play");

    play.addEventListener('click', function() {
        playAgain(modalStart);
    });


    // Récupération des précédente partie et insertion du résultat dans l'element html playersListElement. c'est la div
    // qui a pour id players-list

    // getPreviousGamePlay est une 'promise', les données ne sont pas retournée instantanément, c'est en asynchrone
    getPreviousGamePlay().then(function(response) {

        let data = response.data
        console.log('---- data ----');
        console.log(data);
        console.log('---- data ----');

        playersListElement.innerHTML = data;
    });

    closeModal(modalStart);
}


/**
 * Cette fonction ferme la modal passé en param
 * @param modal
 */
function closeModal(modal)
{
    // j'ai ajouté cette ligne afin de remettre la 'class' 'disabled-button' afin de redésactiver le boutton 'Play'
    document.getElementById('play').classList.toggle("disabled-button");

    // j'ajoute un EventListener de type 'click' pour déclencher la fermeture de la modal a chaque foi que
    // l'on click sur la petite croix de la modal
    closeicon.addEventListener("click", function() {
        modal.classList.remove("show");
        playAgain();
    });
}


/**
 * Cette fonction permet de supprimer la classe 'show' de la modal qui est passée en param, cela fait disparait la modal.
 * Puis, on déclenche startGame() qui la déclencher la partie.
 * @param modal
 */
function playAgain(modal)
{
    modal.classList.remove("show");
    startGame();
}

/**
 * Cette fonction permet de supprimer la class 'show' de la modal qu'on l'on passe en param.
 * Une foi la classe supprimé, la modal disparaitra, puis on déclenche la fonction showStartModal
 * pour afficher la modal de démarrage du jeu
 * @param modal
 */
function stopGame(modal)
{
    modal.classList.remove("show");
    showStartModal();
}

/**
 * Cette fonction récupère des données en base de données grace a une requete ajax vers notre pseudo api.
 * On utilise toujours axios pour cela.
 * @returns {Promise<AxiosResponse<T>>}
 */
function getPreviousGamePlay ()
{
    const previousParties = axios.get('/api.php?action=get',
        {
            responseType: "text"
    });

    return previousParties;
};


/**
 * Execute une requete ajax vers notre pseudo api afin d'envoyer les données de la partie
 * axios est une librairie javascript utilisée pour executer des requetes ajax
 * @param timeStart
 * @param timeEnd
 */
function saveGamePlay (timeStart, timeEnd)
{
    // envoie en mode FormData
    const params = new URLSearchParams(); // j'utilise cette classe afin de créer un requete POST, sans cela, ça ne marche pas
    params.append('action', 'post');
    params.append('player_name', 'azaz');
    params.append('time_length', '145');
    params.append('score', '25');

    axios({
        method: 'post',
        url: '/api.php',
        data: params,
    }).then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
};


