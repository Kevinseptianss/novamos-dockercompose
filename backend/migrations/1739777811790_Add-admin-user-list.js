/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('admin', {
        id: {
            type: 'SERIAL',
            primaryKey: true,
        },
        username: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
        password: {
            type: 'VARCHAR(255)',
            notNull: true,
        },
        question: {
            type: 'TEXT',
            notNull: true,
        },
        answer: {
            type: 'TEXT',
            notNull: true,
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable("admin")
};
