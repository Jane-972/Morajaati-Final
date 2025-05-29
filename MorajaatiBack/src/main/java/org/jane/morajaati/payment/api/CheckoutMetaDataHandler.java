package org.jane.morajaati.payment.api;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import java.util.Map;
import java.util.UUID;

public class CheckoutMetaDataHandler {
    private static final String COURSE_ID = "course_id";
    private static final String STUDENT_ID = "student_id";

    public static void addMetaData(
            SessionCreateParams.Builder builder,
            SessionMetaData metaData
    ) {
        builder
                .putMetadata(STUDENT_ID, metaData.userId().toString())
                .putMetadata(COURSE_ID, metaData.courseId().toString());
    }

    public static SessionMetaData getMetaData(Session session) {
        Map<String, String> metadata = session.getMetadata();
        return new SessionMetaData(
                UUID.fromString(metadata.get(STUDENT_ID)),
                UUID.fromString(metadata.get(COURSE_ID))
        );
    }
}
