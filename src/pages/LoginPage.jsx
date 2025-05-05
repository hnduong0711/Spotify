import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      // Gọi API login thật
      const response = await axios.post('http://localhost:8000/api/login', {
        username: data.username,
        password: data.password,
      })

      // Lưu access token và user vào localStorage
      const { access, user } = response.data
      localStorage.setItem('accessToken', access)
      localStorage.setItem('currentUser', JSON.stringify(user))

      toast.success('Login successful!')
      console.log('Login response:', response.data)
      window.location.href = '/'
      // Có thể thêm redirect sau: window.location.href = '/profile'
    } catch (error) {
      toast.error('Login failed! ' + (error.response?.data?.detail || 'Vui lòng kiểm tra username và mật khẩu!'))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-white"
    >
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Log In</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-black">Username</label>
            <input
              type="text"
              {...register('username')}
              className="w-full p-2 bg-gray-100 rounded border border-gray-300 text-black"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1 text-black">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
              className="w-full p-2 bg-gray-100 rounded border border-gray-300 text-black"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full border border-spotify-base text-spotify-base font-semibold py-2 rounded-full hover:bg-spotify-base hover:text-black cursor-pointer transition duration-300 ease-in-out"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-black">
          Bạn chưa có tài khoản?{' '}
          <Link to="/register" className="text-spotify-base font-semibold hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

export default LoginPage