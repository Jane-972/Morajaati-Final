package org.jane.morajaati.payment.domain.service;

import com.stripe.model.Customer;
import org.jane.morajaati.courses.domain.model.Course;
import org.jane.morajaati.courses.domain.service.CourseService;
import org.jane.morajaati.payment.domain.model.CourseCheckout;
import org.jane.morajaati.users.domain.model.UserModel;
import org.jane.morajaati.users.domain.service.UserService;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.UUID;

import static org.jane.morajaati.payment.client.CustomerUtil.findOrCreateCustomer;

@Service
public class CheckoutService {
    private final UserService userService;
    private final CourseService courseService;

    public CheckoutService(UserService userService, CourseService courseService) {
        this.userService = userService;
        this.courseService = courseService;
    }

    public CourseCheckout processCheckout(Principal principal, UUID courseId) throws Exception {
        UserModel user = userService.getCurrentUser(principal);
        Course course = courseService.getCourseById(courseId);
        Customer customer = findOrCreateCustomer(user.email(), user.firstName());
        return new CourseCheckout(course, user, customer);
    }
}
