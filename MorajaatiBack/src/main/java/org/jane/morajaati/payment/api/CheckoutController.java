package org.jane.morajaati.payment.api;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.jane.morajaati.payment.api.dto.CheckoutRequestDTO;
import org.jane.morajaati.payment.domain.model.CourseCheckout;
import org.jane.morajaati.payment.domain.service.CheckoutService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.security.Principal;

import static org.jane.morajaati.payment.api.CheckoutMetaDataHandler.addMetaData;

@RestController()
@RequestMapping("/api/payments")
public class CheckoutController {
    @Value("${stripe.success.url}")
    private String successUrl;

    @Value("${stripe.cancel.url}")
    private String cancelUrl;

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/checkout")
    String checkout(
            Principal principal,
            @RequestBody CheckoutRequestDTO requestDTO
    ) throws Exception {
        CourseCheckout courseCheckout = checkoutService.processCheckout(principal, requestDTO.courseId());


        SessionCreateParams.Builder paramsBuilder =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setCustomer(courseCheckout.customer().getId())
                        .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}")
                        .setCancelUrl(cancelUrl);

        addMetaData(paramsBuilder, new SessionMetaData(courseCheckout.user().id(), courseCheckout.course().id()));

        paramsBuilder.addLineItem(
                SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .putMetadata("app_id", courseCheckout.course().id().toString())
                                                        .setName(courseCheckout.course().title())
                                                        .build()
                                        )
                                        .setCurrency(courseCheckout.course().price().currency().toString())
                                        .setUnitAmountDecimal(BigDecimal.valueOf(courseCheckout.course().price().amount() * 100L))
                                        .build())
                        .build());

        Session session = Session.create(paramsBuilder.build());

        return session.getUrl();
    }
}