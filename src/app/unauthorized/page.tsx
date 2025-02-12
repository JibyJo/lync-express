export default function Unauthorized() {
  return (
    <div className='h-screen flex flex-col justify-center items-center text-center'>
      <h1 className='text-4xl font-bold text-yellow-500'>401 - Unauthorized</h1>
      <p className='text-gray-600 mt-4'>
        You do not have permission to view this page.
      </p>
      <a
        href='/login'
        className='mt-6 px-6 py-3 bg-red-500 text-white rounded-lg'
      >
        Login
      </a>
    </div>
  );
}
