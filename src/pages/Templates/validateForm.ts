export default function validateForm(values: { name: string, message: string }) {
  let errors: any = {};

  if (!values.name) {
    errors.name = 'Введите название шаблона';
  }

  if (!values.message) {
    errors.message = 'Введите сообщение для шаблона';
  }

  return {
    errors,
    formattedValues: values,
  };
}