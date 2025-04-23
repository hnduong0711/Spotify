import { Instagram, Twitter, Facebook } from 'lucide-react'

function Footer() {
  return (
    <footer className=" border-t-2 border-spotify-highlight/20 text-gray-400 py-12 px-6 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Cột 1: Công ty */}
        <div>
          <h3 className="text-white font-semibold mb-4">Công ty</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Giới thiệu</a></li>
            <li><a href="#" className="hover:text-white">Việc làm</a></li>
            <li><a href="#" className="hover:text-white">For the Record</a></li>
          </ul>
        </div>
        {/* Cột 2: Cộng đồng */}
        <div>
          <h3 className="text-white font-semibold mb-4">Cộng đồng</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Dành cho các Nghệ sĩ</a></li>
            <li><a href="#" className="hover:text-white">Nhà phát triển</a></li>
            <li><a href="#" className="hover:text-white">Quảng cáo</a></li>
            <li><a href="#" className="hover:text-white">Nhà đầu tư</a></li>
            <li><a href="#" className="hover:text-white">Nhà cung cấp</a></li>
          </ul>
        </div>
        {/* Cột 3: Liên kết hữu ích */}
        <div>
          <h3 className="text-white font-semibold mb-4">Liên kết hữu ích</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Hỗ trợ</a></li>
            <li><a href="#" className="hover:text-white">Ứng dụng Di động Miễn phí</a></li>
          </ul>
        </div>
        {/* Cột 4: Các gói của Spotify */}
        <div>
          <h3 className="text-white font-semibold mb-4">Các gói của Spotify</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Premium Individual</a></li>
            <li><a href="#" className="hover:text-white">Premium Student</a></li>
            <li><a href="#" className="hover:text-white">Spotify Free</a></li>
          </ul>
        </div>
        {/* Cột 5: Icon mạng xã hội */}
        <div className="flex justify-end space-x-4">
          <a href="#" className="text-gray-100 w-fit h-fit p-2 rounded-full bg-slate-700 hover:text-spotify-base">
            <Instagram size={24} />
          </a>
          <a href="#" className="text-gray-100 w-fit h-fit p-2 rounded-full bg-slate-700 hover:text-spotify-base">
            <Twitter size={24} />
          </a>
          <a href="#" className="text-gray-100 w-fit h-fit p-2 rounded-full bg-slate-700 hover:text-spotify-base">
            <Facebook size={24} />
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-gray-700 mt-8 pt-6 flex flex-wrap justify-between text-sm">
        <div className="flex flex-wrap space-x-4">
          <a href="#" className="hover:text-white">Pháp lý</a>
          <a href="#" className="hover:text-white">Trung tâm an toàn và quyền riêng tư</a>
          <a href="#" className="hover:text-white">Chính sách quyền riêng tư</a>
          <a href="#" className="hover:text-white">Cookie</a>
          <a href="#" className="hover:text-white">Giới thiệu Quảng cáo</a>
          <a href="#" className="hover:text-white">Hỗ trợ tiếp cận</a>
        </div>
        <div className="mt-4 md:mt-0">
          <p>© 2025 Spotify AB</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer