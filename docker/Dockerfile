FROM php:5.6-apache-jessie
ARG DEBIAN_FRONTEND=noninteractive
# @link https://github.com/docker-library/wordpress
# install the PHP extensions we need
RUN rm -rf /var/lib/apt/lists/*

RUN apt-get update
RUN apt-get install -y libpng-dev \
    libjpeg-dev \
    libcurl4-openssl-dev \
    exiftool \
    bzip2 \
    zsh \
    vim \
    wget \
    libbz2-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libmcrypt-dev \
    libmemcached-dev \
    libghc-postgresql-libpq-dev \
    apt-transport-https \
    lsb-release \
    ca-certificates \
    memcached \
    g++ \
    zlib1g-dev \
    libicu-dev \
    unixodbc-bin \
    freetds-common \
    freetds-bin \
    libsybdb5 \
    apt-utils

RUN docker-php-ext-install gd \
    mysqli \
    exif \
    curl \
    mysqli \
    opcache \
    pdo \
    pdo_mysql \
    zip \
    mcrypt \
    mbstring \
    bz2 \
    pgsql \
    intl \
    gettext \
    bcmath \
	&& docker-php-ext-configure gd -with-freetype-dir=/usr/include/ -with-jpeg-dir=/usr/include/ \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/include/postgresql/ \
	&& docker-php-ext-configure exif \
	&& docker-php-ext-configure intl --enable-intl \
    && docker-php-ext-enable intl gettext bcmath exif

RUN set -ex; \
	docker-php-source extract; \
	{ \
		echo '# https://github.com/docker-library/php/issues/103#issuecomment-271413933'; \
		echo 'AC_DEFUN([PHP_ALWAYS_SHARED],[])dnl'; \
		echo; \
		cat /usr/src/php/ext/odbc/config.m4; \
	} > temp.m4; \
	mv temp.m4 /usr/src/php/ext/odbc/config.m4; \
	apt-get install -y unixodbc-dev; \
	docker-php-ext-configure odbc --with-unixODBC=shared,/usr; \
	docker-php-ext-install odbc; \
	docker-php-source delete

RUN apt-get update \
  && apt-get install -y

RUN set -xe; \
	apt-get update; \
	apt-get -y --force-yes --no-install-recommends install freetds-dev; \
	docker-php-ext-configure mssql --with-libdir=/lib/x86_64-linux-gnu/; \
	docker-php-ext-configure pdo_dblib --with-libdir=/lib/x86_64-linux-gnu/; \
	docker-php-ext-install -j$(nproc) mssql pdo_dblib;

RUN ln -s /usr/lib /usr/local/lib64 \
    && ln -s /usr/lib /usr/local/lib

RUN wget -O /etc/apt/trusted.gpg.d/php.gpg https://packages.sury.org/php/apt.gpg
RUN echo "deb https://packages.sury.org/php/ jessie main" > /etc/apt/sources.list.d/php.list
RUN rm /etc/apt/preferences.d/no-debian-php
RUN apt-get update; \
    apt-get install -y mysql-client postgresql-client php5.6-intl php5.6-mbstring php5.6-xml php5.6-zip php5.6-gettext php5.6-odbc php5.6-ldap gettext php5-memcache php5-memcached npm

RUN sed -i 's/	AllowOverride None/	AllowOverride All/' /etc/apache2/apache2.conf

RUN pecl install memcache-2.2.7 && docker-php-ext-enable memcache
RUN pecl install memcached-2.2.0 \
    && echo extension=memcached.so >> /usr/local/etc/php/conf.d/memcached.ini

RUN apt install -y --no-install-recommends \
    php5-sybase \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    lsb-release \
    xdg-utils \
    wget \
    unzip \
    git \
    libmcrypt-dev \
    mysql-client \
    libmagickwand-dev \
    curl \
    software-properties-common \
    nodejs

RUN npm install -g n
RUN n 10.16.0

VOLUME /var/www/html
ARG userid=1019
ARG username=jbenselma
RUN adduser --disabled-password --gecos '' --uid ${userid} ${username}
RUN adduser ${username} www-data
RUN adduser www-data ${username}
RUN usermod -a -G www-data ${username}
RUN usermod -a -G ${username} www-data

RUN apt-get install -y locales \
    && sed -i 's/# fr_FR.UTF-8 UTF-8/fr_FR.UTF-8 UTF-8/' /etc/locale.gen && \
       sed -i 's/# fr_CA.UTF-8 UTF-8/fr_CA.UTF-8 UTF-8/' /etc/locale.gen && \
       sed -i 's/# en_GB.UTF-8 UTF-8/en_GB.UTF-8 UTF-8/' /etc/locale.gen && \
       sed -i 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
       locale-gen

RUN { \
		echo 'opcache.memory_consumption=128'; \
		echo 'opcache.interned_strings_buffer=8'; \
		echo 'opcache.max_accelerated_files=4000'; \
		echo 'opcache.revalidate_freq=2'; \
		echo 'opcache.fast_shutdown=1'; \
		echo 'opcache.enable_cli=1'; \
	} > /usr/local/etc/php/conf.d/opcache-recommended.ini
RUN { \
		echo 'date.timezone="America/New_York"'; \
	} > /usr/local/etc/php/conf.d/date.ini

RUN { \
		echo '185.7.75.116 jbs.api-whois.safebrands.com'; \
    } > /etc/hosts


RUN { \
        echo '[Revelation]'; \
#        echo '        host = 195.64.164.61'; \
        echo '        host = 195.64.164.20'; \
        echo '        port = 1433'; \
        echo '        tds version = 7.0'; \
        echo '        client charset = UTF-8'; \
        echo '        text size = 20971520'; \
        echo '[MAF]'; \
#        echo '        host = 195.64.164.61'; \
        echo '        host = 195.64.164.20'; \
        echo '        port = 1433'; \
        echo '        tds version = 7.0'; \
        echo '        client charset = UTF-8'; \
        echo '        text size = 20971520'; \
        echo '[BMC]'; \
#        echo '        host = 195.64.164.61'; \
        echo '        host = 195.64.164.20'; \
        echo '        port = 1433'; \
        echo '        tds version = 7.0'; \
        echo '        client charset = UTF-8'; \
        echo '        text size = 20971520'; \
    } >> /etc/freetds/freetds.conf


RUN { \
        echo 'memory_limit = -1'; \
    } >> /usr/local/etc/php/php.ini

RUN a2enmod rewrite expires vhost_alias

RUN  pecl install imagick \
    && docker-php-ext-enable imagick

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

## Node => assetic:dump
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN npm install less -g
EXPOSE 80

COPY docker/docker-entrypoint.sh  /
CMD ["/docker-entrypoint.sh"]
