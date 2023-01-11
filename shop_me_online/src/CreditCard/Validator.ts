import valid from "card-validator";

//interface
import { MyFormValues as MyProps } from "../Components/Forms/CreditCardForm";
import { Errors } from "../Components/Forms/CreditCardForm";

export default function validator(values: MyProps) {
  let creditCard: any = valid.number(values.card_number);

  creditCard.expirationDate = valid.expirationDate(values.card_expiration);
  creditCard.cvv = valid.cvv(values.card_security_code);
  creditCard.cardholderName = valid.cardholderName(values.card_name);

  let errors: Errors = {
    show: true,
    color: "red",
    message: "An unknown error occured. Please try again later",
    cname: false,
    cnumber: false,
    cexp: false,
    ccvv: false
  };

  //Card CVV expiration
  if (values.card_security_code === '' || !values.card_security_code.trim()) {
    errors.message = "Credit card CVC is not complete";
  } else if (creditCard.cvv.isValid) {
    errors.ccvv = true;
  } else {
    errors.message = "Credit card CVC is invalid";
  }

  //Card Expiration Verification
  if (values.card_expiration === '' || !values.card_expiration.trim()) {
    errors.message = "Credit card expiration date is not complete";
  } else if (creditCard.expirationDate.isValid) {
    errors.cexp = true;
  } else {
    errors.message = "Credit card expiration date is invalid";
  }

  //Card Number Verification
  if (values.card_number === '' || !values.card_number.trim()) {
    errors.message = "Credit card number is not complete";
  } else if (creditCard.isValid) {
    errors.cnumber = true;
  } else {
    errors.message = "Credit card number is invalid";
  }

  //Cardholder Name Verification
  if (values.card_name === '' || !values.card_name.trim()) {
    errors.message = "Cardholder name is not complete";
  } else if (creditCard.cardholderName.isValid) {
    errors.cname = true;
  } else {
    errors.message = "Cardholder name is invalid";
  }

  if (
    errors.cname &&
    errors.cnumber &&
    errors.cexp &&
    errors.ccvv
  ) {
    errors.color = "green";
    errors.message = "Credit Card is valid";
  }

  return errors;
}