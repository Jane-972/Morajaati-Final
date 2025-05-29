package org.jane.morajaati.courses.api.dto;

import lombok.Getter;
import org.jane.morajaati.courses.domain.model.Currency;

import java.util.Arrays;

public enum CurrencyDto {
    EUR(Currency.EUR),
    USD(Currency.USD),
    MAD(Currency.MAD)
    ;

    @Getter
    private final Currency model;

    CurrencyDto(Currency model) {
        this.model = model;
    }

    static CurrencyDto fromModel(Currency model) {
        return Arrays.stream(values()).filter(c -> c.model == model).findFirst().orElseThrow(IllegalStateException::new);
    }
}
