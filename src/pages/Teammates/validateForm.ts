import { checkEmail } from '../../utils/formValidationRules';

export default function validateForm(values: any, meta: any) {
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