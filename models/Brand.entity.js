const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Brand",
    tableName: "brands",
    columns: {
        id: { type: "int", primary: true, generated: true },
        name: { type: "varchar", length: 100, nullable: false },
        slug: { type: "varchar", length: 100, unique: true, nullable: false },
        logo_url: { type: "varchar", length: 255, nullable: true },
        is_active: { type: "boolean", default: true },
        created_at: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" }
    },
    relations: {
        perfumes: {
            target: "Perfume",
            type: "one-to-many",
            inverseSide: "brand"
        }
    }
});