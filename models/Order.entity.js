const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Order",
    tableName: "orders",
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
        total_amount: {
            type: "decimal",
            precision: 10,
            scale: 2,
            default: 0
        },
        order_status: {
            type: "enum",
            enum: ["cart", "pending_approval", "processing", "shipped", "delivered", "cancelled"],
            default: "'cart'"
        },
        payment_method: {
            type: "enum",
            enum: ["instapay", "paymob", "cash"],
            default: "'cash'"
        },
        payment_status: {
            type: "enum",
            enum: ["pending", "approved", "rejected"],
            default: "'pending'"
        },
        paymob_order_id: {
            type: "varchar",
            length: 100,
            nullable: true
        },
        paymob_transaction_id: {
            type: "varchar",
            length: 100,
            nullable: true
        },
        payment_proof: {
            type: "varchar",
            length: 255,
            nullable: true
        },
        notes: {
            type: "text",
            nullable: true
        },
        created_at: {
            type: "timestamp",
            createDate: true
        },
        updated_at: {
            type: "timestamp",
            updateDate: true
        }
    },
    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            joinColumn: { name: "user_id", referencedColumnName: "id" },
            eager: false
        },
        orderItems: {
            target: "OrderItem",
            type: "one-to-many",
            inverseSide: "order"
        }
    }
});