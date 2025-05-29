ALTER TABLE courses
    ALTER COLUMN price TYPE DECIMAL USING price::DECIMAL,

    ADD COLUMN price_currency VARCHAR(20) DEFAULT 'EUR'
;


ALTER TABLE courses
    RENAME COLUMN price to price_amount;