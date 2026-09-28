const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Perfume",
    tableName: "perfumes",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        brand_id: {
            type: "int",
            nullable: false
        },
        category_id: {
            type: "int",
            nullable: false
        },
        name: {
            type: "varchar",
            length: 150,
            nullable: false
        },
        slug: {
            type: "varchar",
            length: 150,
            unique: true,
            nullable: false
        },
        description: {
            type: "text",
            nullable: true
        },
        price: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false
        },
        stock_quantity: {
            type: "int",
            default: 0
        },
        image_url: {
            type: "varchar",
            length: 255,
            nullable: true
        },
        fragrance_family: {
            type: "varchar",
            length: 50,
            nullable: true
        },
        concentration: {
            type: "varchar",
            length: 20,
            nullable: true
        },
        is_best_seller: {
            type: "boolean",
            default: false
        },
        is_active: {
            type: "boolean",
            default: true
        },
        created_at: {
            type: "timestamp",
            createDate: true
        }
    },
    relations: {
        brand: {
            target: "Brand",
            type: "many-to-one",
            joinColumn: { name: "brand_id", referencedColumnName: "id" },
            onDelete: "RESTRICT"
        },
        category: {
            target: "Category",
            type: "many-to-one",
            joinColumn: { name: "category_id", referencedColumnName: "id" },
            onDelete: "RESTRICT"
        },
        orderItems: {
            target: "OrderItem",
            type: "one-to-many",
            inverseSide: "perfume"
        },
        reviews: {
            target: "Review",
            type: "one-to-many",
            inverseSide: "perfume"
        }
    }
});