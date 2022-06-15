export enum ConstraintErrorKeynameEnum {
    // Array
    ArrayContains = "ARRAY_CONTAINS",
    ArrayInvalid = "ARRAY_INVALID",
    ArrayMaxSize = "ARRAY_MAX_SIZE",
    ArrayMinSize = "ARRAY_MIN_SIZE",
    ArrayNotContains = "ARRAY_NOT_CONTAINS",
    ArrayNotEmpty = "ARRAY_NOT_EMPTY",
    ArrayUnique = "ARRAY_UNIQUE",

    // Common
    Allow = "ALLOW",
    Equals = "EQUALS",
    IsDefined = "IS_DEFINED",
    IsEmpty = "IS_EMPTY",
    IsIn = "IS_IN",
    IsLatitude = "IS_LATITUDE",
    IsLatLong = "IS_LAT_LONG",
    IsLongitude = "IS_LONGITUDE",
    IsNotEmpty = "IS_NOT_EMPTY",
    IsNotIn = "IS_NOT_IN",
    IsOptional = "IS_OPTIONAL",
    NotEquals = "NOT_EQUALS",

    // Date
    InvalidDate = "INVALID_DATE",
    MaxDate = "MAX_DATE",
    MinDate = "MIN_DATE",

    // Number
    IsDivisibleBy = "IS_DIVISIBLE_BY",
    IsNegative = "IS_NEGATIVE",
    IsPositive = "IS_POSITIVE",
    Max = "MAX",
    Min = "Min",

    // Object
    IsInstance = "IS_INSTANCE",
    IsNotEmptyObject = "IS_NOT_EMPTY_OBJECT",

    // String

    // Typechecker
    IsArray = "IS_ARRAY",
    IsBoolean = "IS_BOOLEAN",
    IsDate = "IS_DATE",
    IsEnum = "IS_ENUM",
    IsInt = "IS_INT",
    IsNumber = "IS_NUMBER",
    IsObject = "IS_OBJECT",
    IsString = "IS_STRING",

}
