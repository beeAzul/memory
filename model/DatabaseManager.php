<?php

class DatabaseManager {

    private $host;
    private $username;
    private $password;
    private $dbname;
    private $options;
    private $pdo;


    public function __construct($host = 'localhost', $username = 'john_papa', $password = 'killerbee2020!', $dbname = 'memory', $options = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION) )
    {
        if(!empty($host))
        {
            $this->host     = $host;
            $this->username = $username;
            $this->password = $password;
            $this->dbname   = $dbname  ;
            $this->options  = $options;
        }
    }

    private function connect() {
        $this->pdo = new PDO("mysql:host=$this->host;dbname=$this->dbname", $this->username, $this->password, $this->options);
        return $this->pdo;
    }


    /**
     * Retourne toutes ou un nombre donné de parties contenue en base de donnée.
     */
    public function getGames($limit = 5)
    {

        // Je récupére les 5 dernieres parties trier par score en ordre décroissant
        $sql = 'SELECT * FROM games order by score desc limit :limit';
        $db = $this->connect()->prepare($sql);
        // bindParam est une méthode de la classe PDO, elle permet de néttoyer la string et de tester si elle est bien au
        // format que l'on veut, ici 'int', le test de type se fait grasse a la constant présentent partout DO::PARAM_INT. en plus de ça je test que la string
        // ne dépasse pas les 2 caracteres avec le dernier param dans la fonction '2'
        // le param ':limit' est lié a la variable $limit puis testé
        $db->bindParam(':limit', $limit, PDO::PARAM_INT, 2);
        // j'execute la fonction afin que PDO prépare les données
        $db->execute();
        // Boom, ici je demande a PDO de me les donner sous un format 'array' indexé
        $result = $db->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }


    /**
     * Enregistre une partie dans la table 'games' de la base de donnée memory. Cette fonction ne peut prendre qu'un array (tableau) en param
     * @param array $game
     * @return bool
     */
    public function postGame(array $game)
    {
        // Requete SQL pour inserer les données en base. On fait bien attention d'utiliser bindParam pour nétoyer les variables
        // des pottentielles attaque.
        $sql = 'INSERT INTO games (player_name, time_length, score) VALUES (:player_name, :time_length, :score)';
        $db = $this->connect()->prepare($sql);

        $db->bindParam(':player_name', $game['player_name'], PDO::PARAM_STR, 12);
        $db->bindParam(':time_length', $game['time_length'], PDO::PARAM_INT, 10);
        $db->bindParam(':score',       $game['score'],       PDO::PARAM_INT, 3);
        $result = $db->execute();
        return $result;
    }


    /**
     * Retourne une partie pour un joueur donné. Retourne un tableau avec les infos d'une partie,
     * ou false si la partie n'existe pas.
     * @param $playerName
     * @return mixed
     */
    public function getGame($playerName)
    {
        $sql = 'SELECT * FROM games WHERE player_name= :playerName';
        $db = $this->connect()->prepare($sql);
        $db->bindParam(':playerName', $playerName, PDO::PARAM_STR, 12);
        $db->execute();
        $result = $db->fetch(PDO::FETCH_ASSOC);

        return $result;
    }


    /**
     * Met à jour le score d'une partie pour un joueur donné. Retourne true si la modification à réusiie
     * ou false dans le cas contraire
     * @param string $playerName
     * @param int    $score
     * @return bool
     */
    public function patchGame($playerName, $score)
    {
        $sql = 'UPDATE games SET score = :score WHERE player_name= :playerName';
        $db = $this->connect()->prepare($sql);
        $db->bindParam(':playerName', $playerName, PDO::PARAM_STR, 12);
        $db->bindParam(':score',      $score, PDO::PARAM_INT, 3);
        $db->execute();

        return $result = $db->execute();
    }

    /**
     * Test l'existence d'un joueur.
     * @param string $playerName
     * @return bool
     */
    public function isPlayerExist($playerName)
    {
        $exist = $this->getGame($playerName);

        if(empty($exist))
        {
            return false;
        }
        else
        {
            return true;
        }
    }
}