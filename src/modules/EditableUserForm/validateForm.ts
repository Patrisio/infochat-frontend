import {
  checkPassword, checkConfirmPassword,
  checkName, checkSurname, checkEmail
} from 'lib/utils/formValidationRules';

export default function validateForm(values: any, meta: any) {
  let errors: any = {};

  const getFormattedValues = (values: any) => {
    const { email, confirmEmail, password, name, surname } = values;
    const formattedValues: { [key: string]: string } = {
      oldEmail: email,
      name,
      surname,
    };

    if (meta.isEditableEmail) {
      formattedValues.email = confirmEmail;
    }

    if (meta.isEditablePassword) {
      formattedValues.password = password;
    }

    return formattedValues;
  };

  const nameError = checkName(values.name);
  const surnameError = checkSurname(values.surname);
  let emailError;
  let confirmEmailError;
  let passwordError;
  let confirmPasswordError;

  if (meta.isEditableEmail) {
    emailError = checkEmail(values.email);
    confirmEmailError = checkEmail(values.confirmEmail);
  }

  if (meta.isEditablePassword) {
    passwordError = checkPassword(values.password);
    confirmPasswordError = checkConfirmPassword(values.password, values.confirmPassword)
  }

  errors = {
    ...(nameError && { name: nameError }),
    ...(surnameError && { surname: surnameError }),
    ...(emailError && { email: emailError }),
    ...(confirmEmailError && { confirmEmail: confirmEmailError }),
    ...(passwordError && { password: passwordError }),
    ...(confirmPasswordError && { confirmPassword: confirmPasswordError }),
  };

  return {
    errors,
    formattedValues: Object.keys(errors).length === 0 ? getFormattedValues(values) : values,
  };
}