const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Category",
    tableName: "categories",
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
        slug: {
            type: "varchar",
            length: 100,
            unique: true,
            nullable: false
        },
        parent_id: {
            type: "int",
            nullable: true
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
        // العلاقة مع التصنيف الأب (Self-referencing)
        parent: {
            target: "Category",
            type: "many-to-one",
            joinColumn: { name: "parent_id", referencedColumnName: "id" },
            nullable: true
        },
        // العلاقة مع التصنيفات الفرعية (Children)
        children: {
            target: "Category",
            type: "one-to-many",
            inverseSide: "parent"
        },
        // العلاقة مع العطور
        perfumes: {
            target: "Perfume",
            type: "one-to-many",
            inverseSide: "category"
        }
    }
});