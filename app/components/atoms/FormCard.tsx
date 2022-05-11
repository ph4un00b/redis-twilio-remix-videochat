import { Form } from '@remix-run/react'
import { FormEventHandler, ReactNode } from 'react'

interface FormOpts {
  children: ReactNode
  gridRows?: string
  onSubmitHandler?: FormEventHandler<HTMLFormElement>
}

export default function FormCard ({ children, onSubmitHandler, gridRows = 'grid-rows-1' }: FormOpts) {
  return (
    <Form
      method='post'
      noValidate
      onSubmit={onSubmitHandler}
      tabIndex={0}
      className={`card grid ${gridRows} grid-cols-8 w-[36rem] h-[36rem] bg-base-100 shadow-xl inset-0 m-auto`}
    >
      {children}
    </Form>
  )
}
