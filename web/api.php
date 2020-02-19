<?php
require_once '../model/DatabaseManager.php';

// Fichier PHP faisant office de pseudo 'api'. Ici on va utiliser la classe DatabaseManager pour récupérer des joueurs, ou bien
// sauvagarder des parties etc.
if(isset($_GET['action']) && !empty($_GET['action']) )
{
    // Par mesure de sécurité et éviter les attaques XSS, injection SQL etc. j'utilise ces deux fonctions pour néttoyer les données venant
    // du front via la méthode GET
    $action = $_GET['action'];
    $action = strip_tags($_GET['action']);
    $action = htmlspecialchars($action, ENT_QUOTES, 'UTF-8');
}
elseif(isset($_POST['action']) && !empty($_POST['action']))
{
    $action = $_POST['action'];
    $action = strip_tags($_POST['action']);
    $action = htmlspecialchars($action, ENT_QUOTES, 'UTF-8');
}

switch ($action) {
    case 'get':
        $dbManager = new DatabaseManager();

        // Récupération des 5 dernieres parties
        $games = $dbManager->getGames(5);


        // Je génère un tableau 'html' avec une boucle, quelquechose de classique qu'on rencontre souvant dans une vie !
        // j'initialise la variable avec le header du tableau
        $table = '
    
    <pre><table>
        <thead>
          <tr>
              <th>Nom</th>
              <th>score</th>
              <th>Temps</th>
          </tr>
        </thead>

        <tbody>';

        foreach ($games as $games)
        {
            // j'ajoute les 'row du tableau et une bidoulle des famille pour avoir les secondes en minutes !!! aie !
            $table .='
          <tr>
            <td>'.$games['player_name'].'</td>
            <td>'.$games['score'].'</td>
            <td>'.(round($games['time_length']/60, 0, PHP_ROUND_HALF_DOWN)).','.(( ($games['time_length']/60)-(round($games['time_length']/60,0, PHP_ROUND_HALF_DOWN )) )*60).'</td>
          </tr>
          ';
        }

        // je ferme avec la balise de fermeture
        $table .= '</tbody>
      </table></pre>';
        header("Content-Type:text/html");
        echo  $table;
        break;
    case 'post':
        // Grace a l'envoie de donnée en  formData depuis le code javascript, les données arrive directement sous format de array PHP
        // pas besoin de json_decode($_POST)
        $game = $_POST;

        // Je boucle sur chaque élément du tableau pour sécuriser les données et donc les néttoyer
        foreach ($game as $key => $value)
        {
            $game[$key] = strip_tags($value);
            $game[$key] = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        }

        $dbManager = new DatabaseManager();

        // j'envoie les données en base de donnée
        $games = $dbManager->postGame($game);
        echo "Game sauvegardée";
        break;
    default :
        echo "";
}