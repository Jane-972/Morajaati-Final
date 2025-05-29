package org.jane.morajaati.courses.repo.course;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.jane.morajaati.courses.domain.model.Course;
import org.jane.morajaati.courses.domain.model.CoursePrice;
import org.jane.morajaati.courses.domain.model.Currency;
import org.springframework.lang.Nullable;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "courses")
public class CourseEntity {
    @Getter
    @Id
    private UUID id;
    private UUID professorId;

    @Getter
    private String title;
    @Getter
    private String description;
    @Nullable
    private Double rating;
    private int numberReviews;
    private double priceAmount;
    private String priceCurrency;

    @Setter
    @Getter
    private UUID thumbnail;
    @Getter
    private LocalDateTime uploadDate;

    public CourseEntity() {

    }

    public CourseEntity(UUID id,
                        UUID professorId,
                        String title,
                        String description,
                        double rating,
                        int numberOfReviews,
                        double priceAmount,
                        String priceCurrency,
                        LocalDateTime uploadDate
    ) {
        this.id = id;
        this.title = title;
        this.professorId = professorId;
        this.description = description;
        this.rating = rating;
        this.numberReviews = numberOfReviews;
        this.priceAmount = priceAmount;
        this.priceCurrency = priceCurrency;
        this.uploadDate = uploadDate;
    }

    public static CourseEntity from(Course course) {
        return new CourseEntity(course.id(),
                course.professorId(),
                course.title(),
                course.description(),
                course.rating(),
                course.numberOfReviews(),
                course.price().amount(),
                course.price().currency().name(),
                course.uploadDate()
        );
    }

    public Course toModel() {
        return new Course(id,
                professorId,
                title,
                description,
                numberReviews,
                new CoursePrice(priceAmount, Currency.valueOf(priceCurrency)),
                rating,
                uploadDate,
                thumbnail);
    }
}
