import { ReactNode } from 'react'

const linearGradient = {
  background: 'linear-gradient(to bottom right, #3232AB 62%, #F3F4F6 62%)'
}

export default function ContentBlock ({ children }: { children: ReactNode }) {
  return (
    <div className='drawer drawer-mobile'>
      <input id='my-drawer-3' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content flex flex-col'>
        <section className='grid grid-rows-[8rem_1fr_8rem] bg-gray-500'>
          {children}
        </section>
      </div>
    </div>
  )
}
