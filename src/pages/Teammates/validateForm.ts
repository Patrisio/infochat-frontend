import { checkEmail } from 'lib/utils/formValidationRules';

export default function validateForm(values: { email: string }) {
  let errors: any = {};

  let emailError = checkEmail(values.email);
  
  errors = {
    ...(emailError && { email: emailError }),
  };

  return {
    errors,
    formattedValues: {
      email: values.email,
    },
  };
}