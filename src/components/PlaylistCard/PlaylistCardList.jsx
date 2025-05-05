import Slider from 'react-slick'
import PlaylistItem from './PlaylistItem'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

function PlaylistCardList({ title, data, type }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-white">{title}</h2>
      {data.length <= 1 ? (
        <div className="grid grid-cols-4">
          {data.map(playlist => (
            <PlaylistItem key={playlist.id} playlist={playlist} type={type}/>
          ))}
        </div>
      ) : (
        <Slider {...settings}>
          {data.map(playlist => (
            <PlaylistItem key={playlist.id} playlist={playlist} type={type}/>
          ))}
        </Slider>
      )}
    </div>
  )
}

export default PlaylistCardList