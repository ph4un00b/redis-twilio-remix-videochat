import { FormStrategy } from 'remix-auth-form'
import { auth } from './auth.server'

auth.use(
  new FormStrategy(async ({ form }) => {
    // Here you can use `form` to access and input values from the form.
    // and also use `context` to access more things from the server
    const username = form.get('username') // or email... etc
    const password = form.get('password')

    // You can validate the inputs however you want
    //   invariant(typeof username === "string", "username must be a string");
    //   invariant(username.length > 0, "username must not be empty");

    //   invariant(typeof password === "string", "password must be a string");
    //   invariant(password.length > 0, "password must not be empty");

    // And if you have a password you should hash it
    const hashedPassword = hash(password)

    // And finally, you can find, or create, the user
    const user = findOrCreateUser(username, hashedPassword)

    // And return the user as the Authenticator expects it
    return user
  }),
  "user-pass"
)

// todo: hash or rely on redis encryption?
function hash (password: FormDataEntryValue | null) {
  // throw new Error("Function not implemented.");
  return password
}
function findOrCreateUser (username: any, hashedPassword: FormDataEntryValue | null) {
  // throw new Error("Function not implemented.");
  return 'phau'
}
