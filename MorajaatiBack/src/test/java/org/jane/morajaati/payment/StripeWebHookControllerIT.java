package org.jane.morajaati.payment;

import com.github.dockerjava.zerodep.shaded.org.apache.commons.codec.digest.HmacUtils;
import org.jane.morajaati.IntegrationTestBase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class StripeWebHookControllerIT extends IntegrationTestBase {
    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @Test
    public void testValidWebhookSignature() throws Exception {
        String payload = """
                {
                  "id": "evt_1NG8Du2eZvKYlo2CUI79vXWy",
                  "object": "event",
                  "api_version": "2019-02-19",
                  "created": 1686089970,
                  "data": {
                    "object": {
                      "id": "seti_1NG8Du2eZvKYlo2C9XMqbR0x",
                      "object": "setup_intent",
                      "application": null,
                      "automatic_payment_methods": null,
                      "cancellation_reason": null,
                      "client_secret": "seti_1NG8Du2eZvKYlo2C9XMqbR0x_secret_O2CdhLwGFh2Aej7bCY7qp8jlIuyR8DJ",
                      "created": 1686089970,
                      "customer": null,
                      "description": null,
                      "flow_directions": null,
                      "last_setup_error": null,
                      "latest_attempt": null,
                      "livemode": false,
                      "mandate": null,
                      "metadata": {},
                      "next_action": null,
                      "on_behalf_of": null,
                      "payment_method": "pm_1NG8Du2eZvKYlo2CYzzldNr7",
                      "payment_method_options": {
                        "acss_debit": {
                          "currency": "cad",
                          "mandate_options": {
                            "interval_description": "First day of every month",
                            "payment_schedule": "interval",
                            "transaction_type": "personal"
                          },
                          "verification_method": "automatic"
                        }
                      },
                      "payment_method_types": [
                        "acss_debit"
                      ],
                      "single_use_mandate": null,
                      "status": "requires_confirmation",
                      "usage": "off_session"
                    }
                  },
                  "livemode": false,
                  "pending_webhooks": 0,
                  "request": {
                    "id": null,
                    "idempotency_key": null
                  },
                  "type": "setup_intent.created"
                }
                """;

        long timestamp = System.currentTimeMillis() / 1000;
        String signedPayload = timestamp + "." + payload;
        String signature = "t=" + timestamp + ",v1=" + HmacUtils.hmacSha256Hex(webhookSecret, signedPayload);

        mvc.perform(post("/api/stripe/webhook")
                        .content(payload)
                        .header("Stripe-Signature", signature)
                        .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk());
    }

    @Test
    public void testInvalidWebhookSignature() throws Exception {
        String payload = "{\"id\":\"evt_test_webhook\",\"object\":\"event\"}";
        long timestamp = System.currentTimeMillis() / 1000;
        String invalidSignature = "t=" + timestamp + ",v1=" + "invalid_signature";

        mvc.perform(post("/api/stripe/webhook")
                        .content(payload)
                        .header("Stripe-Signature", invalidSignature)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testMissingSignatureHeader() throws Exception {
        String payload = "{\"id\":\"evt_test_webhook\",\"object\":\"event\"}";

        mvc.perform(post("/api/stripe/webhook")
                        .content(payload)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
