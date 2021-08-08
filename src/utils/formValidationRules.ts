export function checkEmail(email: string) {
  if (!email) {
    return 'Введите e-mail';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    return 'Введите корректный e-mail';
  }
}

export function checkName(name: string) {
  if (!name.trim()) {
    return 'Введите ваше имя';
  }
}

export function checkSurname(surname: string) {
  if (!surname.trim()) {
    return 'Введите вашy фамилию';
  }
}

export function checkUsername(username: string) {
  if (!username.trim()) {
    return 'Введите имя пользователя';
  } else if (username.split(' ').length < 2) {
    return 'Введите ваше имя и фамилию';
  }
}

export function checkPhone(phone: string) {
  if (!phone.trim()) {
    return 'Введите номер телефона';
  }
}

export function checkPassword(password: string) {
  if (!password) {
    return 'Введите пароль';
  } else if (password.length < 6) {
    return 'Пароль должен содержать как минимкм 6 символов';
  }
}

export function checkConfirmPassword(password: string, confirmPassword: string) {
  if (!confirmPassword) {
    return 'Введите пароль для потверждения';
  } else if (confirmPassword !== password) {
    return 'Пароли не совпадают';
  }
}