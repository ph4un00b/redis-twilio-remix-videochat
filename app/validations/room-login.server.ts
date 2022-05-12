import * as yup from 'yup'

export async function keyValuesFrom (request: Request) {
  const form = await request.formData()
  const entries = Object.fromEntries(form)
  return entries
}

export async function validateRoom (formdata: { [k: string]: FormDataEntryValue }) {
  const schema = yup.object({
    user: yup.string().min(4)
      .required('user is a required field'),
    room: yup.string().min(4)
      .required('room is a required field')
  })

  try {
    const shape = await schema.validate(formdata, { abortEarly: false })
    return [shape, undefined]
  } catch (errors) {
    if (errors instanceof yup.ValidationError) {
      const { inner: innerErrors, value: values } = errors
      const messages = {} as any

      for (const error of innerErrors) {
        if (error.path && messages[error.path] === undefined) {
          messages[error.path] = error.message
        }
      }

      console.log(messages)
      const errs = { messages, values }
      return [undefined, errs]
    }

    return [undefined, true]
  }
}
