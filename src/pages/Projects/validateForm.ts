import { checkProjectName } from '../../utils/formValidationRules';

export default function validateForm(values: any, meta: any) {
  let errors: any = {};

  let projectNameError = checkProjectName(values.projectName);
  
  errors = {
    ...(projectNameError && { projectName: projectNameError }),
  };

  return {
    errors,
    formattedValues: {
      ...values,
      name: values.projectName,
    },
  };
}