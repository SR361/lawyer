<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'lawyer' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '6a?;rH*b$2I6R0CTP^ip}=$bIX8[P(VvZ c7tR{K;B6u_|+8>8`jK HEE9t7YJc5' );
define( 'SECURE_AUTH_KEY',  '095.1y/@RFJEhU6Oz]y$]<Z>X,@$f>YXlPUrLU[5fUI]QPQ*6c_.{WqqE9&Uy(.n' );
define( 'LOGGED_IN_KEY',    'F)!#!uDA.r}tYQCGDLN4rl75^)]|:~V:R_~pmh`VYoU4P7b6-i{tyI!_K.p1_<_/' );
define( 'NONCE_KEY',        '&ot>d40;rPiGJ=IUV<6-]o<EP7ca.B&j+5J<n@lF8pG`SZ/b2g4m5e/OFsyw?J!#' );
define( 'AUTH_SALT',        'Y Sy0c9g# *~dxn=zIbXoxS$IBs]BbB#EYx9crf*Wmd5zl/FEKy@z.A?Tj2!l]CF' );
define( 'SECURE_AUTH_SALT', '9f_m-`m~73{6OyOWU:Hk&]Z_8U9GT*W*bmOc]{F45l*SDd7-SBV<KXE&Y9c>O4{ ' );
define( 'LOGGED_IN_SALT',   'Y-FJ,u]1GLzJuBS}3+,lKupJDYOTjjt[4OQIa(E^xdQl70:P79v=rxo9O-6]8KQo' );
define( 'NONCE_SALT',       '~(jrP0+In?e@}?F6ncDKy:FpqJ JRh,Gd@5skr|+k-3!0cEpS ?W+bhA.$k+Pvom' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
