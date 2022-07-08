import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email Address'),
  password: Yup.string().required().min(6).label('Password'),
});

export const signupValidationSchema = Yup.object().shape({
  username: Yup.string().required().label('Username'),
  email: Yup.string().required().email().label('Email Address'),
  phone: Yup.string().required().label('Phone Number'),
  city: Yup.string().required().label('City'),
  about: Yup.string().required().label('About You'),
  dateOfBirth: Yup.string().required().label('Date of Birth'),
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required('Please enter a registered email address')
    .label('Email')
    .email('Enter a valid email address'),
});

export const personalInfoValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email Address'),
  phone: Yup.string().required().label('Phone Number'),
  city: Yup.string().required().label('City'),
  about: Yup.string().required().label('About You'),
  dateOfBirth: Yup.string().required().label('Date of Birth'),
});
