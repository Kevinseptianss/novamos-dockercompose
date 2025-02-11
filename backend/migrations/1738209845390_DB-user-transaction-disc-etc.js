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
    pgm.createTable("users", {
        id: {
            type: "serial",
            primaryKey: true,
            notNull: true,
        },
        name: {
            type: "varchar(255)",
            notNull: true,
        },
        email: {
            type: "varchar(255)",
            notNull: false,
        },
        phone: {
            type: "varchar(20)",
            notNull: false,
        }
    });
    
    pgm.createTable("items", {
        id: {
            type: "serial",
            primaryKey: true,
            notNull: true,
        },
        title: {
            type: "TEXT",
            notNull: true,
        },
        description: {
            type: "TEXT",
            notNull: true,
        },
        price: {
            type: "INTEGER",
            notNull: true,
        },
        images: {
            type: "TEXT",
            notNull: true,
        },
        category_id: {
            type: "INTEGER",
            notNull: true,
        }
    });
    
    pgm.createTable("category", {
        id: {
            type: "serial",
            primaryKey: true,
            notNull: true,
        },
        name: {
            type: "TEXT",
            notNull: true,
        },
        image: {
            type: "TEXT",
            notNull: true,
        }
    });
    
    pgm.addConstraint('items', 'fk_items_category', {
        foreignKeys: {
            columns: 'category_id',
            references: 'category(id)',
            onDelete: 'CASCADE'
        }
    });

    pgm.createTable('voucher', {
        id: {
            type: 'serial',
            primaryKey: true,
            notNull: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        description: {
            type: 'TEXT',
            notNull: true,
        },
        expired: {
            type: 'DATE',
            notNull: true,
        },
        value: {
            type: 'INTEGER',
            notNull: true,
        },
        type: {
            type: 'TEXT',
            notNull: true,
        },
        min: {
            type: 'INTEGER',
            notNull: true,
        },
        image: {
            type: 'TEXT',
            notNull: true,
        }
    });

    pgm.createTable("order", {
        id: {
            type: "TEXT",
            primaryKey: true,
            notNull: true
        },
        user: {
            type: "TEXT",
            notNull: false
        },
        order_date: {
            type: "date",
            notNull: true
        },
        items: {
            type: "TEXT",
            notNull: true
        },
        voucher: {
            type: "TEXT",
            notNull: false
        },
        payment: {
            type: "TEXT",
            notNull: true
        },
        address: {
            type: "TEXT",
            notNull: true
        },
        courier: {
            type: "TEXT",
            notNull: true,
        },
        status: {
            type: "TEXT",
            notNull: true,
        }
    });

    pgm.createTable('otp', {
        id: {
            type: 'SERIAL',
            primaryKey: true,
            notNull: true
        },
        code: {
            type: 'TEXT',
            notNull: true
        },
        uniq: {
            type: 'TEXT',
            notNull: true
        }
    })

    pgm.createTable('authentications', {
        token: {
            type: 'TEXT',
            notNull: true,
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('order', { cascade: true });
    pgm.dropTable('voucher', { cascade: true });
    pgm.dropTable('category', { cascade: true });
    pgm.dropTable('items', { cascade: true });
    pgm.dropTable('users', { cascade: true });
    pgm.dropTable('otp', { cascade: true });
    pgm.dropTable('authentications', { cascade: true });
};