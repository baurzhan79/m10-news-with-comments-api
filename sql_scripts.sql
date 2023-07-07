-- Создание базы данных с необходимыми таблицами и связями по внешним ключам
CREATE SCHEMA if not exists `news_with_comments` DEFAULT CHARACTER SET utf8 ;

CREATE TABLE if not exists `news_with_comments`.`news` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(128) NOT NULL DEFAULT 'news title',
  `content` TEXT(1000) NOT NULL,
  `image` VARCHAR(30),
  `publication_date` DATETIME NULL DEFAULT NOW(),
  PRIMARY KEY (`id`));
  
CREATE TABLE if not exists `news_with_comments`.`comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `news_id` INT NOT NULL,
  `author` VARCHAR(128) NULL DEFAULT 'Anonymous',
  `comment` TEXT(1000) NOT NULL,
  PRIMARY KEY (`id`));
  
set @drop_foreign_keys_and_indexes = 'ALTER TABLE `news_with_comments`.`comments`
            DROP FOREIGN KEY `fk_news`,
            DROP INDEX `fk_news_idx`;
            ';

set @var=if((SELECT true FROM information_schema.TABLE_CONSTRAINTS WHERE
            CONSTRAINT_SCHEMA = DATABASE() AND
            TABLE_NAME        = 'comments' AND
            CONSTRAINT_NAME   = 'fk_news' AND
            CONSTRAINT_TYPE   = 'FOREIGN KEY') = true,
            @drop_foreign_keys_and_indexes,'select 1');

prepare stmt from @var;
execute stmt;
deallocate prepare stmt;

ALTER TABLE `news_with_comments`.`comments`
ADD INDEX `fk_news_idx` (`news_id` ASC) VISIBLE;
;
ALTER TABLE `news_with_comments`.`comments` 
ADD CONSTRAINT `fk_news`
  FOREIGN KEY (`news_id`)
  REFERENCES `news_with_comments`.`news` (`id`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;


-- Заполнение таблиц некоторыми данными
use news_with_comments;

delete from comments where id <> 0;
alter table comments auto_increment=1;
delete from news where id <> 0;
alter table news auto_increment=1;

insert into news (title, content, publication_date)
	values ('новость №1', 'Нефть подорожала из-за решения ОПЕК+ сократить добычу', '2023-07-01 00:00:00');
insert into news (title, content, publication_date)
	values ('новость №2', 'Масштабный книжный фестиваль KitapFest состоялся в Астане', '2023-07-02 12:00:00');
insert into news (title, content, publication_date)
	values ('новость №3', 'Школа айти направления на 300 мест откроется в Кокшетау', '2023-07-02 12:00:00');
insert into news (title, content, publication_date)
	values ('новость №4', 'Глобальное потепление: ООН заявляет, что изменение климата вышло из-под контроля', '2023-07-03 15:30:00');
insert into news (title, content, publication_date)
	values ('новость №5', 'Во время взрыва на заводе в Самарской области погибли шесть человек', '2023-07-03 15:30:00');
    
insert into comments (news_id, comment) values (1, 'Добыть меньше, продать больше');
insert into comments (news_id, comment) values (2, 'Фестиваль KitapFest – это культурно-просветительское мероприятие, завоевавшее признание у любителей книг. Цель мероприятия – повышение интереса подрастающего поколения к чтению, развитие читательской культуры, создание единой площадки для писателей и их читателей');
insert into comments (news_id, comment) values (3, 'Мы начали работать в быстром темпе с мая этого года, за два месяца была проделана огромная работа. На данный момент все стены в чистовой отделке, мы приступили к дизайнерской покраске');

