const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Review",
    tableName: "reviews",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        user_id: {
            type: "int",
            nullable: false
        },
        perfume_id: {
            type: "int",
            nullable: false
        },
        rating: {
            type: "int",
            nullable: false
        },
        comment: {
            type: "text",
            nullable: true
        },
        is_approved: {
            type: "boolean",
            default: true
        },
        created_at: {
            type: "timestamp",
            createDate: true
        }
    },
    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            joinColumn: { name: "user_id", referencedColumnName: "id" },
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
            name: "unique_user_perfume_review",
            columns: ["user_id", "perfume_id"]
        }
    ]
});