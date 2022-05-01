import { Form } from '@remix-run/react'

export default function Index () {
  return (

    <div>
      <div className='hero min-h-screen bg-base-200'>
        <div className='hero-content flex-col lg:flex-row-reverse'>
          <Form tabIndex={0} id='form' method='post' className='card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
            <div className='card-body'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>user</span>
                </label>
                <input type='text' name='user' placeholder='Type here' className='input input-bordered input-success w-full max-w-xs' />
              </div>
              <div className='form-control mt-6'>
                <button type='submit' className='btn btn-primary'>JOIN</button>
              </div>
            </div>
          </Form>
        </div>
      </div>
      <div className='mockup-code'>
        <pre data-prefix='$'><code>load video</code></pre>
        <pre data-prefix='>' className='text-warning'><code>installing...</code></pre>
        <pre data-prefix='>' className='text-success'><code>Done!</code></pre>
        <section className='w-[20rem] h-[20rem] mx-auto' id='user-video' />
      </div>
    </div>

  )
}
