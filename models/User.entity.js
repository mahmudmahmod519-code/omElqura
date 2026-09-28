const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        name: {
            type: "varchar",
            length: 100,
            nullable: false
        },
        email: {
            type: "varchar",
            length: 150,
            unique: true,
            nullable: false
        },
        password: {
            type: "varchar",
            length: 255,
            nullable: false
        },
        phone: {
            type: "varchar",
            length: 20,
            nullable: true
        },
        address: {
            type: "text",
            nullable: true
        },
        role: {
            type: "enum",
            enum: ["admin", "customer"],
            default: "'customer'"
        },
        reset_token: {
            type: "varchar",
            length: 255,
            nullable: true
        },
        reset_token_expiry: {
            type: "datetime",
            nullable: true
        },
        created_at: {
            type: "timestamp",
            createDate: true
        }
    },
    relations: {
        orders: {
            target: "Order",
            type: "one-to-many",
            inverseSide: "user"
        },
        reviews: {
            target: "Review",
            type: "one-to-many",
            inverseSide: "user"
        }
    }
});