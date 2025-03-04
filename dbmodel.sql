CREATE TABLE IF NOT EXISTS `board` (
    `board_x` smallint(5) unsigned NOT NULL,
    `board_y` smallint(5) unsigned NOT NULL,
    `board_player` int(10) unsigned DEFAULT NULL,
    PRIMARY KEY (`board_x`, `board_y`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
-- 
CREATE TABLE IF NOT EXISTS `eras` (
    `goal_id` smallint(5) unsigned NOT NULL,
    `goal_state` smallint(1) unsigned NOT NULL,
    `red_cubes` smallint(3) unsigned NOT NULL,
    `green_cubes` smallint(3) unsigned NOT NULL,
    PRIMARY KEY (`goal_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
-- 
CREATE TABLE IF NOT EXISTS `foo_tokens` (
    `id` smallint(5) unsigned NOT NULL,
    `has_been_drawn` smallint unsigned DEFAULT NULL,
    `current_era` smallint(1) unsigned NOT NULL,
    `paradox_era` smallint(3) unsigned NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
-- 
CREATE TABLE IF NOT EXISTS `foo_tokens` (
    `id` smallint(5) unsigned NOT NULL,
    `has_been_drawn` smallint unsigned DEFAULT NULL,
    `current_era` smallint(1) unsigned NOT NULL,
    `paradox_era` smallint(3) unsigned NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
-- 
CREATE TABLE IF NOT EXISTS `card_faux` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `new_era` int(1) unsigned NOT NULL,
    `number_of_rifts` int(1) unsigned NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 AUTO_INCREMENT = 1;
-- 
CREATE TABLE IF NOT EXISTS `card` (
    `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `card_type` varchar(16) NOT NULL,
    `card_type_arg` int(11) NOT NULL,
    `card_location` varchar(16) NOT NULL,
    `card_location_arg` int(11) NOT NULL,
    PRIMARY KEY (`card_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 AUTO_INCREMENT = 1;