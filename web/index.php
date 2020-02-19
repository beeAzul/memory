<!doctype html>
<html class="no-js" lang="fr">
<head>
    <meta charset="utf-8">
    <title>Memory</title>
    <meta name="description" content="Jeux memory">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>

<div class="container-cards">
    <header>
        <h1>Memory Game</h1>
    </header>

    <section class="score-panel">
        <span class="moves">0</span> Move(s)

        <div class="timer">
        </div>

        <div class="restart" onclick=startGame()>
            <i class="fa fa-repeat"></i>
        </div>
    </section>

    <div class="cards-list" id="card-game">
        <div id="card-1" class="one-piece card-img" data-value-card="apple"></div>
        <div id="card-2" class="one-piece card-img" data-value-card="banana"></div>
        <div id="card-3" class="one-piece card-img" data-value-card="orange"></div>
        <div id="card-4" class="one-piece card-img" data-value-card="lime"></div>
        <div id="card-5" class="one-piece card-img" data-value-card="pomegranate"></div>
        <div id="card-6" class="one-piece card-img" data-value-card="apricot"></div>
        <div id="card-7" class="one-piece card-img" data-value-card="lemon"></div>
        <div id="card-8" class="one-piece card-img" data-value-card="strawberry"></div>
        <div id="card-9" class="one-piece card-img" data-value-card="green-apple"></div>
        <div id="card-10" class="one-piece card-img" data-value-card="peach"></div>
        <div id="card-11" class="one-piece card-img" data-value-card="grape"></div>
        <div id="card-12" class="one-piece card-img" data-value-card="watermelon"></div>
        <div id="card-13" class="one-piece card-img" data-value-card="gomugomu-no-mi"></div>
        <div id="card-14" class="one-piece card-img" data-value-card="pear"></div>
        <div id="card-15" class="one-piece card-img" data-value-card="apple"></div>
        <div id="card-16" class="one-piece card-img" data-value-card="banana"></div>
        <div id="card-17" class="one-piece card-img" data-value-card="orange"></div>
        <div id="card-18" class="one-piece card-img" data-value-card="lime"></div>
        <div id="card-19" class="one-piece card-img" data-value-card="pomegranate"></div>
        <div id="card-20" class="one-piece card-img" data-value-card="apricot"></div>
        <div id="card-21" class="one-piece card-img" data-value-card="lemon"></div>
        <div id="card-22" class="one-piece card-img" data-value-card="strawberry"></div>
        <div id="card-23" class="one-piece card-img" data-value-card="green-apple"></div>
        <div id="card-24" class="one-piece card-img" data-value-card="peach"></div>
        <div id="card-25" class="one-piece card-img" data-value-card="grape"></div>
        <div id="card-26" class="one-piece card-img" data-value-card="watermelon"></div>
        <div id="card-27" class="one-piece card-img" data-value-card="gomugomu-no-mi"></div>
        <div id="card-28" class="one-piece card-img" data-value-card="pear"></div>
    </div>

    <div class="progress">
        <div class="determinate"></div>
    </div>

    <div id="popup1" class="overlay">
        <div class="popup">
            <h2>Congratulations 🎉</h2>
            <a class="close" href="#">×</a>
            <div class="content-1">
                Congratulations you're a winner 🎉🎉
            </div>
            <div class="content-2">
                <p>You made <span id="finalMove"> </span> moves </p>
                <p>in <span id="totalTime"> </span></p>
                <p>Rating: <span id="starRating"></span></p>
            </div>
            <button id="play-again">
                <a>Play again 😄</a>
            </button>
        </div>
    </div>

    <div id="popup3" class="overlay">
        <div class="popup">
            <h2>Perdu !</h2>
            <a class="close" href="#">×</a>
            <div class="content-1">
                Le temps est écoulé, la sentence est irévocable.
            </div>
            <div class="content-2">
                <p>You made <span id="finalMove"> </span> moves </p>
                <p>in <span id="totalTime"> </span></p>
                <p>Rating: <span id="starRating"></span></p>
            </div>
            <button id="play-again-again">
                <a>Réessayer 😄</a>
            </button>
        </div>
    </div>

    <div id="popup2" class="overlay">
        <div class="popup">
            <h2>Hi dude es tu un PGM de la memory ?</h2>
            <a class="closeiconstart" href="#">×</a>
            <div class="content-1">
                Voici les précédents gamers
            </div>
            <div id="players-list" class="content-2">
            </div>
            <div>Tape ton pseudo : <input id="pseudo" type="text" style="width: 25%"></div>
            <button id="play">
                <a>Play 😄</a>
            </button>
        </div>
    </div>
    <script src="assets/js/materialize.min.js"></script>
    <script src="dist/main.js"></script>
</body>

</html>