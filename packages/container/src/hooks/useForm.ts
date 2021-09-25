import { useState, useEffect } from 'react';

export default function useForm(
  initialValues: any,
  validate: (values: any, meta: any) => any,
  callback: any,
  meta?: any,
) {
  const [values, setFormValues] = useState<any>(initialValues);
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: any, fieldType?: string) => {
    const { name, value } = e.target;

    if (fieldType === 'textarea') {
      const message = value.split('\n').join('<br />');
      
      setFormValues({
        ...values,
        [name]: message
      });
      return;
    }

    setFormValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { errors, formattedValues } = validate(values, meta);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
    }

    setErrors(errors);
    setFormValues(formattedValues);
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback(values, () => setIsSubmitting(false));
    }
  }, [errors]);

  return { handleChange, handleSubmit, setFormValues, values, errors, isSubmitting };
}