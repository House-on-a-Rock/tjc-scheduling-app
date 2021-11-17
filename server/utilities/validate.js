import * as yup from 'yup';

// TODO integrate yup into backend server validations

// const schema = yup.object().shape({
//   name: yup.string().required(),
//   age: yup.number().required().positive().integer(),
//   email: yup.string().email(),
//   website: yup.string().url(),
//   createdOn: yup.date().default(() => {
//     return new Date();
//   }),
// });

// // check validity
// schema
//   .isValid({
//     name: 'jimmy',
//     age: 24,
//   })
//   .then((valid) => {
//     return valid; // => true
//   });

// schema.cast({
//   name: 'jimmy',
//   age: '24',
//   createdOn: '2014-09-23T19:25:25Z',
// });

const userSchema = (input) =>
  yup.object().shape({
    loginTimeout: yup.date().min(new Date().getTime()),
    password: yup
      .string()
      .test('', (password) => password !== input.password)
      .typeError(['Invalid Username or Password', 401]),

    // ).typeError(["Too many login attempts", 400])
  });

// function parseDateString(value, originalValue) {
//   const parsedDate = isDate(originalValue)
//     ? originalValue
//     : parse(originalValue, "yyyy-MM-dd", new Date());

//   return parsedDate;
// }
