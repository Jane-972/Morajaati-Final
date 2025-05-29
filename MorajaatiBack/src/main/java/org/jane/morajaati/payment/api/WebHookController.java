package org.jane.morajaati.payment.api;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.jane.morajaati.students.domain.service.UserEnrollmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.jane.morajaati.payment.api.CheckoutMetaDataHandler.getMetaData;


@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class WebHookController {
    private final Logger logger = LoggerFactory.getLogger(WebHookController.class);

    @Value("${stripe.webhook-secret}")
    private String endpointSecret;

    private final UserEnrollmentService userEnrollmentService;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        Event event;

        try {
            // Verify webhook signature
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
            logger.info("Received Stripe event: {}", event.getType());
        } catch (SignatureVerificationException e) {
            logger.error("Webhook signature verification failed.", e);
            return ResponseEntity.badRequest().body("Invalid signature");
        } catch (Exception e) {
            logger.error("Webhook processing failed.", e);
            return ResponseEntity.badRequest().body("Error processing webhook");
        }

        // Handle checkout.session.completed event
        if ("checkout.session.completed".equals(event.getType())) {
            handleCheckoutSessionCompleted(event);
        }

        return ResponseEntity.ok().build();
    }

    private void handleCheckoutSessionCompleted(Event event) {
        // Deserialize the nested object inside the event
        Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);

        if (session == null) {
            logger.error("Failed to deserialize checkout session from event");
            return;
        }

        // Only process paid sessions
        if ("paid".equals(session.getPaymentStatus())) {
            SessionMetaData metaData = getMetaData(session);

            logger.info("User {} successfully processed paid for course {}", metaData.userId(), metaData.courseId());

            try {
                userEnrollmentService.enroll(metaData.userId(), metaData.courseId());
            } catch (Exception e) {
                logger.error("Failed to enroll course for user {}", metaData.userId(), e);
                throw e;
            }
        } else {
            logger.info("Session {} completed but not paid yet", session.getId());
        }
    }
}
