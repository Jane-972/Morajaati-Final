package org.jane.morajaati.payment.admin;

import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.model.checkout.Session;
import com.stripe.model.checkout.SessionCollection;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class StripeAdminService {

  public List<Session> getAllCheckoutSessions() throws StripeException {
    SessionCollection sessions = Session.list(Map.of("limit", 100));
    return sessions.getData();
  }

  public List<Customer> getAllCustomers() throws StripeException {
    CustomerCollection customers = Customer.list(Map.of("limit", 100));
    return customers.getData();
  }

  public List<Charge> getAllCharges() throws StripeException {
    ChargeCollection charges = Charge.list(Map.of("limit", 100));
    return charges.getData();
  }

  public List<Product> getAllProducts() throws StripeException {
    ProductCollection products = Product.list(Map.of("limit", 100));
    return products.getData();
  }

}
