package org.jane.morajaati.courses.api.dto;

import jakarta.validation.constraints.NotNull;
import org.jane.morajaati.courses.domain.model.CoursePrice;

public record CoursePriceDto(
        @NotNull Double amount,
        @NotNull CurrencyDto currency
) {
    public static CoursePriceDto fromModel(CoursePrice price) {
        return new CoursePriceDto(price.amount(), CurrencyDto.fromModel(price.currency()));
    }

    public CoursePrice toModel() {
        return new CoursePrice(amount, currency.getModel());
    }
}
