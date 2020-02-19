#!/bin/bash
env | sed "s/\(.*\)=\(.*\)/env[\1]='\2'/" > /usr/local/etc/php-fpm.conf;
exec "apache2-foreground"