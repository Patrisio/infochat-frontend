import {
  checkEmail, checkPassword, checkPhone,
  checkUsername, checkProjectName,
} from 'lib/utils/formValidationRules';

export default function validateForm(values: {
  email: string,
  password: string,
  projectName: string,
  phone: string,
  username: string,
}) {
  let errors: any = {};

  const usernameError = checkUsername(values.username);
  const phoneError = checkPhone(values.phone);
  const emailError = checkEmail(values.email);
  const projectNameError = checkProjectName(values.projectName);
  const passwordError = checkPassword(values.password);

  errors = {
    ...(usernameError && { username: usernameError }),
    ...(phoneError && { phone: phoneError }),
    ...(emailError && { email: emailError }),
    ...(projectNameError && { projectName: projectNameError }),
    ...(passwordError && { password: passwordError }),
  };

  return {
    errors,
    formattedValues: values,
  };
}