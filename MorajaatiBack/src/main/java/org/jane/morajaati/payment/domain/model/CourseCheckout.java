package org.jane.morajaati.payment.domain.model;

import com.stripe.model.Customer;
import org.jane.morajaati.courses.domain.model.Course;
import org.jane.morajaati.users.domain.model.UserModel;

public record CourseCheckout(
        Course course,
        UserModel user,
        Customer customer
) {
}
