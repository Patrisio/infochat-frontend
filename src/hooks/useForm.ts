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
    console.log(values, 'VALUES');

    const { errors, formattedValues } = validate(values, meta);

    setErrors(errors);
    setFormValues(formattedValues);
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback(values);
    }
  }, [errors]);

  return { handleChange, handleSubmit, setFormValues, values, errors };
}