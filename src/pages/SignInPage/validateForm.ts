import { checkEmail, checkPassword } from '../../utils/formValidationRules';

export default function validateForm(values: { email: string, password: string, }) {
  let errors: any = {};

  let emailError = checkEmail(values.email);
  let passwordError = checkPassword(values.password);

  errors = {
    ...(emailError && { email: emailError }),
    ...(passwordError && { password: passwordError }),
  };

  return {
    errors,
    formattedValues: values,
  };
}