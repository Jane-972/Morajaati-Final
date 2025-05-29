package org.jane.morajaati.payment.admin;

import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Customer;
import com.stripe.model.Product;
import com.stripe.model.checkout.Session;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/stripe")
public class StripeAdminController {

  private final StripeAdminService stripeAdminService;

  public StripeAdminController(StripeAdminService stripeAdminService) {
    this.stripeAdminService = stripeAdminService;
  }

  @GetMapping("/sessions")
  public ResponseEntity<List<Session>> getSessions() throws StripeException {
    return ResponseEntity.ok(stripeAdminService.getAllCheckoutSessions());
  }

  @GetMapping("/customers")
  public ResponseEntity<List<Customer>> getCustomers() throws StripeException {
    return ResponseEntity.ok(stripeAdminService.getAllCustomers());
  }

  @GetMapping("/charges")
  public ResponseEntity<List<Charge>> getCharges() throws StripeException {
    return ResponseEntity.ok(stripeAdminService.getAllCharges());
  }

  @GetMapping("/products")
  public ResponseEntity<List<Product>> getProducts() throws StripeException {
    return ResponseEntity.ok(stripeAdminService.getAllProducts());
  }

}
