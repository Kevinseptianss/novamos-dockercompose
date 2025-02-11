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
    pgm.createTable("article", {
        id: {
            type: "SERIAL",
            primaryKey: true,
        },
        title: {
            type: "TEXT",
            notNull: true,
        },
        category: {
            type: "TEXT",
            notNull: true,
        },
        date: {
            type: "DATE",
            notNull: true,
        },
        body: {
            type: "TEXT",
            notNull: true,
        },
        image: {
            type: "TEXT",
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
    pgm.dropTable('article');
};
