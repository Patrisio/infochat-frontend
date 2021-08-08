import {
  checkPassword, checkConfirmPassword,
  checkName, checkSurname
} from '../../utils/formValidationRules';

export default function validateForm(values: any, meta: any) {
  let errors: any = {};

  const nameError = checkName(values.name);
  const surnameError = checkSurname(values.surname);
  const passwordError = checkPassword(values.password);
  const confirmPasswordError = checkConfirmPassword(values.password, values.confirmPassword);

  errors = {
    ...(nameError && { name: nameError }),
    ...(surnameError && { surname: surnameError }),
    ...(passwordError && { password: passwordError }),
    ...(confirmPasswordError && { confirmPassword: confirmPasswordError }),
  };

  return {
    errors,
    formattedValues: {
      name: values.name,
      surname: values.surname,
      password: values.password,
    },
  };
}