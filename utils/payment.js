const https = require('https');
const crypto = require('crypto');

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const IFRAME_ID = process.env.PAYMOB_IFRAME_ID;

/**
 * Make HTTPS request using native https module
 */
function httpsRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const reqOptions = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const req = https.request(reqOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, data: JSON.parse(data) });
                } catch (e) {
                    resolve({ ok: false, data: data });
                }
            });
        });

        req.on('error', reject);
        if (options.body) req.write(JSON.stringify(options.body));
        req.end();
    });
}

// 1. الحصول على توكن المصادقة
async function getPaymobAuthToken() {
    const response = await httpsRequest('https://accept.paymob.com/api/auth/tokens', {
        body: { api_key: PAYMOB_API_KEY }
    });
    return response.data.token;
}

// 2. تسجيل الطلب في Paymob
async function registerOrder(authToken, userId, userName, userEmail, userPhone, amountInCents) {
    const response = await httpsRequest('https://accept.paymob.com/api/ecommerce/orders', {
        body: {
            auth_token: authToken,
            delivery_needed: "false",
            amount_cents: amountInCents,
            currency: "EGP",
            items: [],
            merchant_order_id: `ORDER_${userId}_${Date.now()}`,
            customer: {
                first_name: userName.split(' ')[0],
                last_name: userName.split(' ').slice(1).join(' ') || '',
                email: userEmail,
                phone_number: userPhone,
            }
        }
    });
    return response.data.id;
}

// 3. الحصول على مفتاح الدفع (Payment Key)
async function getPaymentKey(authToken, orderId, amountInCents, userEmail, userPhone, userName) {
    const response = await httpsRequest('https://accept.paymob.com/api/acceptance/payment_keys', {
        body: {
            auth_token: authToken,
            amount_cents: amountInCents,
            expiration: 3600,
            order_id: orderId,
            billing_data: {
                apartment: "NA",
                email: userEmail,
                floor: "NA",
                first_name: userName.split(' ')[0],
                street: "NA",
                building: "NA",
                phone_number: userPhone,
                shipping_method: "NA",
                postal_code: "NA",
                city: "Cairo",
                country: "EG",
                last_name: userName.split(' ').slice(1).join(' ') || '',
                state: "NA"
            },
            currency: "EGP",
            integration_id: INTEGRATION_ID
        }
    });
    return response.data.token;
}

// 4. التحقق من صحة الـ Webhook (HMAC)
function verifyPaymobHmac(payload) {
    const hmac = crypto.createHmac('sha512', process.env.PAYMOB_HMAC_SECRET);
    const concatenatedString =
        payload.amount_cents +
        payload.created_at +
        payload.currency +
        payload.error_occured +
        payload.has_parent_transaction +
        payload.id +
        payload.integration_id +
        payload.is_3d_secure +
        payload.is_auth +
        payload.is_capture +
        payload.is_refunded +
        payload.is_standalone_payment +
        payload.is_voided +
        payload.order +
        payload.owner +
        payload.pending +
        payload.source_data_pan +
        payload.source_data_sub_type +
        payload.source_data_type +
        payload.success;

    hmac.update(concatenatedString);
    return hmac.digest('hex') === payload.hmac;
}

module.exports = {
    getPaymobAuthToken,
    registerOrder,
    getPaymentKey,
    verifyPaymobHmac
};
