import { checkEmail, checkPassword, checkPhone, checkUsername } from '../../utils/formValidationRules';

export default function validateForm(values: {
  email: string,
  password: string,
  phone: string,
  username: string,
}) {
  let errors: any = {};

  const usernameError = checkUsername(values.username);
  const phoneError = checkPhone(values.phone);
  const emailError = checkEmail(values.email);
  const passwordError = checkPassword(values.password);

  errors = {
    ...(usernameError && { username: usernameError }),
    ...(phoneError && { phone: phoneError }),
    ...(emailError && { email: emailError }),
    ...(passwordError && { password: passwordError }),
  };

  return {
    errors,
    formattedValues: values,
  };
}