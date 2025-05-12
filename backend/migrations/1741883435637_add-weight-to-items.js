/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = function(pgm) {
    pgm.addColumn('items', {
        weight: {
            type: 'INTEGER',
            notNull: false,
            default: 0 // You can set a default value if needed
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = function(pgm) {
    pgm.dropColumn('items', 'weight');
};
