import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email Address'),
  password: Yup.string().required().min(6).label('Password'),
});
export const addDetailsValidationScema = Yup.object().shape({
  fullname: Yup.string().required().label('Full Name'),
  username: Yup.string()
    .required()
    .label('Username')
    .matches(
      /^[a-zA-Z0-9_.-]*$/,
      'Username can only contain letters, numbers, underscores, dashes and periods.'
    ),
  phone: Yup.string().required().label('Phone Number'),
  city: Yup.string().required().label('City'),
  about: Yup.string().required().label('About You'),
  gender: Yup.string().required(),
  interested: Yup.string().required(),
  dateOfBirth: Yup.string().required().label('Date of Birth'),
});

export const signupValidationSchema = Yup.object().shape({
  fullname: Yup.string().required().label('Full Name'),
  username: Yup.string()
    .required()
    .label('Username')
    .matches(
      /^[a-zA-Z0-9_.-]*$/,
      'Username can only contain letters, numbers, underscores, dashes and periods.'
    ),
  email: Yup.string().required().email().label('Email Address'),
  phone: Yup.string().required().label('Phone Number'),
  city: Yup.string().required().label('City'),
  about: Yup.string().required().label('About You'),
  gender: Yup.string().required(),
  interested: Yup.string().required(),
  dateOfBirth: Yup.string().required().label('Date of Birth'),
});

export const changePasswordValidationSchema = Yup.object().shape({
  oldPassword: Yup.string().required().min(6).label('Old Password'),
  password: Yup.string().required().min(6).label('New Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must match new password.')
    .required('Confirm Password is required.'),
});

export const passwordResetSchema = Yup.object().shape({
  email: Yup.string()
    .required('Please enter a registered email address')
    .label('Email')
    .email('Enter a valid email address'),
});

export const personalInfoValidationSchema = Yup.object().shape({
  fullname: Yup.string().required().label('Full Name'),
  email: Yup.string().required().email().label('Email Address'),
  phone: Yup.string().required().label('Phone Number'),
  city: Yup.string().required().label('City'),
  about: Yup.string().required().label('About You'),
  dateOfBirth: Yup.string().required().label('Date of Birth'),
});

export const uploadFeedsSchema = Yup.object().shape({
  image: Yup.string(),
});

export const supportSchema = Yup.object().shape({
  comment: Yup.string().required(),
});

export const socialLinksValidationSchema = Yup.object().shape({
  facebook: Yup.string().matches(
    /^(http|https):\/\/?(www\.)?facebook.com\/?/i,
    'Enter a valid Facebook URL'
  ),
  intagram: Yup.string().matches(
    /^(http|https):\/\/?(www\.)?instagram.com\/?/i,
    'Enter a valid Instagram URL'
  ),
  twitter: Yup.string().matches(
    /^(http|https):\/\/?(www\.)?twitter.com\/?/i,
    'Enter a valid Twitter URL'
  ),
  linkedin: Yup.string().matches(
    /^(http|https):\/\/?(www\.)?linkedin.com\/?/i,
    'Enter a valid LinkedIn URL'
  ),
});
