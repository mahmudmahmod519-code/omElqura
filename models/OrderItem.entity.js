const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "OrderItem",
    tableName: "order_items",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        order_id: {
            type: "int",
            nullable: false
        },
        perfume_id: {
            type: "int",
            nullable: false
        },
        quantity: {
            type: "int",
            default: 1
        },
        unit_price: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false
        },
        total_price: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false
        }
    },
    relations: {
        order: {
            target: "Order",
            type: "many-to-one",
            joinColumn: { name: "order_id", referencedColumnName: "id" },
            onDelete: "CASCADE"
        },
        perfume: {
            target: "Perfume",
            type: "many-to-one",
            joinColumn: { name: "perfume_id", referencedColumnName: "id" },
            onDelete: "CASCADE"
        }
    },
    uniques: [
        {
            name: "unique_order_perfume",
            columns: ["order_id", "perfume_id"]
        }
    ]
});