### Webpack configuration

<pre>
$ npm install
$ cd web && npm run webpack
</pre>

### Database initialisation

<pre>
CREATE DATABASE memory_db DEFAULT CHARACTER SET utf8;
USE memory_db;

GRANT ALL PRIVILEGES ON memory_db TO 'john_papa'@'localhost' IDENTIFIED BY 'killerbee2020!';
GRANT ALL PRIVILEGES ON memory_db.* TO 'john_papa'@'localhost' IDENTIFIED BY 'killerbee2020!';

USE memory_db;
CREATE TABLE `memory` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `player_name` varchar(12) NOT NULL,
  `time_length` int NOT NULL,
  `score` int NOT NULL
) ENGINE='MyISAM' COLLATE 'utf8_general_ci';
</pre>

# First insert in database
<pre>
INSERT INTO `memory`.`games` (`player_name`, `time_length`, `score`) VALUES ('beeAzul', 1581542259, 100)
</pre>
